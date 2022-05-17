import { getFocuses } from "@/lib/api";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }
  console.log(req);

  try {
    const focuses = await getFocuses();
    return res.status(200).json({
      message: "Successfully fetched focuses.",
      focuses: focuses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
