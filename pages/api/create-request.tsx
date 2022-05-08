import { MemberPublicEditing } from "@/lib/api";
import {
  RequestUpdateEmailProps,
  sendRequestUpdateEmail,
} from "@/lib/email/request-update-email";
import airtable from "airtable";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

const addToAirtable = async ({
  userData,
  editedData,
  message,
}: {
  userData: MemberPublicEditing;
  editedData: MemberPublicEditing;
  message: string;
}): Promise<string> => {
  const getSummary = () => {
    let summary = "";
    if (editedData.name) {
      summary = summary + `• Name: ${editedData.name}\n`;
    }
    if (editedData.title) {
      summary = summary + `• Title: ${editedData.title}\n`;
    }
    if (editedData.link) {
      summary = summary + `• Link: ${editedData.link}\n`;
    }
    if (editedData.location) {
      summary = summary + `• Location: ${editedData.location}\n`;
    }
    if (editedData.focus) {
      summary =
        summary +
        `• Focus(es) by id: [${editedData.focus.map(
          (foc, i) => `${foc}${editedData.focus.length < i ? ", " : ""}`
        )}]\n`;
    }
    if (editedData.focusSuggested) {
      summary = summary + `• Focus (Suggested): ${editedData.focusSuggested}\n`;
    }
    if (editedData.yearsExperience) {
      summary = summary + `• Years Experience: ${editedData.yearsExperience}\n`;
    }
    if (editedData.industry) {
      summary =
        summary +
        `• Industri(es) by id: [${editedData.industry.map(
          (foc, i) => `${foc}${editedData.industry.length < i ? ", " : ""}`
        )}]\n`;
    }
    if (editedData.industrySuggested) {
      summary =
        summary + `• Industry (Suggested): ${editedData.industrySuggested}\n`;
    }
    if (editedData.companySize) {
      summary = summary + `• Company Size: ${editedData.companySize}\n`;
    }
    if (message) {
      summary = summary + `• Message: ${message}`;
    }
    return summary;
  };
  const count = Object.keys(editedData).length;

  let requestData = {
    Member: [userData.id],
    Status: "Pending",
    Summary: `(${count} requested changes)
${getSummary()}`,
  };

  return new Promise((resolve, reject) => {
    airtable
      .base(process.env.AIRTABLE_BASE)("Requests")
      .create(requestData, (err, record) => {
        if (err) reject(err);
        resolve(record?.getId());
      });
  });
};

const sendSgEmail = async ({
  email,
  airtableID,
  name,
  removeRequest,
}: RequestUpdateEmailProps) => {
  return new Promise((resolve, reject) => {
    sendRequestUpdateEmail({
      email: email,
      airtableID: airtableID,
      name: name,
      removeRequest: removeRequest,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }
  try {
    const requestID = await addToAirtable({ ...req.body })
      .then((body) => {
        console.log("✅ added request to airtable");
        return body;
      })
      .catch(() => {
        return res.status(500).json({
          error: "Gonfunnit! Looks like something went wrong!",
          body: "Please try again later. If it happens again, try reach out to let us know!",
        });
      });
    await sendSgEmail({
      email: req.body.email,
      name: req.body.name,
      airtableID: req.body.recordID,
      removeRequest: req.body.removeRequest,
    }).then(() => {
      console.log("✅ sent member email via sendgrid");
    });
    return res
      .status(200)
      .json({ message: "Successfully sent request.", id: requestID });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Gonfunnit, looks like something went wrong!",
      body: "Please try again later.",
    });
  }
}
