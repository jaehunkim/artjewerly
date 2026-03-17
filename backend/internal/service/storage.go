package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"

	"github.com/jaehunkim/heeang-api/internal/config"
	"github.com/jaehunkim/heeang-api/internal/model"
)

type StorageService struct {
	client     *s3.Client
	presigner  *s3.PresignClient
	bucketName string
}

func NewStorageService(cfg *config.Config) *StorageService {
	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", cfg.R2AccountID),
		}, nil
	})

	awsCfg := aws.Config{
		Region:                      "auto",
		Credentials:                 credentials.NewStaticCredentialsProvider(cfg.R2AccessKeyID, cfg.R2SecretKey, ""),
		EndpointResolverWithOptions: r2Resolver,
	}

	client := s3.NewFromConfig(awsCfg)
	presigner := s3.NewPresignClient(client)

	return &StorageService{
		client:     client,
		presigner:  presigner,
		bucketName: cfg.R2BucketName,
	}
}

func (s *StorageService) GeneratePresignedURL(ctx context.Context, productID string) (*model.PresignResponse, error) {
	key := fmt.Sprintf("%s/%s/original", productID, uuid.New().String())

	presignedReq, err := s.presigner.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: &s.bucketName,
		Key:    &key,
	}, s3.WithPresignExpires(15*time.Minute))
	if err != nil {
		return nil, err
	}

	return &model.PresignResponse{
		UploadURL: presignedReq.URL,
		R2Key:     key,
	}, nil
}

func (s *StorageService) DeleteImageAndVariants(ctx context.Context, originalKey string, variantsJSON json.RawMessage) error {
	// Delete original
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: &s.bucketName,
		Key:    &originalKey,
	})
	if err != nil {
		return err
	}

	// Delete variants
	var variants model.ImageVariants
	if err := json.Unmarshal(variantsJSON, &variants); err != nil {
		log.Warn().Err(err).Str("original_key", originalKey).Msg("failed to unmarshal image variants, skipping variant deletion")
		return nil
	}

	var errs []error
	for _, key := range []string{variants.Thumbnail, variants.Medium, variants.Large} {
		if key != "" {
			k := key
			if _, delErr := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
				Bucket: &s.bucketName,
				Key:    &k,
			}); delErr != nil {
				log.Error().Err(delErr).Str("key", k).Msg("failed to delete image variant from storage")
				errs = append(errs, delErr)
			}
		}
	}

	if len(errs) > 0 {
		return fmt.Errorf("failed to delete %d image variant(s)", len(errs))
	}
	return nil
}

func (s *StorageService) UploadBytes(ctx context.Context, key string, data []byte, contentType string) error {
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &s.bucketName,
		Key:         &key,
		Body:        bytes.NewReader(data),
		ContentType: &contentType,
	})
	return err
}

func (s *StorageService) DownloadBytes(ctx context.Context, key string) ([]byte, error) {
	resp, err := s.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: &s.bucketName,
		Key:    &key,
	})
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return io.ReadAll(resp.Body)
}
