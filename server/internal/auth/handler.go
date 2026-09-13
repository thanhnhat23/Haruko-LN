package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

const (
	cookieState    = "oauth_state"
	cookieVerifier = "oauth_verifier"
	cookieMaxAge   = 600
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	g := rg.Group("/auth/google")
	g.GET("/login", h.googleLogin)
	g.GET("/callback", h.googleCallback)
}

func (h *Handler) googleLogin(c *gin.Context) {
	state, err := randomState()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "không tạo được state"})
		return
	}
	verifier := oauth2.GenerateVerifier()

	c.SetCookie(cookieState, state, cookieMaxAge, "/", "", false, true)
	c.SetCookie(cookieVerifier, verifier, cookieMaxAge, "/", "", false, true)

	c.Redirect(http.StatusTemporaryRedirect, h.svc.AuthURL(state, verifier))
}

func (h *Handler) googleCallback(c *gin.Context) {
	code := c.Query("code")
	state := c.Query("state")
	if code == "" || state == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "thiếu code hoặc state"})
		return
	}

	savedState, err := c.Cookie(cookieState)
	if err != nil || savedState != state {
		c.JSON(http.StatusBadRequest, gin.H{"error": "state không hợp lệ"})
		return
	}

	verifier, err := c.Cookie(cookieVerifier)
	if err != nil || verifier == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "thiếu PKCE verifier"})
		return
	}

	c.SetCookie(cookieState, "", -1, "/", "", false, true)
	c.SetCookie(cookieVerifier, "", -1, "/", "", false, true)

	resp, err := h.svc.HandleGoogleCallBack(c.Request.Context(), code, verifier)
	if err != nil {
		c.JSON(statusFor(err), gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func statusFor(err error) int {
	switch {
	case errors.Is(err, ErrEmailNotVerified):
		return http.StatusForbidden
	case errors.Is(err, ErrExchangeFailed):
		return http.StatusBadGateway
	default:
		return http.StatusInternalServerError
	}
}

func randomState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}
