const admin = require("firebase-admin");

const isAdmin = async (uid: string): Promise<boolean> => {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  const db = admin.firestore();
  const docRef = db.collection("admins").doc(uid);

  const docSnapshot = await docRef.get();
  return docSnapshot.exists;
};

export default async function handler(req, res) {
  const result: boolean = await isAdmin(req.body.uid);
  res.status(200).json({ isAdmin: result });
}
