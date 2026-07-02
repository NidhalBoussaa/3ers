import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@3ers/db"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Multi-zone: invitations are served through the marketing app's domain
  // (celebrio-digital.com/{slug} proxies here). Namespacing our build assets
  // under /invite-static lets the marketing app forward them to us without
  // colliding with its own /_next/* files. See platform/docs/09-domains.md.
  assetPrefix: "/invite-static",
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
