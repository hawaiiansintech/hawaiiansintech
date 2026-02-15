import { verifyAuthHeader, verifyEmailAuthToken } from "@/lib/api-helpers/auth";
import { ItemNotFoundError, handleApiErrors } from "@/lib/api-helpers/errors";
import { checkMethods } from "@/lib/api-helpers/format";
import { getEmails } from "@/lib/firebase-helpers/emails";
import { NextApiRequest, NextApiResponse } from "next";

async function getMemberId({ token }: { token?: string }): Promise<string> {
  const memberEmail = await verifyEmailAuthToken(token);
  const getApprovedEmails = true;
  const emails = await getEmails(getApprovedEmails);
  const matchingMember = emails.find(
    (email) => email.email.toLowerCase() === memberEmail.toLowerCase(),
  );
  if (!matchingMember) {
    throw new ItemNotFoundError(`Member with email ${memberEmail} not found`);
  }
  return matchingMember.id;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    checkMethods(req.method, ["GET"]);
    const token = await verifyAuthHeader(req);
    const memberId = await getMemberId({ token: token });
    return res.status(200).send({ memberId });
  } catch (error) {
    return handleApiErrors(error, res);
  }
}
