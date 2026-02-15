import { verifyAdminToken, verifyAuthHeader } from "@/lib/api-helpers/auth";
import { handleApiErrors } from "@/lib/api-helpers/errors";
import { checkMethods } from "@/lib/api-helpers/format";

export default async function handler(req, res) {
  try {
    checkMethods(req.method, ["GET"]);
    const token = await verifyAuthHeader(req);
    const result = await verifyAdminToken(token);
    return res.status(200).send({ isAdmin: result });
  } catch (error) {
    return handleApiErrors(error, res);
  }
}
