import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` otherwise appends a managed <!-- BEGIN:nextjs-agent-rules -->
  // block to CLAUDE.md on every run, and re-adds it if removed. CLAUDE.md
  // governs agent behaviour on this project and is edited deliberately, not by
  // a build tool. The bundled docs it points at are still readable at
  // node_modules/next/dist/docs/.
  agentRules: false,
};

export default nextConfig;
