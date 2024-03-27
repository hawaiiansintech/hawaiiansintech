import * as admin from "firebase-admin";
import { initializeAdmin } from "./firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenVerificationError";
  }
}

const verifyTokenExpiration = (decodedToken: admin.auth.DecodedIdToken) => {
  const now = Math.floor(Date.now() / 1000); // Convert to Unix timestamp (in seconds)
  if (decodedToken.exp < now) {
    throw new TokenVerificationError("Authentication token has expired");
  }
};

export const verifyApiToken = async (token: string): Promise<string> => {
  try {
    await initializeAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    verifyTokenExpiration(decodedToken);
    return uid;
  } catch (error) {
    if (error.code === "auth/argument-error") {
      throw new TokenVerificationError("Invalid authentication token");
    }
    const error_msg = "Error verifying token: " + error.message;
    throw new TokenVerificationError(error_msg);
  }
};

export const verifyAdminToken = async (token: string): Promise<boolean> => {
  try {
    await initializeAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    verifyTokenExpiration(decodedToken);
    return decodedToken.admin === true;
  } catch (error) {
    if (error.code === "auth/argument-error") {
      throw new TokenVerificationError("Invalid authentication token");
    }
    const error_msg = "Error verifying token: " + error.message;
    throw new TokenVerificationError(error_msg);
  }
};

export const verifyAuthHeader = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token missing in header" });
  }
  return token;
};
