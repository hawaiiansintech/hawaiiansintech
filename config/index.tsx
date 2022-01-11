const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3000"
  : "https://hawaiiansintech-git-tho-join-page-hawaiians.vercel.app";
