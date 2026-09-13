package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/thanhnhat23/Haruko-LN/config"
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
		auth.NewGoogleOAuthConfig(),
		[]byte(cfg.JWT.Secert),
		cfg.JWT.Access,
	)
	auth.NewHandler(authSvc).RegisterRoutes(v1)
}
