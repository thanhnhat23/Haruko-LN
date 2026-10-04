package oauth

import (
	"context"
	"fmt"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/endpoints"
)

const discordUserURL = "https://discord.com/api/v10/users/@me"

type Discord struct{ base }

func NewDiscord(clientID, clientSecret, redirectURL string) Provider {
	return &Discord{base{
		name: ProviderDiscord,
		cfg: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURL:  redirectURL,
			Scopes:       []string{"identify", "email"},
			Endpoint:     endpoints.Discord,
		},
	}}
}

func (d *Discord) FetchUser(ctx context.Context, tok *oauth2.Token) (*UserInfo, error) {
	var raw struct {
		ID         string `json:"id"`
		Username   string `json:"username"`
		GlobalName string `json:"global_name"` 
		Avatar     string `json:"avatar"`     
		Email      string `json:"email"`       
		Verified   bool   `json:"verified"`
	}
	if err := d.getJSON(ctx, tok, discordUserURL, &raw); err != nil {
		return nil, err
	}
	if raw.ID == "" {
		return nil, errMissingID(d.name)
	}

	name := raw.GlobalName
	if name == "" {
		name = raw.Username
	}
	avatar := ""
	if raw.Avatar != "" {
		avatar = fmt.Sprintf("https://cdn.discordapp.com/avatars/%s/%s.png", raw.ID, raw.Avatar)
	}
	return &UserInfo{
		ProviderUserID: raw.ID,
		Email:          raw.Email,
		EmailVerified:  raw.Verified,
		UserName:       name,
		AvatarURL:      avatar,
	}, nil
}
