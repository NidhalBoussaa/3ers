import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT, // http://minio:9000 inside Docker
  region: "us-east-1", // MinIO ignores this; SDK requires it
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER!,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  },
  forcePathStyle: true, // required for MinIO
});

export const BUCKET = "3ers-assets";

export async function getUploadUrl(objectKey: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: objectKey,
    ContentType: contentType,
  });
  return getSignedUrl(s3, cmd, { expiresIn: 900 }); // 15 min
}

export async function getReadUrl(objectKey: string) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: objectKey });
  return getSignedUrl(s3, cmd, { expiresIn: 3600 }); // 1 hour
}

export async function deleteObject(objectKey: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: objectKey }));
}
