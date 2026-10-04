package oauth

import (
	"context"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/endpoints"
)

const twitterUserURL = "https://api.x.com/2/users/me?user.fields=profile_image_url,confirmed_email"

type Twitter struct{ base }

func NewTwitter(clientID, clientSecret, redirectURL string) Provider {
	ep := endpoints.X
	ep.AuthStyle = oauth2.AuthStyleInHeader 

	return &Twitter{base{
		name:   ProviderX,
		isPKCE: true,
		cfg: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURL:  redirectURL,
			Scopes:       []string{"users.read", "tweet.read", "users.email"},
			Endpoint:     ep,
		},
	}}
}

func (t *Twitter) FetchUser(ctx context.Context, tok *oauth2.Token) (*UserInfo, error) {
	var raw struct {
		Data struct {
			ID              string `json:"id"`
			Name            string `json:"name"`
			ProfileImageURL string `json:"profile_image_url"`
			ConfirmedEmail  string `json:"confirmed_email"`
		} `json:"data"`
	}
	if err := t.getJSON(ctx, tok, twitterUserURL, &raw); err != nil {
		return nil, err
	}
	if raw.Data.ID == "" {
		return nil, errMissingID(t.name)
	}
	return &UserInfo{
		ProviderUserID: raw.Data.ID,
		Email:          raw.Data.ConfirmedEmail,
		EmailVerified:  raw.Data.ConfirmedEmail != "",
		UserName:       raw.Data.Name,
		AvatarURL:      raw.Data.ProfileImageURL,
	}, nil
}
