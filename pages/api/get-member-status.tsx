import airtable from "airtable";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

export enum MemberStatusOption {
  Approved = "Approved",
  Declined = "Declined",
  HasFeedback = "Sent Feedback",
}

export interface MemberStatusProps {
  name?: string;
  status?: MemberStatusOption;
  reviewed?: boolean;
  error?: string;
  reasonDeclined?: string[];
}

export default async function fetchMemberStatus(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  let getMemberStatus = (recordID: string) => {
    return new Promise((resolve, reject) => {
      airtable
        .base(process.env.AIRTABLE_BASE)("Members")
        .select({
          view: "Grid view",
          filterByFormula: `{RecordID} = "${recordID}"`,
        })
        .all((error, records) => {
          if (error) reject(error);
          resolve(records);
        });
    });
  };

  try {
    const memberStatus: any = await getMemberStatus(req.body.recordID);
    if (!memberStatus[0]) {
      return res.status(404).json({ error: "No record matches this ID." });
    }
    console.log(memberStatus[0].fields["Reason (Declined)"]);
    let results: MemberStatusProps = {
      name: memberStatus[0].fields["Name"],
      status: memberStatus[0].fields["Status"],
      reasonDeclined: memberStatus[0].fields["Reason (Declined)"],
      reviewed: memberStatus[0].fields["Reviewed"],
    };
    return res.status(200).json(results);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
