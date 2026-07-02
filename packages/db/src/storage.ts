import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Internal client for server-side calls (HeadObject, DeleteObject) that never
// leave the Docker network — talks to MinIO via its internal service name.
export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT, // http://minio:9000 inside Docker
  region: "us-east-1", // MinIO ignores this; SDK requires it
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER!,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  },
  forcePathStyle: true, // required for MinIO
});

// A presigned URL's signature is computed against the endpoint the client was
// built with, and that endpoint is exactly what the browser will fetch. So
// presigning MUST use a publicly reachable host (MINIO_PUBLIC_URL) — signing
// against the internal "minio:9000" Docker hostname would hand the browser a
// URL it can never resolve. See platform/docs/09-domains.md for the nginx
// route that proxies MINIO_PUBLIC_URL through to the minio service.
const publicS3 = new S3Client({
  endpoint: process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER!,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  },
  forcePathStyle: true,
});

export const BUCKET = "3ers-assets";

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB

export async function getUploadUrl(
  objectKey: string,
  contentType: string,
  maxBytes = MAX_UPLOAD_BYTES
) {
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    throw new Error(`Content type not allowed: ${contentType}`);
  }
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: objectKey,
    ContentType: contentType,
    // Size is enforced server-side via HeadObject after upload (see recordAsset).
    // Do NOT include ContentLength here: presigned PUT requires an exact byte match,
    // so baking in maxBytes would reject any upload smaller than 20 MB.
  });
  return getSignedUrl(publicS3, cmd, { expiresIn: 900 }); // 15 min
}

export async function getReadUrl(objectKey: string) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: objectKey });
  return getSignedUrl(publicS3, cmd, { expiresIn: 3600 }); // 1 hour
}

export async function deleteObject(objectKey: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: objectKey }));
}

export async function getObjectSize(objectKey: string): Promise<number> {
  const res = await s3.send(
    new HeadObjectCommand({ Bucket: BUCKET, Key: objectKey })
  );
  return res.ContentLength ?? 0;
}
