package middleware

import (
	"crypto/subtle"
	"encoding/base64"
	"net/http"
	"strings"
)

type AdminAuth struct {
	password string
}

func NewAdminAuth(password string) *AdminAuth {
	return &AdminAuth{password: password}
}

func (a *AdminAuth) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if !strings.HasPrefix(auth, "Basic ") {
			w.Header().Set("WWW-Authenticate", `Basic realm="admin"`)
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		decoded, err := base64.StdEncoding.DecodeString(auth[6:])
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.SplitN(string(decoded), ":", 2)
		if len(parts) != 2 {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		if subtle.ConstantTimeCompare([]byte(parts[0]), []byte("admin")) != 1 ||
			subtle.ConstantTimeCompare([]byte(parts[1]), []byte(a.password)) != 1 {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
