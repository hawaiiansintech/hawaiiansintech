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
  console.log(req.body);
  await airtable
    .base(process.env.AIRTABLE_BASE)("Members")
    .create(
      {
        Name: req.body.name,
        Email: req.body.email,
        Location_Manual: req.body.location,
        Focus: [req.body.focus.id],
        // todo: overridden role field
        // Role_Manual: req.body.role.name,
        Link: req.body.website,
        Exclude: true,
        Order: 1,
      },
      function (err, record) {
        if (err) {
          console.log(err);
          res.status(err.statusCode).end();
          return;
        }
        res.status(200).end();
      }
    );
}
