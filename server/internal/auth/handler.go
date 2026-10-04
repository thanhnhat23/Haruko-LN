package auth

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"log"
	"net/http"
	"path"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

const (
	cookieState    = "oauth_state_"
	cookieVerifier = "oauth_verifier_"
	cookieMaxAge   = 600
)

var publicErrors = []error{
	ErrUnknownProvider, ErrEmailMissing, ErrEmailNotVerified,
	ErrEmailConflict, ErrUserBanned, ErrAccountDeleted,
}

type Handler struct {
	svc          *Service
	secureCookie bool
}

func NewHandler(svc *Service, secureCookie bool) *Handler {
	return &Handler{svc: svc, secureCookie: secureCookie}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	g := rg.Group("/auth/:provider")
	g.GET("/login", h.login)
	g.GET("/callback", h.callback)
}

func (h *Handler) login(c *gin.Context) {
	provider := c.Param("provider")
	state, err := randomState()
	if err != nil {
		h.fail(c, provider, err)
		return
	}
	verifier := oauth2.GenerateVerifier()

	authURL, err := h.svc.AuthURL(provider, state, verifier)
	if err != nil {
		h.fail(c, provider, err)
		return
	}

	h.setCookie(c, cookieState+provider, state, cookieMaxAge)
	h.setCookie(c, cookieVerifier+provider, verifier, cookieMaxAge)
	c.Redirect(http.StatusTemporaryRedirect, authURL)
}

func (h *Handler) callback(c *gin.Context) {
	provider := c.Param("provider")
	savedState, _ := c.Cookie(cookieState + provider)
	verifier, _ := c.Cookie(cookieVerifier + provider)
	h.setCookie(c, cookieState+provider, "", -1)
	h.setCookie(c, cookieVerifier+provider, "", -1)

	if e := c.Query("error"); e != "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": e})
		return
	}
	code, state := c.Query("code"), c.Query("state")
	if code == "" || state == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "thiếu code hoặc state"})
		return
	}

	if savedState == "" || subtle.ConstantTimeCompare([]byte(savedState), []byte(state)) != 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "state không hợp lệ"})
		return
	}
	if verifier == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "thiếu PKCE verifier"})
		return
	}

	resp, err := h.svc.HandleCallback(c.Request.Context(), provider, code, verifier)
	if err != nil {
		h.fail(c, provider, err)
		return
	}
	c.Header("Cache-Control", "no-store")
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) setCookie(c *gin.Context, name, value string, maxAge int) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(name, value, maxAge, path.Dir(c.Request.URL.Path), "", h.secureCookie, true)
}

func (h *Handler) fail(c *gin.Context, provider string, err error) {
	log.Printf("auth %s: %v", provider, err)
	c.JSON(statusFor(err), gin.H{"error": publicMessage(err)})
}

func statusFor(err error) int {
	var re *oauth2.RetrieveError
	switch {
	case errors.Is(err, ErrUnknownProvider):
		return http.StatusNotFound
	case errors.Is(err, ErrEmailConflict):
		return http.StatusConflict
	case errors.Is(err, ErrEmailMissing), errors.Is(err, ErrEmailNotVerified),
		errors.Is(err, ErrUserBanned), errors.Is(err, ErrAccountDeleted):
		return http.StatusForbidden
	case errors.As(err, &re) && re.ErrorCode == "invalid_grant":
		return http.StatusBadRequest
	case errors.Is(err, ErrExchangeFailed):
		return http.StatusBadGateway
	default:
		return http.StatusInternalServerError
	}
}

func publicMessage(err error) string {
	for _, e := range publicErrors {
		if errors.Is(err, e) {
			return e.Error()
		}
	}
	return "đăng nhập thất bại, vui lòng thử lại"
}

func randomState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}
