import { getFilters } from "@/lib/api";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const industries = await getFilters("industry");
    return res.status(200).json({
      message: "Successfully fetched industries.",
      industries: industries,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
