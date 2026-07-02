import type { NextConfig } from "next";

// The invite app's own origin (its dedicated deployment, NOT this domain —
// pointing this at celebrio-digital.com itself would loop the proxy).
// Prod: https://invite.celebrio-digital.com · Dev: http://localhost:3900
const INVITE_ORIGIN = (
  process.env.INVITE_ORIGIN ?? "https://invite.celebrio-digital.com"
).replace(/\/$/, "");

const config: NextConfig = {
  output: "standalone",
  transpilePackages: ["@3ers/db"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // ── Multi-zone: this app owns celebrio-digital.com; invitations live at
  // /{slug} but are rendered by the invite app. See platform/docs/09-domains.md.
  async rewrites() {
    return {
      // The invite zone's build assets, namespaced by its assetPrefix so they
      // never collide with our own /_next/* files.
      afterFiles: [
        {
          source: "/invite-static/:path*",
          destination: `${INVITE_ORIGIN}/invite-static/:path*`,
        },
      ],
      // Fallback fires only when NOTHING here matched (no page, no public
      // file, no API route) — i.e. couples' slugs (/nidhal-uknown) and invite
      // media we don't ship ourselves (/music.mp3). Our own routes always win.
      fallback: [
        {
          source: "/:path*",
          destination: `${INVITE_ORIGIN}/:path*`,
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // The films are content-hashed by deploy; cache them hard so repeat
        // visits don't re-download several MB and revalidate every load.
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

export default config;
