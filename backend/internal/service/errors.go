package service

import (
	"context"
	"errors"
	"net"

	"github.com/jaehunkim/heeang-api/internal/repository"
)

func IsNotFound(err error) bool {
	return errors.Is(err, repository.ErrNotFound)
}

func IsTimeout(err error) bool {
	if err == nil {
		return false
	}
	if errors.Is(err, context.DeadlineExceeded) {
		return true
	}

	var netErr net.Error
	return errors.As(err, &netErr) && netErr.Timeout()
}
