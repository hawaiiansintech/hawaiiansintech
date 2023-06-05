import { doc, getDoc } from "firebase/firestore";
import {
  focusLookup,
  getFirebaseTable,
  industryLookup,
  regionLookup,
} from "./api";
import { FirebaseTablesEnum } from "./enums";
import { db } from "./firebase";
import { memberConverter } from "./firestore-converters/member";

export async function getOneMember(id: string): Promise<any> {
  const documentRef = doc(db, FirebaseTablesEnum.MEMBERS, id).withConverter(
    memberConverter
  );
  const documentSnapshot = await getDoc(documentRef);
  if (!documentSnapshot.exists()) {
    return null;
  }
  const data = documentSnapshot.data();
  const { regions, industries, focuses, lastModifiedBy, ...rest } = data;
  const focusesFb = await getFirebaseTable(FirebaseTablesEnum.FOCUSES);
  const industriesFb = await getFirebaseTable(FirebaseTablesEnum.INDUSTRIES);
  const regionsFb = await getFirebaseTable(FirebaseTablesEnum.REGIONS);
  return {
    ...rest,
    region: regionLookup(regionsFb, regions),
    industry: industryLookup(industriesFb, industries),
    focus: focusLookup(focusesFb, focuses),
    emailAbbr: rest.maskedEmail,
    lastModified: rest.lastModified.toDate().toLocaleString(),
  };
}
