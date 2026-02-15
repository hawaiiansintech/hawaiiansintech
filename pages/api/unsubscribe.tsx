import { FirebaseTablesEnum } from "@/lib/enums";
import { initializeAdmin } from "@/lib/firebase-helpers/initializeAdmin";
import { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import {
  handleApiErrors,
  InvalidBodyParamTypeError,
  ItemNotFoundError,
  KeyVerificationError,
} from "@/lib/api-helpers/errors";
import {
  checkMethods,
  checkBodyParams,
  checkQueryParams,
} from "@/lib/api-helpers/format";
import crypto from "crypto";
import { DocumentReference } from "firebase-admin/firestore";
import { verifyAdminToken, verifyAuthHeader } from "@/lib/api-helpers/auth";

async function generateUnsubKey(docRef: DocumentReference): Promise<string> {
  const unsubKey = crypto.randomBytes(6).toString("hex");
  const writeResult = await docRef.update({
    unsubscribe_key: unsubKey,
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: "hit-unsub-key",
  });
  if (!writeResult.writeTime) {
    throw new Error("Failed to write unsubKey to database");
  }
  return unsubKey;
}

async function getSecureMemberData(uid: string): Promise<DocumentReference> {
  await initializeAdmin();
  const docRef = admin
    .firestore()
    .collection(FirebaseTablesEnum.SECURE_MEMBER_DATA)
    .doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new ItemNotFoundError(`Member with uid ${uid} does not exist`);
  }
  return docRef;
}

async function getUnsubKey(uid: string): Promise<string> {
  const docRef = await getSecureMemberData(uid);
  const doc = await docRef.get();
  return doc.get("unsubscribe_key") || (await generateUnsubKey(docRef));
}

async function updateUnsub(uid: string, unsubKey: string) {
  const docRef = await getSecureMemberData(uid);
  const doc = await docRef.get();
  if (doc.get("unsubscribe_key") !== unsubKey) {
    throw new KeyVerificationError("Unauthorized key");
  }
  if (doc.get("unsubscribed") !== true) {
    const memberDocRef = admin
      .firestore()
      .collection(FirebaseTablesEnum.MEMBERS)
      .doc(uid);
    const memberDoc = await memberDocRef.get();
    if (!memberDoc.exists) {
      throw new ItemNotFoundError(`Member with uid ${uid} does not exist`);
    }
    const writeResult = await memberDocRef.update({
      unsubscribed: true,
      last_modified: admin.firestore.FieldValue.serverTimestamp(),
    });
    if (!writeResult.writeTime) {
      throw new Error("Failed to write unsubscribed to database");
    }
  }
}

/**
 * Handles GET requests to the unsubscribe API.
 * This endpoint is used to get the unsubscribe key for a specific user.
 * The user is identified by their uid, which should be provided as a query parameter.
 * @param {string} token - The admin token.
 * @throws {InvalidBodyParamTypeError} If the uid query parameter is not a string.
 * @returns {Promise<void>} A Promise that resolves when the unsubscribe key has been sent in the response.
 */
async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) {
  await verifyAdminToken(token);
  checkQueryParams(req, { uid: "string" });
  if (Array.isArray(req.query.uid)) {
    throw new InvalidBodyParamTypeError("id", "string");
  }
  const unsubKey = await getUnsubKey(req.query.uid);
  return res.status(200).send({ unsubKey });
}

/**
 * Handles PATCH requests to the unsubscribe API.
 * This endpoint is used to unsubscribe a user. The uid and unsubKey should be provided in the request body.
 * @throws {InvalidBodyParamTypeError} If the uid or unsubKey body parameters are not strings.
 * @returns {Promise<void>} A Promise that resolves when a success message has been sent in the response.
 */
async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
  checkBodyParams(req, {
    uid: "string",
    unsubKey: "string",
  });
  await updateUnsub(req.body.uid, req.body.unsubKey);
  res.status(200).json({
    message: `Successfully unsubscribed member with uid ${req.body.uid}`,
  });
}

/**
 * The main handler for the unsubscribe API.
 * @throws {InvalidMethodError} If the request method is not GET or PATCH.
 * @returns {Promise<void>} A Promise that resolves when the response has been sent.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    checkMethods(req.method, ["GET", "PATCH"]);
    if (req.method === "GET") {
      const token = await verifyAuthHeader(req);
      await getHandler(req, res, token);
    } else if (req.method === "PATCH") {
      await patchHandler(req, res);
    } else {
      res.status(405).json({ message: "Only GET and PATCH requests allowed" });
    }
  } catch (error) {
    return handleApiErrors(error, res);
  }
}
