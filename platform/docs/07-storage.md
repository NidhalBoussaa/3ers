# Storage — MinIO

---

## Why MinIO

S3-compatible, self-hosted, runs in Docker. No vendor lock, no egress fees, works identically with the AWS S3 SDK. Easy to swap to S3/R2 later by just changing the endpoint.

---

## Client library

`@aws-sdk/client-s3` — same SDK as AWS S3, just pointing at the MinIO endpoint.

```ts
// packages/db/src/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,         // http://minio:9000 (internal Docker)
  region: 'us-east-1',                           // MinIO ignores this, but SDK requires it
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER!,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  },
  forcePathStyle: true,                          // required for MinIO
})

export const BUCKET = '3ers-assets'
```

---

## Bucket layout

```
3ers-assets/
├── orders/
│   └── {orderId}/
│       ├── couple_photo.jpg
│       └── venue_photo.jpg
└── public/
    └── templates/
        └── {templateId}/
            └── preview.jpg
```

- `orders/{orderId}/` — private, requires presigned URL to read
- `public/` — MinIO anonymous read policy applied via `init.sh`

---

## Upload flow (client portal)

1. Client selects a file in the browser
2. Browser `POST /api/portal/assets/upload` with `{ type: 'couple_photo', filename, contentType }`
3. Server generates a **presigned PUT URL** (15-minute expiry) pointing at `orders/{orderId}/{type}.{ext}`
4. Server returns `{ uploadUrl, objectKey }` to browser
5. Browser PUTs the file directly to MinIO using the presigned URL — no data passes through Next.js
6. On success, browser calls `POST /api/portal/assets/confirm` with `{ objectKey, size }`
7. Server inserts/updates row in `assets` table

This keeps large files off the Next.js server.

```ts
// Generate presigned PUT URL
export async function getUploadUrl(objectKey: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: objectKey,
    ContentType: contentType,
  })
  return getSignedUrl(s3, cmd, { expiresIn: 900 }) // 15 min
}
```

---

## Read flow (admin viewing client photos)

Admin requests `GET /api/admin/orders/[id]/assets` → server returns presigned GET URLs (1h expiry) for each asset in that order.

```ts
export async function getReadUrl(objectKey: string) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: objectKey })
  return getSignedUrl(s3, cmd, { expiresIn: 3600 })
}
```

Public template previews are read directly via MinIO public URL — no presigning needed.

---

## File constraints

| Field | Constraint |
|---|---|
| Max size | 10 MB per file |
| Accepted types | `image/jpeg`, `image/png`, `image/webp` |
| Max files per order | 2 (couple + venue) |

Validation on both client (file picker `accept` + size check) and server (content-type header check before generating presigned URL).

---

## MinIO console

Available at `http://localhost:9001` in dev (dev compose only).

Login with `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` from `.env`.

Use it to inspect buckets, view uploaded files, set policies.

---

## Backup notes

MinIO data lives in a Docker named volume (`minio_data`). For production:
- Mount to a host path or network-attached storage
- Enable MinIO versioning on the `3ers-assets` bucket to protect against accidental deletion
- Or configure MinIO replication to a second MinIO node / S3 bucket
