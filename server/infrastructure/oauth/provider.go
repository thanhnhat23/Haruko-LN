package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"golang.org/x/oauth2"
)

const (
	ProviderGoogle   = "google"
	ProviderX        = "twitter"
	ProviderDiscord  = "discord"
	ProviderFacebook = "facebook"
)

type UserInfo struct {
	ProviderUserID string
	Email          string
	EmailVerified  bool
	UserName       string
	AvatarURL      string
}
type Provider interface {
	Name() string
	AuthCodeURL(state, verifier string) string
	Exchange(ctx context.Context, code, verifier string) (*oauth2.Token, error)
	FetchUser(ctx context.Context, tok *oauth2.Token) (*UserInfo, error)
}

type base struct {
	name   string
	cfg    *oauth2.Config
	isPKCE bool
}

func (b *base) Name() string {
	return b.name
}
func (b *base) AuthCodeURL(state, verifier string) string {
	if b.isPKCE {
		return b.cfg.AuthCodeURL(state, oauth2.S256ChallengeOption(verifier))
	}
	return b.cfg.AuthCodeURL(state)
}
func (b *base) Exchange(ctx context.Context, code, verifier string) (*oauth2.Token, error) {
	if b.isPKCE {
		return b.cfg.Exchange(ctx, code, oauth2.VerifierOption(verifier))

	}
	return b.cfg.Exchange(ctx, code)
}
func (b *base) getJSON(ctx context.Context, tok *oauth2.Token, url string, out any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return err
	}
	resp, err := b.cfg.Client(ctx, tok).Do(req)
	if err != nil {
		return fmt.Errorf("%s: gọi userinfo: %w", b.name, err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		msg, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return fmt.Errorf("%s: userinfo trả về status %d: %s", b.name, resp.StatusCode, msg)
	}
	if err := json.NewDecoder(resp.Body).Decode(out); err != nil {
		return fmt.Errorf("%s: decode userinfo: %w", b.name, err)
	}
	return nil
}
func errMissingID(provider string) error {
	return fmt.Errorf("%s: userinfo thiếu id", provider)
}
