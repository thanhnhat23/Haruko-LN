package auth

import (
	"context"
	"errors"
	"fmt"
	"math/rand/v2"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/thanhnhat23/Haruko-LN/infrastructure/oauth"
	"github.com/thanhnhat23/Haruko-LN/internal/user"
	"github.com/thanhnhat23/Haruko-LN/pkg/jwt"
)

const (
	httpTimeout      = 10 * time.Second
	maxAvatarLen     = 255
	maxUsernameLen   = 20
	maxUsernameBase  = 15
	usernameAttempts = 5
)

var (
	ErrUnknownProvider  = errors.New("provider không được hỗ trợ")
	ErrEmailMissing     = errors.New("tài khoản không cung cấp email")
	ErrEmailNotVerified = errors.New("email chưa được xác minh")
	ErrEmailConflict    = errors.New("email đã thuộc về một tài khoản chưa xác minh")
	ErrUserBanned       = errors.New("tài khoản đã bị khoá")
	ErrAccountDeleted   = errors.New("tài khoản đã bị xoá")
	ErrExchangeFailed   = errors.New("không đổi được authorization code")
)

type Service struct {
	repo      *Repository
	providers map[string]oauth.Provider
	jwtSecret []byte
	tokenTTL  time.Duration
}

func NewService(repo *Repository, providers []oauth.Provider, jwtSecret []byte, tokenTTL time.Duration) *Service {
	m := make(map[string]oauth.Provider, len(providers))
	for _, p := range providers {
		m[p.Name()] = p
	}
	return &Service{
		repo:      repo,
		providers: m,
		jwtSecret: jwtSecret,
		tokenTTL:  tokenTTL,
	}
}

func (s *Service) provider(name string) (oauth.Provider, error) {
	p, ok := s.providers[name]
	if !ok {
		return nil, ErrUnknownProvider
	}
	return p, nil
}

func (s *Service) AuthURL(providerName, state, verifier string) (string, error) {
	p, err := s.provider(providerName)
	if err != nil {
		return "", err
	}
	return p.AuthCodeURL(state, verifier), nil
}

func (s *Service) HandleCallback(ctx context.Context, providerName, code, verifier string) (*LoginResponse, error) {
	p, err := s.provider(providerName)
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(ctx, httpTimeout)
	defer cancel()

	token, err := p.Exchange(ctx, code, verifier)
	if err != nil {
		return nil, fmt.Errorf("%w: %w", ErrExchangeFailed, err)
	}
	info, err := p.FetchUser(ctx, token)
	if err != nil {
		return nil, err
	}
	u, err := s.findOrCreateUser(ctx, p.Name(), info)
	if err != nil {
		return nil, err
	}
	if err := usable(u); err != nil {
		return nil, err
	}
	accessToken, err := jwt.Sign(u.User_ID, s.jwtSecret, s.tokenTTL)
	if err != nil {
		return nil, err
	}
	return &LoginResponse{
		AccessToken: accessToken,
		ExpiresIn:   int(s.tokenTTL.Seconds()),
		User: UserInfo{
			UserID: u.User_ID,
			Email:  u.Email,
			Name:   u.Username,
			Avatar: u.Avatar,
		},
	}, nil
}

func (s *Service) findOrCreateUser(ctx context.Context, provider string, info *oauth.UserInfo) (*user.User, error) {
	acc, err := s.repo.FindOAuthAcc(ctx, provider, info.ProviderUserID)
	if err == nil {
		return s.repo.FindUserByID(ctx, acc.UserID)
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if info.Email == "" {
		return nil, ErrEmailMissing
	}
	if !info.EmailVerified {
		return nil, ErrEmailNotVerified
	}

	newAcc := &OAuthAccount{Provider: provider, ProviderUserID: info.ProviderUserID}

	u, err := s.repo.FindUserByEmail(ctx, info.Email)
	if err == nil {
		return s.linkExisting(ctx, u, newAcc)
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	return s.createUser(ctx, info, newAcc)
}

func (s *Service) linkExisting(ctx context.Context, u *user.User, acc *OAuthAccount) (*user.User, error) {
	if err := usable(u); err != nil {
		return nil, err
	}
	if !u.IsVerify {
		return nil, ErrEmailConflict
	}
	acc.UserID = u.User_ID
	if err := s.repo.LinkOAuthAcc(ctx, acc); err != nil && !errors.Is(err, ErrDuplicateLink) {
		return nil, err
	}
	return u, nil
}

func (s *Service) createUser(ctx context.Context, info *oauth.UserInfo, acc *OAuthAccount) (*user.User, error) {
	name, err := s.uniqueUsername(ctx, info.UserName)
	if err != nil {
		return nil, err
	}
	u := &user.User{
		Email:    info.Email,
		Username: name,
		Avatar:   fitAvatar(info.AvatarURL),
		IsVerify: true,
	}
	err = s.repo.CreateUserWithOAuth(ctx, u, acc)
	if errors.Is(err, ErrDuplicateLink) {
		existing, findErr := s.repo.FindOAuthAcc(ctx, acc.Provider, acc.ProviderUserID)
		if findErr != nil {
			return nil, findErr
		}
		return s.repo.FindUserByID(ctx, existing.UserID)
	}
	if err != nil {
		return nil, err
	}
	return u, nil
}

func (s *Service) uniqueUsername(ctx context.Context, displayName string) (string, error) {
	base := strings.TrimSpace(displayName)
	if base == "" {
		base = "user"
	}
	name := truncateRunes(base, maxUsernameLen)
	for range usernameAttempts {
		taken, err := s.repo.UsernameExists(ctx, name)
		if err != nil {
			return "", err
		}
		if !taken {
			return name, nil
		}
		name = fmt.Sprintf("%s_%04d", truncateRunes(base, maxUsernameBase), rand.IntN(10000))
	}
	return "", errors.New("không tạo được username không trùng")
}

func usable(u *user.User) error {
	switch {
	case u.DeletedAt.Valid:
		return ErrAccountDeleted
	case u.IsBanned:
		return ErrUserBanned
	}
	return nil
}

func fitAvatar(url string) string {
	if len(url) > maxAvatarLen {
		return ""
	}
	return url
}

func truncateRunes(s string, n int) string {
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	return string(r[:n])
}
