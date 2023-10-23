import { getMembers } from "@/lib/api";
import { StatusEnum } from "@/lib/enums";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  if (
    req.query.status &&
    !Object.values(StatusEnum).includes(req.query.status)
  ) {
    return res.status(400).json({ error: "Invalid status parameter" });
  }

  try {
    const [
      members,
      regions,
      // TODO add back in when we have a use case for it
      // industries,
      // focuses
    ] = await getMembers(undefined, undefined, undefined, req.query.status);
    return res.status(200).json({
      message: "Successfully fetched members.",
      members: members,
      regions: regions,
      // TODO add back in when we have a use case for it
      // industries: industries,
      // focuses: focuses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
