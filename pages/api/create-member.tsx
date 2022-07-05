import {
  SendConfirmationEmailProps,
  sendConfirmationEmails,
} from "@/lib/email/confirmation-email";
import Client from "@sendgrid/client";
import SendGrid from "@sendgrid/mail";
import airtable from "airtable";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
Client.setApiKey(process.env.SENDGRID_API_KEY);

export interface RecordFields {
  name: string;
  table: string;
}

const findRecord = async ({
  name,
  table,
}: RecordFields): Promise<string | boolean> => {
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)(table)
      .select({
        view: "All",
        filterByFormula: `{Name} = "${name}"`,
      })
      .firstPage((error, records) => {
        if (error) reject(error);
        resolve(records?.length >= 1 ? records[0].getId() : false);
      });
  });
};

const addPendingRecord = async ({
  name,
  table,
}: RecordFields): Promise<string> => {
  let focus = {
    Name: name,
    Status: "Pending",
  };
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)(table)
      .create(focus, (err, record) => {
        if (err) {
          reject(err);
        }
        resolve(record?.getId());
      });
  });
};

export interface Member {
  name: string;
  email?: string;
  location: string;
  website: string;
  focus?: string[];
  focusSuggested?: string;
  title?: string;
  yearsExperience?: string;
  industry?: string | string[];
  industrySuggested?: string;
  companySize?: string;
  recordID?: string;
}

const addToAirtable = async (fields: Member): Promise<string> => {
  let member = {
    Name: fields.name,
    Email: fields.email,
    Location: fields.location,
    Link: fields.website,
    "Company Size": fields.companySize,
    "Years of Experience": fields.yearsExperience,
    Title: fields.title,
    Status: "Pending",
  };

  let focus;
  if (fields.focus) focus = fields.focus;
  if (fields.focusSuggested) {
    const focusID = await findRecord({
      name: fields.focusSuggested,
      table: "Focuses",
    });
    if (focusID) {
      focus = [...focus, focusID];
    } else {
      const newFocusID = await addPendingRecord({
        name: fields.focusSuggested,
        table: "Focuses",
      });
      focus = [...focus, newFocusID];
    }
  }
  if (focus) member["Focus"] = focus;

  let industries;
  if (fields.industry) industries = fields.industry;
  if (fields.industrySuggested) {
    const industryID = await findRecord({
      name: fields.industrySuggested,
      table: "Industries",
    });
    if (industryID) {
      industries = [...industries, industryID];
    } else {
      const newIndustryID = await addPendingRecord({
        name: fields.industrySuggested,
        table: "Industries",
      });
      industries = [...industries, newIndustryID];
    }
  }
  if (industries) member["Industry"] = industries;

  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Members")
      .create(member, (err, record) => {
        if (err) reject(err);
        resolve(record?.getId());
      });
  });
};

const sendSgEmail = async ({
  email,
  airtableID,
  name,
}: SendConfirmationEmailProps) => {
  return new Promise((resolve, reject) => {
    sendConfirmationEmails({ email: email, airtableID: airtableID, name: name })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const findEmail = async (email: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Members")
      .select({
        view: "Approved",
        filterByFormula: `{Email} = "${email}"`,
      })
      .firstPage((error, records) => {
        if (error) reject(error);
        resolve(records?.length >= 1);
      });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const isEmailUsed = await findEmail(req.body.email);
    if (!isEmailUsed) {
      const recordID: string = await addToAirtable({ ...req.body }).then(
        (body) => {
          console.log("✅ added member to airtable");
          return body;
        }
      );
      await sendSgEmail({
        email: req.body.email,
        name: req.body.name,
        airtableID: recordID,
      }).then(() => {
        console.log("✅ sent member email via sendgrid");
      });
      return res.status(200).json({ message: "Successfully added member." });
    } else {
      return res.status(422).json({
        error: "This email is associated with another member.",
        body: "We only allow one member per email address.",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Gonfunnit, looks like something went wrong!",
      body: "Please try again later.",
    });
  }
}
