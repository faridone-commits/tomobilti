import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@libsql/client", "@prisma/adapter-libsql", "bcryptjs"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
