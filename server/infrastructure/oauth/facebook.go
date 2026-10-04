package oauth

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"

	"golang.org/x/oauth2"
)

const facebookGraphVersion = "v25.0"

const facebookUserURL = "https://graph.facebook.com/" + facebookGraphVersion +
	"/me?fields=id,name,email,picture.type(large)"

type Facebook struct{ base }

func NewFacebook(clientID, clientSecret, redirectURL string) Provider {
	return &Facebook{base{
		name: ProviderFacebook,
		cfg: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURL:  redirectURL,
			Scopes:       []string{"public_profile", "email"},
			Endpoint: oauth2.Endpoint{
				AuthURL:   "https://www.facebook.com/" + facebookGraphVersion + "/dialog/oauth",
				TokenURL:  "https://graph.facebook.com/" + facebookGraphVersion + "/oauth/access_token",
				AuthStyle: oauth2.AuthStyleInParams,
			},
		},
	}}
}

func (f *Facebook) FetchUser(ctx context.Context, tok *oauth2.Token) (*UserInfo, error) {
	var raw struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Picture struct {
			Data struct {
				URL string `json:"url"`
			} `json:"data"`
		} `json:"picture"`
	}
	url := facebookUserURL + "&appsecret_proof=" + f.appSecretProof(tok.AccessToken)
	if err := f.getJSON(ctx, tok, url, &raw); err != nil {
		return nil, err
	}
	if raw.ID == "" {
		return nil, errMissingID(f.name)
	}
	return &UserInfo{
		ProviderUserID: raw.ID,
		Email:          raw.Email,
		EmailVerified:  raw.Email != "",
		UserName:       raw.Name,
		AvatarURL:      raw.Picture.Data.URL,
	}, nil
}

func (f *Facebook) appSecretProof(accessToken string) string {
	mac := hmac.New(sha256.New, []byte(f.cfg.ClientSecret))
	mac.Write([]byte(accessToken))
	return hex.EncodeToString(mac.Sum(nil))
}
