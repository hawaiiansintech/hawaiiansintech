import airtable from "airtable";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

const TABLE = "Focuses";

const validateFocus = async (name: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)(TABLE)
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

export interface FocusFields {
  name: string;
}

const addFocusToAirtable = async ({ name }: FocusFields): Promise<string> => {
  let focus = {
    Name: name,
    Status: "Pending",
  };
  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)(TABLE)
      .create(focus, (err, record) => {
        if (err) {
          reject(err);
        }
        resolve(record.getId());
      });
  });
};

export default async function createFocus(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const focusExists = await validateFocus(req.body.name);
    if (!focusExists) {
      const recordID: string = await addFocusToAirtable({ ...req.body }).then(
        (body) => {
          console.log("✅ added focus to airtable");
          return body;
        }
      );
      return res
        .status(200)
        .json({ message: "Successfully added member.", focus: recordID });
    } else {
      return res.status(422).json({ error: "This option already exists." });
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
