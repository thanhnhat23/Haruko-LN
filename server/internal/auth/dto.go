package auth

import "github.com/google/uuid"


type UserInfo struct{
	UserID uuid.UUID `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
	Avatar string `json:"picture"`
}
type LoginResponse struct{
	AccessToken string   `json:"access_token"`
	ExpiresIn   int      `json:"expires_in"`
	User        UserInfo `json:"user"`
}