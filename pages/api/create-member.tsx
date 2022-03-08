import { sendEmail, SendEmailProps } from "@/lib/confirmation-email";
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
      .base(process.env.AIRTABLE_BASE_NEW)(table)
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
      .base(process.env.AIRTABLE_BASE_NEW)(table)
      .create(focus, (err, record) => {
        if (err) {
          reject(err);
        }
        resolve(record.getId());
      });
  });
};

interface MemberFields {
  name: string;
  email: string;
  location: string;
  website: string;
  focusesSelected?: string | string[];
  focusSuggested?: string;
  title?: string;
  yearsExperience?: string;
  industriesSelected?: string | string[];
  industrySuggested?: string;
  companySize?: string;
  recordID?: string;
}

const addToAirtable = async (fields: MemberFields): Promise<string> => {
  let member = {
    Name: fields.name,
    Email: fields.email,
    Location: fields.location,
    Link: fields.website,
    "Company Size": fields.companySize,
    "Years of Experience": fields.yearsExperience,
    Status: "Pending",
  };

  let focuses;
  if (fields.focusesSelected) focuses = fields.focusesSelected;
  if (fields.focusSuggested) {
    const focusID = await findRecord({
      name: fields.focusSuggested,
      table: "Focuses",
    });
    if (focusID) {
      focuses = [...focuses, focusID];
    } else {
      const newFocusID = await addPendingRecord({
        name: fields.focusSuggested,
        table: "Focuses",
      });
      focuses = [...focuses, newFocusID];
    }
  }
  if (focuses) member["Focus"] = focuses;

  let industries;
  if (fields.industriesSelected) industries = fields.industriesSelected;
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

  if (fields.title) member["Title"] = fields.title;

  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE_NEW)("Members")
      .create(member, (err, record) => {
        if (err) reject(err);
        resolve(record.getId());
      });
  });
};

const addSgContact = async (fields: MemberFields) => {
  /*
    SendGrid's Marketing API is broken and requires custom field *IDs*
    more here: https://github.com/sendgrid/sendgrid-nodejs/issues/953#issuecomment-511227621
  */
  const fullName = "e1_T";
  const airtableID = "w2_T";
  return new Promise((resolve, reject) => {
    Client.request({
      method: "PUT",
      url: "/v3/marketing/contacts",
      body: {
        list_ids: [process.env.SENDGRID_LIST_MEMBERS],
        contacts: [
          {
            email: fields.email,
            custom_fields: {
              [fullName]: fields.name,
              [airtableID]: fields.recordID,
            },
          },
        ],
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const sendSgEmail = async ({ email, airtableID, name }: SendEmailProps) => {
  return new Promise((resolve, reject) => {
    sendEmail({ email: email, airtableID: airtableID, name: name })
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
      .base(process.env.AIRTABLE_BASE_NEW)("Members")
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
      const contact = await addSgContact({
        ...req.body,
        recordID: recordID,
      }).then(() => {
        console.log("✅ added member to sendgrid");
      });
      console.log("🤔 contact");
      console.log(contact);
      const email = await sendSgEmail({
        email: req.body.email,
        name: req.body.name,
        airtableID: recordID,
      }).then(() => {
        console.log("✅ sent member email via sendgrid");
      });
      console.log("🤔 email");
      console.log(email);
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
