import airtable from "airtable";
import SendGrid from "@sendgrid/mail";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

interface RequestBodyAirtable {
  name: string;
  email: string;
  location: string;
  website: string;
  focus?: string | string[];
  suggestedFocus: string;
  title: string;
}

const addToAirtable = async (req: { body: RequestBodyAirtable }, res) => {
  let member = {
    Name: req.body.name,
    Email: req.body.email,
    "Location (User)": req.body.location,
    Link: req.body.website,
    Exclude: true,
    Order: 1,
  };
  if (req.body.focus) {
    member["Focus"] = () => {
      if (req.body.focus.length > 1) {
        return req.body.focus;
      } else {
        return [req.body.focus];
      }
    };
  }
  if (req.body.title) {
    member["Job Title (User)"] = req.body.title;
  }
  if (req.body.suggestedFocus) {
    member["Focus (User)"] = req.body.suggestedFocus;
  }

  airtable
    .base(process.env.AIRTABLE_BASE)("Members")
    .create(member, (err) => {
      if (err) {
        return res.status(err.statusCode).end();
      }
    });
};

interface RequestBodyConfEmail {
  name: string;
  email: string;
}

const sendConfirmationEmail = async (req: { body: RequestBodyConfEmail }) => {
  await SendGrid.send({
    to: req.body.email,
    from: {
      name: "Hawaiians In Tech",
      email: "aloha@hawaiiansintech.org",
    },
    templateId: process.env.SENDGRID_TEMPLATE,
    dynamicTemplateData: {
      fullName: req.body.name,
    },
  });
};

export default async function createMember(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  try {
    addToAirtable(req, res);
    sendConfirmationEmail(req);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
  return res.status(200).json({ error: "" });
}
