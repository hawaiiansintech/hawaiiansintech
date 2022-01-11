import airtable from "airtable";
import SendGrid from "@sendgrid/mail";
import Client from "@sendgrid/client";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
Client.setApiKey(process.env.SENDGRID_API_KEY);

interface Fields {
  name: string;
  email: string;
  location: string;
  website: string;
  focus?: string | string[];
  suggestedFocus?: string;
  title?: string;
  recordID?: string;
}

const addToAirtable = (fields: Fields) => {
  let member = {
    Name: fields.name,
    Email: fields.email,
    "Location (User)": fields.location,
    Link: fields.website,
    Exclude: true,
    Order: 1,
  };
  if (fields.focus) {
    member["Focus"] = () => {
      if (fields.focus.length > 1) {
        return fields.focus;
      } else {
        return [fields.focus];
      }
    };
  }
  if (fields.title) {
    member["Job Title (User)"] = fields.title;
  }
  if (fields.suggestedFocus) {
    member["Focus (User)"] = fields.suggestedFocus;
  }

  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Members")
      .create(member, (err, record) => {
        if (err) {
          reject(err);
        }
        resolve(record.getId());
      });
  });
};

const addToSendgrid = async (fields: Fields) => {
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

export const validateEmail = async (email: string) => {
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Members")
      .select({
        view: "Grid view",
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

  try {
    const isEmailUsed = await validateEmail(req.body.email);
    if (!isEmailUsed) {
      const recordID = await addToAirtable({ ...req.body });
      await addToSendgrid({ ...req.body, recordID: recordID });
    } else {
      return res.status(422).json({ error: "This email is in use." });
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
  return res.status(200).json({ error: "" });
}
