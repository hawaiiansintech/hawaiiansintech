import { initializeAdmin } from "@/lib/firebase-admin";

const admin = require("firebase-admin");

const isAdmin = async (uid: string): Promise<boolean> => {
  await initializeAdmin();
  const db = admin.firestore();
  const docRef = db.collection("admins").doc(uid);

  const docSnapshot = await docRef.get();
  return docSnapshot.exists;
};

export default async function handler(req, res) {
  const result: boolean = await isAdmin(req.body.uid);
  res.status(200).json({ isAdmin: result });
}
