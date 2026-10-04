package oauth

import (
	"context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)
const googleUserInfoURL = "https://www.googleapis.com/oauth2/v3/userinfo"
type Google struct{base}
func NewGoogle(clientID, clientSecret, redirectURL string) Provider {
	return &Google{base{
		name: ProviderGoogle,
		isPKCE: true,
		cfg: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURL:  redirectURL,
			Scopes:       []string{"openid", "email", "profile"},
			Endpoint:     google.Endpoint,
		},
	}}
}
func (g *Google) FetchUser(ctx context.Context, tok *oauth2.Token) (*UserInfo, error) {
	var raw struct {
		Sub           string `json:"sub"`
		Email         string `json:"email"`
		EmailVerified bool   `json:"email_verified"`
		Name          string `json:"name"`
		Picture       string `json:"picture"`
	}
	if err := g.getJSON(ctx, tok, googleUserInfoURL, &raw); err != nil {
		return nil, err
	}
	if raw.Sub == "" {
		return nil, errMissingID(g.name)
	}
	return &UserInfo{
		ProviderUserID: raw.Sub,
		Email:          raw.Email,
		EmailVerified:  raw.EmailVerified,
		UserName:       raw.Name,      
		AvatarURL:      raw.Picture,   
	}, nil
}
