import * as admin from "firebase-admin";
import { initializeAdmin } from "../firebase-helpers/initializeAdmin";
import { NextApiRequest } from "next";
import {
  CloudflareVerificationError,
  MissingHeaderError,
  MissingTokenError,
  TokenVerificationError,
} from "./errors";
import { MemberEmail } from "../firebase-helpers/interfaces";
import { getEmailById } from "../firebase-helpers/emails";

const CLOUDFLARE_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const verifyTokenExpiration = (decodedToken: admin.auth.DecodedIdToken) => {
  const now = Math.floor(Date.now() / 1000); // Convert to Unix timestamp (in seconds)
  if (decodedToken.exp < now) {
    throw new TokenVerificationError("Authentication token has expired");
  }
};

export const verifyEmailAuthToken = async (token: string): Promise<string> => {
  try {
    await initializeAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.email || !decodedToken.email_verified) {
      throw new TokenVerificationError("Invalid email authentication token");
    }
    const email = decodedToken.email;
    verifyTokenExpiration(decodedToken);
    return email;
  } catch (error) {
    if (error.code === "auth/argument-error") {
      throw new TokenVerificationError("Invalid authentication token");
    }
    const error_msg = "Error verifying token: " + error.message;
    throw new TokenVerificationError(error_msg);
  }
};

export const verifyAdminToken = async (
  token: string,
  strict: boolean = true,
): Promise<boolean> => {
  try {
    await initializeAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    verifyTokenExpiration(decodedToken);
    if (strict && !decodedToken.admin) {
      throw new TokenVerificationError("Not an admin");
    }
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
): Promise<string> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new MissingHeaderError();
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new MissingTokenError();
  }
  return token;
};

export async function verifyAdminOrEmailAuthToken(
  id: string,
  token: string,
): Promise<MemberEmail> {
  const isAdmin = await verifyAdminToken(token, false);
  const email = await getEmailById(id);
  if (
    !(
      isAdmin ||
      email.email.toLowerCase() ===
        (await verifyEmailAuthToken(token)).toLowerCase()
    )
  ) {
    throw new TokenVerificationError("Not authorized to access this account");
  }
  return email;
}

export async function verifyTurnstileToken(token: string, ip: string) {
  const formData = new FormData();
  formData.append("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", typeof ip === "string" ? ip : ip ? ip[0] : "");
  const result = await fetch(CLOUDFLARE_URL, {
    method: "POST",
    body: formData,
  });
  const outcome = await result.json();
  if (!outcome.success) {
    throw new CloudflareVerificationError(
      "Turnstile verification failed: " + outcome["error-codes"].join(", "),
    );
  }
}
