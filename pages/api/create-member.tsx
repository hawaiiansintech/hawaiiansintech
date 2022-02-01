import Client from "@sendgrid/client";
import SendGrid from "@sendgrid/mail";
import airtable from "airtable";
import { sendEmail, SendEmailProps } from "../../lib/confirmation-email";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
Client.setApiKey(process.env.SENDGRID_API_KEY);

export interface FocusFields {
  name: string;
}

const validateFocus = async (name: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Focuses")
      .select({
        view: "All",
        filterByFormula: `{Name} = "${name}"`,
      })
      .firstPage((error, records) => {
        if (error) reject(error);
        resolve(records?.length >= 1);
      });
  });
};

const addFocusToAirtable = async ({ name }: FocusFields): Promise<string> => {
  let focus = {
    Name: name,
    Status: "Pending",
  };
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Focuses")
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
  companySize?: string;
  yearsExperience?: string;
  title?: string;
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
    const focusExists = await validateFocus(fields.focusSuggested);
    if (!focusExists) {
      const newFocusID = await addFocusToAirtable({
        name: fields.focusSuggested,
      });
      focuses = [...focuses, newFocusID];
    }
  }
  if (focuses) member["Focus"] = focuses;

  if (fields.title) member["Title"] = fields.title;

  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Members")
      .create(member, (err, record) => {
        if (err) {
          reject(err);
        }
        console.log(`member`);
        console.log(member);
        console.log(`record ${record}`);
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

export const validateEmail = async (email: string): Promise<boolean> => {
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

export default async function createMember(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  console.log(req.body);

  try {
    const isEmailUsed = await validateEmail(req.body.email);
    if (!isEmailUsed) {
      const recordID: string = await addToAirtable({ ...req.body }).then(
        (body) => {
          console.log("✅ added member to airtable");
          return body;
        }
      );
      await addSgContact({
        ...req.body,
        recordID: recordID,
      }).then(() => {
        console.log("✅ added member to sendgrid");
      });
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
