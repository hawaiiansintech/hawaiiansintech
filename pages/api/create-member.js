import airtable from "airtable";

export default async function createMember(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_KEY,
  });
  await airtable
    .base(process.env.AIRTABLE_BASE)("Members")
    .create(
      {
        Name: req.body.name,
        Email: req.body.email,
        Focus: () => {
          if (!req.body.focus) return undefined;

          if (req.body.focus.length > 1) {
            return req.body.focus;
          } else {
            return [req.body.focus];
          }
        },
        "Job Title (User)": req.body.title,
        "Location (User)": req.body.location,
        "Focus (User)": req.body.suggestedFocus,
        Link: req.body.website,
        Exclude: true,
        Order: 1,
      },
      function (err, record) {
        if (err) {
          res.status(err.statusCode).end();
          return;
        }
        res.status(200).send(record);
      }
    );
}
