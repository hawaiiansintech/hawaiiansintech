import { DocumentData, getFirebaseTable, MemberEmail } from "@/lib/api";
import { verifyAdminToken } from "@/lib/auth";
import { FirebaseTablesEnum } from "@/lib/enums";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface getEmailsProps {
  /**
   * Required check if the user is admin via verifyAdminToken(token)
   *  - If the user is an admin, returns secured emails
   */
  token?: string;
}

async function getEmails({ token }: getEmailsProps): Promise<MemberEmail[]> {
  if (!token) {
    throw new Error("Missing token");
  }
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server");
  }

  const isAdmin = await verifyAdminToken(token);
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const secureMemberData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.SECURE_MEMBER_DATA,
  );

  const emails = await Promise.all(
    secureMemberData
      .filter((data) => data.fields.email)
      .map(async (data) => {
        const docRef = doc(db, FirebaseTablesEnum.MEMBERS, data.id);
        try {
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot?.exists()) {
            const { name, masked_email, status, unsubscribed } =
              docSnapshot.data();
            return {
              id: data.id,
              email: data.fields.email,
              name: name || null,
              emailAbbr: masked_email || null,
              status: status || null,
              unsubscribed: unsubscribed || false,
            };
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      }),
  );

  return emails as MemberEmail[];
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const emails = await getEmails({ token: token });
    return res.status(200).send({ emails });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
