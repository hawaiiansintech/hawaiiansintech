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
        Location_Manual: req.body.location,
        Focus: req.body.focus.length > 1 ? req.body.focus : [req.body.focus],
        // todo: overridden role field
        // Role_Manual: req.body.role.name,
        Link: req.body.website,
        Exclude: true,
        Order: 1,
      },
      function (err, record) {
        if (err) {
          res.status(err.statusCode).end();
          return;
        }
        console.log(record);
        res.status(200).send(record);
      }
    );
}
