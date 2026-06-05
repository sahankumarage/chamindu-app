import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence multi-lockfile workspace-root warning by pinning the root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
