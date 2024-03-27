import { verifyAdminToken, verifyAuthHeader } from "@/lib/auth";
import { FirebaseTablesEnum } from "@/lib/enums";
import { initializeAdmin } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

async function updateEmailById(
  uid: string,
  email: string,
  currentUser: string,
): Promise<FirebaseFirestore.WriteResult> {
  await initializeAdmin();
  const docRef = admin
    .firestore()
    .collection(FirebaseTablesEnum.SECURE_MEMBER_DATA)
    .doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error(`Member with uid ${uid} does not exist`);
  }
  const oldEmail = doc.get("email");
  const writeResult = await docRef.update({
    email: email,
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: currentUser || "admin edit",
  });
  console.log(`Updated email from ${oldEmail} to ${email} for ${uid}`);
  return writeResult;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }

  if (req.body.uid === undefined) {
    return res.status(422).json({ error: "Missing uid parameter" });
  } else if (req.body.email === undefined) {
    return res.status(422).json({ error: "Missing email parameter" });
  } else if (req.body.currentUser === undefined) {
    return res.status(400).json({ message: "Missing currentUser" });
  }

  try {
    const token = await verifyAuthHeader(req, res);
    if (!token) return;
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await updateEmailById(req.body.uid, req.body.email, req.body.currentUser);
    res.status(200).json({
      message: `Successfully updated email for ${req.body.currentUser}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
