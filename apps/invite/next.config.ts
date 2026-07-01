import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [
      {
        // The wedding films are content-hashed by deploy; cache them hard so
        // repeat visits don't re-download ~18MB and revalidate every load.
        source: "/:file(.+\\.(?:mp4|webm|mov|m4v))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
