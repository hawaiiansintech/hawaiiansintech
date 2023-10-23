import { verifyAdminToken } from "@/lib/auth";
import { FirebaseTablesEnum } from "@/lib/enums";
import { initializeAdmin } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

export const updateMemberField = async (
  uid: string,
  fieldName: string,
  newData: any
): Promise<FirebaseFirestore.WriteResult | null> => {
  await initializeAdmin();
  const docRef = admin
    .firestore()
    .collection(FirebaseTablesEnum.MEMBERS)
    .doc(uid);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`Member with uid ${uid} does not exist`);
  }
  if (doc.get(fieldName) === undefined) {
    throw new Error(`Field ${fieldName} does not exist`);
  }

  const oldData = doc.get(fieldName);

  const writeResult = await docRef.update({
    [fieldName]: newData,
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`Updated ${fieldName} from ${oldData} to ${newData} for ${uid}`);
  return writeResult;
};

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }
  try {
    if (!req.body.uid) {
      return res.status(400).json({ message: "Missing uid" });
    } else if (!req.body.fieldName) {
      return res.status(400).json({ message: "Missing fieldName" });
    } else if (!req.body.newData) {
      return res.status(400).json({ message: "Missing newData" });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await updateMemberField(
      req.body.uid,
      req.body.fieldName,
      req.body.newData
    ).then((writeResult) => {
      console.debug("writeResult for /update-member:", writeResult);
    });
    return res.status(200).json({
      message: `Successfully updated ${req.body.fieldName}`,
    });
  } catch (error) {
    console.error(error.message);
    console.log(error);
    return res.status(error.statusCode || 500).json({
      error: "Gonfunnit, looks like something went wrong!",
      body: "Please try again later.",
    });
  }
}
