package middleware

import (
	"crypto/sha256"
	"crypto/subtle"
	"net/http"
	"strings"
)

var adminUserHash = sha256.Sum256([]byte("admin"))

type AdminAuth struct {
	passwordHash [32]byte
	enabled      bool
}

func NewAdminAuth(password string) *AdminAuth {
	trimmedPassword := strings.TrimSpace(password)
	return &AdminAuth{
		passwordHash: sha256.Sum256([]byte(trimmedPassword)),
		enabled:      !isInsecureAdminPassword(trimmedPassword),
	}
}

func (a *AdminAuth) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !a.enabled {
			a.unauthorized(w)
			return
		}

		username, password, ok := r.BasicAuth()
		if !ok {
			a.unauthorized(w)
			return
		}

		usernameHash := sha256.Sum256([]byte(username))
		passwordHash := sha256.Sum256([]byte(password))

		if subtle.ConstantTimeCompare(usernameHash[:], adminUserHash[:]) != 1 ||
			subtle.ConstantTimeCompare(passwordHash[:], a.passwordHash[:]) != 1 {
			a.unauthorized(w)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (a *AdminAuth) unauthorized(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", `Basic realm="admin"`)
	http.Error(w, "unauthorized", http.StatusUnauthorized)
}

func isInsecureAdminPassword(password string) bool {
	switch strings.ToLower(strings.TrimSpace(password)) {
	case "", "admin", "changeme":
		return true
	default:
		return false
	}
}
