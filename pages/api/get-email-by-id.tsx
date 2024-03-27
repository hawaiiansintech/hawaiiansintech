import { DocumentData, getFirebaseTable, MemberEmail } from "@/lib/api";
import { verifyAdminToken, verifyAuthHeader } from "@/lib/auth";
import { FirebaseTablesEnum } from "@/lib/enums";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

async function getEmailById(userId: string): Promise<MemberEmail> {
  const secureMemberData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.SECURE_MEMBER_DATA,
  );
  const emails = await Promise.all(
    secureMemberData
      .filter((secM) => secM.fields.email !== "")
      .map(async (secM) => {
        const docRef = doc(db, FirebaseTablesEnum.MEMBERS, secM.id);
        try {
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            return {
              id: secM.id,
              email: secM.fields.email,
              name: docSnapshot.data().name || null,
              emailAbbr: docSnapshot.data().masked_email || null,
              status: docSnapshot.data().status || null,
              unsubscribed: docSnapshot.data().unsubscribed || false,
            };
          }
        } catch (error) {
          console.error(error);
        }
        return null;
      })
      .filter((email) => email !== null),
  );
  const email = emails.find((e) => e && e.id === userId);
  return email;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  if (req.query === null) {
    return res.status(422).json({ error: "Missing query" });
  }
  if (req.query.id === undefined) {
    return res.status(422).json({ error: "Missing id parameter" });
  }
  if (Array.isArray(req.query.id)) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }

  try {
    const token = await verifyAuthHeader(req, res);
    if (!token) return;
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const email = await getEmailById(req.query.id);
    return res.status(200).send({ email });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
