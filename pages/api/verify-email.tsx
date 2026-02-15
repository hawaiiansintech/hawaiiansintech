import { verifyTurnstileToken } from "@/lib/api-helpers/auth";
import { handleApiErrors, ItemNotFoundError } from "@/lib/api-helpers/errors";
import { checkBodyParams, checkMethods } from "@/lib/api-helpers/format";
import {
  getEmails,
  sendVerificationEmail,
} from "@/lib/firebase-helpers/emails";
import { NextApiRequest, NextApiResponse } from "next";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  checkBodyParams(req, {
    turnstileToken: "string",
    email: "string",
    url: "string",
  });
  const turnstileToken = req.body.turnstileToken;
  const ip = Array.isArray(req.headers["CF-Connecting-IP"])
    ? req.headers["CF-Connecting-IP"][0]
    : req.headers["CF-Connecting-IP"];
  await verifyTurnstileToken(turnstileToken, ip);
  const getApprovedEmails = true;
  const emails = await getEmails(getApprovedEmails);
  const matchingMember = emails.find(
    (email) => email.email.toLowerCase() === req.body.email.toLowerCase(),
  );
  if (!matchingMember) {
    throw new ItemNotFoundError(
      `Member with email ${req.body.email} not found`,
    );
  }
  await sendVerificationEmail(req.body.email, req.body.url);
  res.status(200).json({
    message: `Successfully sent verification email to ${req.body.email}`,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    checkMethods(req.method, ["POST"]);
    await postHandler(req, res);
  } catch (error) {
    return handleApiErrors(error, res);
  }
}
