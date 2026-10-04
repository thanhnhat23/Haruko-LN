package jwt

import (
	"time"

	gojwt "github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const issuer = "haruko-ln"

func Sign(userID uuid.UUID, secret []byte, ttl time.Duration) (string, error) {
	now := time.Now()
	claims := gojwt.RegisteredClaims{
		Subject:   userID.String(),
		Issuer:    issuer,
		IssuedAt:  gojwt.NewNumericDate(now),
		ExpiresAt: gojwt.NewNumericDate(now.Add(ttl)),
	}
	return gojwt.NewWithClaims(gojwt.SigningMethodHS256, claims).SignedString(secret)
}

func Parse(token string, secret []byte) (uuid.UUID, error) {
	claims := &gojwt.RegisteredClaims{}
	_, err := gojwt.ParseWithClaims(token, claims,
		func(*gojwt.Token) (any, error) { return secret, nil },
		gojwt.WithValidMethods([]string{gojwt.SigningMethodHS256.Alg()}),
		gojwt.WithIssuer(issuer),
		gojwt.WithExpirationRequired(),
	)
	if err != nil {
		return uuid.Nil, err
	}
	return uuid.Parse(claims.Subject)
}
