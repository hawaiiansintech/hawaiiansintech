import { ENV_CONFIG } from "@/lib/config/environment";

export const server = ENV_CONFIG.isDevelopment
  ? "http://localhost:3000"
  : "https://hawaiiansintech-git-tho-changelog-hawaiians-projects.vercel.app";
