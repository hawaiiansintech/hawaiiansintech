import {
  FirebaseDefaultValuesEnum,
  FirebaseTablesEnum,
  StatusEnum,
} from "@/lib/enums";
import { DocumentReference, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  FirestoreDocumentData,
  MemberEmail,
} from "@/lib/firebase-helpers/interfaces";
import serverSideOnly, { getFirebaseTable } from "./general";
import { initializeAdmin } from "./initializeAdmin";
import * as admin from "firebase-admin";
import { sendLoginPromptEmail } from "@/lib/email";

export async function getEmails(
  approved: boolean = false,
): Promise<MemberEmail[]> {
  const secureMemberData: FirestoreDocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.SECURE_MEMBER_DATA,
  );
  const emails = await Promise.all(
    secureMemberData
      .filter((secM) => (secM.fields.email as string) !== "")
      .map(async (secM) => {
        const docRef = doc(db, FirebaseTablesEnum.MEMBERS, secM.id);
        try {
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            return {
              id: secM.id,
              email: secM.fields.email as string,
              name: docSnapshot.data().name || null,
              emailAbbr: docSnapshot.data().masked_email || null,
              status: docSnapshot.data().status || null,
              unsubscribed: docSnapshot.data().unsubscribed || false,
              unsubKey: (secM.fields.unsubscribe_key as string) || null,
            };
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      }),
  );
  const existingEmails = emails.filter(
    (email) => email !== null && email !== undefined,
  );
  const approvedEmails = existingEmails.filter(
    (email) => email.status && email.status === StatusEnum.APPROVED,
  );
  return approved ? approvedEmails : existingEmails;
}

export async function getEmailById(userId: string): Promise<MemberEmail> {
  const emails = await getEmails();
  const email = emails.find((e) => e && e.id === userId);
  return email;
}

export const getIdByEmail = async (email: string): Promise<string> => {
  const emails = await getEmails();
  const emailObj = emails.find((e) => e && e.email === email);
  return emailObj ? emailObj.id : null;
};

export const emailExists = async (email: string): Promise<boolean> => {
  const secureMemberData: FirestoreDocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.SECURE_MEMBER_DATA,
  );
  const emailExists = secureMemberData.some(
    (secM) => (secM.fields.email as string) === email,
  );
  return emailExists;
};

export const addSecureEmail = async (
  email: string,
  memberDocRef: DocumentReference,
) => {
  await initializeAdmin();
  const collectionRef = admin
    .firestore()
    .collection(FirebaseTablesEnum.SECURE_MEMBER_DATA);
  const docRef = collectionRef.doc(memberDocRef.id); // Use memberDocRef ID as new doc ID
  const data = {
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: FirebaseDefaultValuesEnum.LAST_MODIFIED_BY,
    email: email,
    member: memberDocRef.path,
  };
  await docRef.set(data);
  return docRef;
};

export const sendVerificationEmail = async (email: string, url: string) => {
  try {
    await initializeAdmin();
    const actionCodeSettings = {
      url: url,
      handleCodeInApp: true,
    };
    const link = await admin
      .auth()
      .generateSignInWithEmailLink(email, actionCodeSettings);
    await sendLoginPromptEmail({ emailAddress: email, promptLink: link });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default serverSideOnly({
  getEmails,
  getEmailById,
  getIdByEmail,
  emailExists,
  addSecureEmail,
  sendVerificationEmail,
});
