import * as admin from "firebase-admin";

export const initializeAdmin = async () => {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
};

export const setAdmin = async (uid: string) => {
  await initializeAdmin();
  admin.auth().setCustomUserClaims(uid, { admin: true });
};

export const getAdminByUserID = async (uid: string): Promise<boolean> => {
  await initializeAdmin();
  const user = await admin.auth().getUser(uid);
  return user.customClaims?.admin ? true : false;
};
