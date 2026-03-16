package service

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"

	"github.com/disintegration/imaging"
	"github.com/jaehunkim/heeang-api/internal/model"
)

type ImagingService struct {
	storage *StorageService
}

func NewImagingService(storage *StorageService) *ImagingService {
	return &ImagingService{storage: storage}
}

type variantConfig struct {
	name  string
	width int
}

var variantConfigs = []variantConfig{
	{name: "thumbnail", width: 400},
	{name: "medium", width: 800},
	{name: "large", width: 1600},
}

func (s *ImagingService) GenerateVariants(ctx context.Context, originalKey string, productID string) (*model.ImageVariants, error) {
	// Download original image
	data, err := s.storage.DownloadBytes(ctx, originalKey)
	if err != nil {
		return nil, fmt.Errorf("download original: %w", err)
	}

	// Decode image
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("decode image: %w", err)
	}

	// Extract base path for variants (format: {productID}/{imageID}/original)
	basePath := originalKey[:len(originalKey)-len("/original")]

	result := &model.ImageVariants{}

	// Generate sized variants
	for _, vc := range variantConfigs {
		resized := imaging.Resize(img, vc.width, 0, imaging.Lanczos)

		var buf bytes.Buffer
		if err := imaging.Encode(&buf, resized, imaging.PNG); err != nil {
			return nil, fmt.Errorf("encode %s: %w", vc.name, err)
		}

		key := fmt.Sprintf("%s/%s.webp", basePath, vc.name)
		if err := s.storage.UploadBytes(ctx, key, buf.Bytes(), "image/webp"); err != nil {
			return nil, fmt.Errorf("upload %s: %w", vc.name, err)
		}

		switch vc.name {
		case "thumbnail":
			result.Thumbnail = key
		case "medium":
			result.Medium = key
		case "large":
			result.Large = key
		}
	}

	// Generate blur placeholder (20px width)
	blurImg := imaging.Resize(img, 20, 0, imaging.Lanczos)
	blurImg = imaging.Blur(blurImg, 3)
	var blurBuf bytes.Buffer
	if err := imaging.Encode(&blurBuf, blurImg, imaging.PNG); err != nil {
		return nil, fmt.Errorf("encode blur: %w", err)
	}
	result.Blur = "data:image/png;base64," + base64.StdEncoding.EncodeToString(blurBuf.Bytes())

	return result, nil
}
