import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SEND,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

let app = null;
let provider = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigValid()) {
  app = initializeApp(firebaseConfig);
  provider = new GoogleAuthProvider();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn(
    "Firebase config not provided. Firebase functionality is disabled.",
  );
}

export { auth, db, storage };

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      sessionStorage.setItem("user", result.user.displayName);
      sessionStorage.setItem("uid", result.user.uid);
      sessionStorage.setItem("email", result.user.email);
      sessionStorage.setItem(
        "emailIsVerified",
        String(result.user.emailVerified),
      );
      location.reload();
    })
    .catch(() => {});
};
export const signOutWithGoogle = () => {
  auth.signOut();
  sessionStorage.removeItem("user");
  location.reload();
};
