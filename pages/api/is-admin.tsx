import { initializeAdmin } from "@/lib/firebase-admin";
const admin = require("firebase-admin");

export const isAdmin = async (token: string): Promise<boolean> => {
  await initializeAdmin();
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken.admin;
};

export default async function handler(req, res) {
  const result: boolean = await isAdmin(req.body);
  res.status(200).json({ isAdmin: result });
}
