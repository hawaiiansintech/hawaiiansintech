import { getEmails } from "@/lib/api";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const emails = await getEmails();
    return res
      .status(200)
      .json({ message: "Successfully fetched emails.", emails: emails });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
