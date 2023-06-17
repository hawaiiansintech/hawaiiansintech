import { MemberPublicEditing } from "@/lib/api";
import {
  RequestUpdateEmailProps,
  sendRequestUpdateEmail,
} from "@/lib/email/request-update-email";
import { FirebaseTablesEnum } from "@/lib/enums";
import { initializeAdmin } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

const addRequest = async (
  uid: string,
  requestData: string
): Promise<FirebaseFirestore.WriteResult> => {
  await initializeAdmin();
  const docRef = admin
    .firestore()
    .collection(FirebaseTablesEnum.MEMBERS)
    .doc(uid);
  const doc = await docRef.get();
  const currentRequestData = doc.get("request") || "";

  let updatedRequestData;
  if (currentRequestData === "") {
    updatedRequestData = requestData;
  } else {
    // Append to existing request data for now, users should be able to edit on their own later
    updatedRequestData = currentRequestData + "\n---\n" + requestData;
  }

  const writeResult = await docRef.update({
    request: updatedRequestData,
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
  });
  return writeResult;
};

const addRequestToFirebase = async ({
  editedData,
  userData,
  message,
  removeRequest,
}: {
  editedData: MemberPublicEditing;
  userData: MemberPublicEditing;
  message: string;
  removeRequest?: boolean;
}): Promise<string> => {
  const getSummary = () => {
    let summary = "";
    if (removeRequest) {
      summary = summary + `REMOVAL REQUEST\n`;
    }
    if (message) {
      summary = summary + `• Message: ${message}`;
    }
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
    return summary;
  };
  const count = Object.keys(editedData).length;

  let requestData = {
    Member: [userData.id],
    Status: "Pending",
    Summary: `(${count} requested changes)
${getSummary()}`,
  };

  return new Promise(async (resolve, reject) => {
    try {
      await addRequest(userData.id, requestData.Summary);
      resolve(userData.id);
    } catch (error) {
      console.error("Error adding member:", error);
      reject(error);
    }
  });
};

const sendSgEmail = async ({
  email,
  firebaseId,
  name,
  removeRequest,
}: RequestUpdateEmailProps) => {
  return new Promise((resolve, reject) => {
    sendRequestUpdateEmail({
      email: email,
      firebaseId: firebaseId,
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
    const firebaseId = await addRequestToFirebase({ ...req.body })
      .then((body) => {
        console.log("✅ added request to firebase");
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
      firebaseId: firebaseId,
      removeRequest: req.body.removeRequest,
    }).then(() => {
      console.log("✅ sent member email via sendgrid");
    });
    return res
      .status(200)
      .json({ message: "Successfully sent request.", id: firebaseId });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Gonfunnit, looks like something went wrong!",
      body: "Please try again later.",
    });
  }
}
