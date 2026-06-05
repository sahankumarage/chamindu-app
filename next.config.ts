import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence multi-lockfile workspace-root warning by pinning the root.
  turbopack: {
    root: path.join(__dirname),
  },
  // libSQL ships platform binaries — keep it out of the bundle.
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
