#!/bin/sh
set -e

mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

# Main assets bucket
mc mb --ignore-existing local/3ers-assets

# Public read policy on the public/ prefix (template preview images)
mc anonymous set download local/3ers-assets/public
