package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/thanhnhat23/Haruko-LN/config"
	"github.com/thanhnhat23/Haruko-LN/infrastructure/oauth"
	"github.com/thanhnhat23/Haruko-LN/internal/auth"
)

func Register(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	v1 := r.Group("/api/v1")

	authRepo := auth.NewResposity(db)
	authSvc := auth.NewService(
		authRepo,
		oauthProviders(cfg.OAuth),
		[]byte(cfg.JWT.Secert),
		cfg.JWT.Access,
	)
	auth.NewHandler(authSvc, cfg.Env == "production").RegisterRoutes(v1)
}

func oauthProviders(c config.OAuthConfig) []oauth.Provider {
	var ps []oauth.Provider
	if c.Google.Enabled() {
		ps = append(ps, oauth.NewGoogle(c.Google.ClientID, c.Google.ClientSecret, c.Google.RedirectURL))
	}
	if c.Discord.Enabled() {
		ps = append(ps, oauth.NewDiscord(c.Discord.ClientID, c.Discord.ClientSecret, c.Discord.RedirectURL))
	}
	if c.Facebook.Enabled() {
		ps = append(ps, oauth.NewFacebook(c.Facebook.ClientID, c.Facebook.ClientSecret, c.Facebook.RedirectURL))
	}
	if c.Twitter.Enabled() {
		ps = append(ps, oauth.NewTwitter(c.Twitter.ClientID, c.Twitter.ClientSecret, c.Twitter.RedirectURL))
	}
	return ps
}
