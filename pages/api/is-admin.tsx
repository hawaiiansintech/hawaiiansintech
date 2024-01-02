import { verifyAdminToken } from "@/lib/auth";
const admin = require("firebase-admin");

export const isAdmin = async ({
  token,
}: {
  token: string;
}): Promise<boolean> => {
  if (!token) {
    throw new Error("Missing token");
  }
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server");
  }

  const isAdmin = await verifyAdminToken(token);
  return isAdmin;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const result = await isAdmin({ token: token });
    return res.status(200).send({ isAdmin: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
