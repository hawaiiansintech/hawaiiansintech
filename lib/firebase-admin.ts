import * as admin from "firebase-admin";

export const initializeAdmin = async () => {
  const isBrowser: boolean = ((): boolean => typeof window !== "undefined")();
  if (!admin.apps.length && !isBrowser) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error(
        "The FIREBASE_SERVICE_ACCOUNT_KEY environment " +
          "variable is not set.",
      );
    }

    let serviceAccount: string;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      throw new Error(
        "The FIREBASE_SERVICE_ACCOUNT_KEY environment variable " +
          "is not a valid JSON string.",
      );
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      throw new Error(
        "Failed to initialize Firebase Admin SDK with the " +
          "provided service account key.",
      );
    }
  }
};
