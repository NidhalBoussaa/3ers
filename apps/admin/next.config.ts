import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  transpilePackages: ["@3ers/db", "@3ers/ui"],
};

export default config;
