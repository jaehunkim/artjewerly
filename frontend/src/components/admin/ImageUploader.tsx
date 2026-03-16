'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { adminFetch } from '@/lib/admin-api';

interface UploadedImage {
  id: string;
  url: string;
  sort_order: number;
}

interface PresignedResponse {
  upload_url: string;
  key: string;
  image_id: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `${file.name}: unsupported type (jpg, png, webp only)`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: file too large (max 10MB)`;
    }
    return null;
  }

  async function uploadFile(file: File): Promise<UploadedImage> {
    // 1. Get presigned URL
    const presigned = await adminFetch<PresignedResponse>('/api/images/presign', {
      method: 'POST',
      body: JSON.stringify({
        filename: file.name,
        content_type: file.type,
      }),
    });

    // 2. Upload to R2
    const uploadRes = await fetch(presigned.upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!uploadRes.ok) throw new Error('Upload to storage failed');

    // 3. Register image and generate variants
    const registered = await adminFetch<UploadedImage>('/api/images', {
      method: 'POST',
      body: JSON.stringify({
        key: presigned.key,
        image_id: presigned.image_id,
      }),
    });

    return registered;
  }

  async function processFiles(files: FileList | File[]) {
    setUploadError('');
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const err = validateFile(file);
      if (err) {
        setUploadError(err);
        return;
      }
    }

    setUploading(true);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of fileArray) {
        const img = await uploadFile(file);
        uploaded.push({ ...img, sort_order: images.length + uploaded.length });
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm('Remove this image?')) return;
    try {
      await adminFetch(`/api/images/${imageId}`, { method: 'DELETE' });
      onChange(images.filter((img) => img.id !== imageId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-gray-500 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        {uploading ? (
          <p className="text-sm text-gray-500">Uploading...</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Drag & drop images here, or{' '}
              <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP — max 10MB each
            </p>
          </>
        )}
      </div>

      {uploadError && (
        <p className="text-red-600 text-xs">{uploadError}</p>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group border border-gray-200 rounded overflow-hidden aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                ×
              </button>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                {img.sort_order + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
