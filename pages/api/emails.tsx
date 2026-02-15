import { MemberEmail } from "@/lib/firebase-helpers/interfaces";
import {
  verifyAdminToken,
  verifyAuthHeader,
  verifyEmailAuthToken,
} from "@/lib/api-helpers/auth";
import { FirebaseTablesEnum } from "@/lib/enums";
import { initializeAdmin } from "@/lib/firebase-helpers/initializeAdmin";
import { getEmails } from "@/lib/firebase-helpers/emails";
import { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import {
  handleApiErrors,
  InvalidBodyParamTypeError,
  TokenVerificationError,
} from "@/lib/api-helpers/errors";
import {
  checkMethods,
  checkBodyParams,
  checkQueryParams,
} from "@/lib/api-helpers/format";

async function verifyAdminOrEmailAuthToken(
  id: string,
  token: string,
): Promise<MemberEmail> {
  const isAdmin = await verifyAdminToken(token, false);
  const email = await getEmailById(id);
  if (
    isAdmin ||
    email.email.toLowerCase() ===
      (await verifyEmailAuthToken(token)).toLowerCase()
  ) {
    return email;
  }
  throw new TokenVerificationError("Not authorized to access this account");
}

async function getEmailById(userId: string): Promise<MemberEmail> {
  const emails = await getEmails();
  const email = emails.find((e) => e && e.id === userId);
  return email;
}

async function updateEmailById(
  uid: string,
  email: string,
  currentUser: string,
): Promise<admin.firestore.WriteResult> {
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

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) {
  if (Object.keys(req.query).length === 0) {
    // Get all emails as admin
    await verifyAdminToken(token);
    const emails = await getEmails();
    return res.status(200).send({ emails });
  } else {
    // Get email by id as admin or user
    checkQueryParams(req, { id: "string" });
    if (Array.isArray(req.query.id)) {
      throw new InvalidBodyParamTypeError("id", "string");
    }
    const email = await verifyAdminOrEmailAuthToken(req.query.id, token);
    return res.status(200).send({ email });
  }
}

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) {
  // Update email by id as admin or user
  checkBodyParams(req, {
    uid: "string",
    email: "string",
    currentUser: "string",
  });
  if (Array.isArray(req.query.id)) {
    throw new InvalidBodyParamTypeError("id", "string");
  }
  // verifyAdminOrEmailAuthToken(req.query.id, token);
  verifyAdminToken(token); // TODO: Change to verifyAdminOrEmailAuthToken
  await updateEmailById(req.body.uid, req.body.email, req.body.currentUser);
  res.status(200).json({
    message: `Successfully updated email for ${req.body.currentUser}`,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    checkMethods(req.method, ["GET", "PATCH"]);
    const token = await verifyAuthHeader(req);
    if (req.method === "GET") {
      await getHandler(req, res, token);
    } else if (req.method === "PATCH") {
      await patchHandler(req, res, token);
    } else {
      res.status(405).json({ message: "Only GET and PATCH requests allowed" });
    }
  } catch (error) {
    return handleApiErrors(error, res);
  }
}
