package auth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/thanhnhat23/Haruko-LN/internal/user"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

const (
	ProviderGoogle = "google"
	userInfoURL    = "https://www.googleapis.com/oauth2/v3/userinfo"
	jwtIssuer      = "haruko-ln"
	httpTimeout    = 10 * time.Second
)

var (
	ErrEmailNotVerified = errors.New("email chưa được Google xác minh")
	ErrExchangeFailed   = errors.New("không đổi được authorization code")
)
type Service struct{
	repo *Repository
	oauthConfig *oauth2.Config
	jwtSecret []byte
	tokenTTL time.Duration
}
func NewService(repo *Repository, cfg *oauth2.Config, jwtSecret []byte, tokenTTL time.Duration) *Service {
	return &Service{
		repo:      repo,
		oauthConfig:  cfg,
		jwtSecret: jwtSecret,
		tokenTTL:  tokenTTL,
	}
}
func (s *Service) AuthURL(state, verifier string) string{
 	return s.oauthConfig.AuthCodeURL(state,oauth2.S256ChallengeOption(verifier))
}

func (s *Service) HandleGoogleCallBack(ctxt context.Context, code, verifier string) (*LoginResponse, error) {
	ctxt, cancel := context.WithTimeout(ctxt, httpTimeout)
	defer cancel()
	token, err := s.oauthConfig.Exchange(ctxt, code, oauth2.VerifierOption(verifier))
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrExchangeFailed, err)
	}
	info, err := s.fetchGoogleUser(ctxt, token)
	if err != nil {
		return nil, err
	}
	if !info.EmailVerified {
		return nil, ErrEmailNotVerified
	}
	u, err := s.findOrCreateUser(info)
	if err != nil {
		return nil, err
	}
	jwttoken, err := s.issueJWT(u.User_ID)
	if err != nil {
		return nil, err
	}
	return &LoginResponse{
		AccessToken: jwttoken,
		ExpiresIn:   int(s.tokenTTL.Seconds()),
		User: UserInfo{
			UserID: u.User_ID,
			Email:  u.Email,
			Name:   u.Username,
			Avatar: u.Avatar,
		},
	}, nil
}
func (s *Service) fetchGoogleUser(ctx context.Context, tok *oauth2.Token) (*GoogleUserInfo, error) {
	client := s.oauthConfig.Client(ctx, tok)
	resp, err := client.Get(userInfoURL)
	if err != nil {
		return nil, fmt.Errorf("gọi userinfo: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("userinfo trả về status %d", resp.StatusCode)
	}
	var info GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, fmt.Errorf("decode userinfo: %w", err)
	}
	if info.Sub == "" {
		return nil, errors.New("userinfo thiếu trường sub")
	}
	return &info, nil
}

func (s *Service) findOrCreateUser(info *GoogleUserInfo) (*user.User, error) {
	acc, err := s.repo.FindOAuthAcc(ProviderGoogle, info.Sub)
	if err == nil {
		return s.repo.FindUserByID(acc.UserID)
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	newAcc := &OAuthAccount{
		Provider:       ProviderGoogle,
		ProviderUserID: info.Sub,
	} 
	u, err := s.repo.FindUserByEmail(info.Email)
	if err == nil {
		newAcc.UserID = u.User_ID
		if err := s.repo.LinkOAuthAcc(newAcc); err != nil {
			if errors.Is(err, ErrDuplicateLink) {
				return u, nil
			}
			return nil, err
		}
		return u, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	newUser := &user.User{
		Email:  info.Email,
		Username:   info.Name,
		Avatar: info.Avatar,
		IsVerify: true,
	}
	if err := s.repo.CreateUserWithOAuth(newUser, newAcc); err != nil {
		if errors.Is(err, ErrDuplicateLink) {
			acc, err2 := s.repo.FindOAuthAcc(ProviderGoogle, info.Sub)
			if err2 == nil {
				return s.repo.FindUserByID(acc.UserID)
			}
		}
		return nil, err
	}
	return newUser, nil
}

func (s *Service) issueJWT(userID uuid.UUID) (string, error) {
	now := time.Now()
	claims := jwt.RegisteredClaims{
		Subject:   userID.String(),
		Issuer:    jwtIssuer,
		IssuedAt:  jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(s.tokenTTL)),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(s.jwtSecret)
}
