import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { memberConverter } from "../../firestore-converters/member";
import { FirebaseMemberFieldsEnum } from "@/lib/enums";

export interface referencesToDelete {
  memberRef: DocumentReference;
  focuses: DocumentReference[];
  industries: DocumentReference[];
  regions: DocumentReference[];
  secureMemberData: DocumentReference;
}

export async function getAllMemberReferencesToDelete(
  uid: string,
): Promise<referencesToDelete> {
  const documentRef = doc(db, FirebaseTablesEnum.MEMBERS, uid).withConverter(
    memberConverter,
  );
  const documentSnapshot = await getDoc(documentRef);
  if (!documentSnapshot.exists()) {
    return null;
  }
  const data = documentSnapshot.data();
  const returnData = {
    memberRef: documentRef,
    focuses: data.focuses,
    industries: data.industries,
    regions: data.regions,
    secureMemberData: doc(db, FirebaseTablesEnum.SECURE_MEMBER_DATA, uid),
  };
  return returnData;
}

export async function deleteReferences(
  memberRef: DocumentReference,
  references: DocumentReference[],
  currentUser?: string,
) {
  for (const reference of references) {
    const documentSnapshot = await getDoc(reference);
    const memberRefs = documentSnapshot.data().members;
    const memberRefToDelete = memberRef.id;
    const updatedMemberRefs = memberRefs.filter(
      (ref) => ref.id !== memberRefToDelete,
    );
    await updateDoc(reference, {
      members: updatedMemberRefs,
      last_modified: serverTimestamp(),
      last_modified_by: currentUser || "admin edit",
    });
  }
}

export async function deleteDocument(docRef: DocumentReference) {
  const documentSnapshot = await getDoc(docRef);
  if (documentSnapshot.exists()) {
    try {
      await deleteDoc(docRef);
      console.log("Document successfully deleted:", docRef.id);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
}

export async function getMemberRef(uid: string): Promise<DocumentReference> {
  const memberRef = doc(db, FirebaseTablesEnum.MEMBERS, uid).withConverter(
    memberConverter,
  );
  return memberRef;
}

export async function getReferences(
  referenceIds: string[],
  table: FirebaseTablesEnum,
): Promise<DocumentReference[]> {
  const references = [];
  for (const referenceId of referenceIds) {
    const reference = doc(db, table, referenceId);
    references.push(reference);
  }
  return references;
}

export async function addMemberToReferences(
  memberDoc: DocumentReference,
  references: DocumentReference[],
  currentUser?: string,
) {
  for (const reference of references) {
    const documentSnapshot = await getDoc(reference);
    const memberRefs = documentSnapshot.data().members;
    const updatedMemberRefs = memberRefs
      ? memberRefs.concat(memberDoc)
      : [memberDoc];
    await updateDoc(reference, {
      members: updatedMemberRefs,
      last_modified: serverTimestamp(),
      last_modified_by: currentUser || "admin edit",
    });
  }
}

export const addPendingReviewRecord = async (
  docReviewRef: DocumentReference,
  collectionName: string,
) => {
  const collectionRef = collection(db, "review");
  const docRef = doc(collectionRef, collectionName);
  await updateDoc(docRef, {
    [collectionName]: arrayUnion(docReviewRef),
    last_modified: serverTimestamp(),
  });
};

export const addLabelRef = async (
  label: string,
  collectionName: string,
  currentUser?: string,
): Promise<DocumentReference> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("name", "==", label));
  const querySnapshot = await getDocs(q);
  let docRef: DocumentReference;
  if (!querySnapshot.empty) {
    // Catches the case where the label already exists but it's pending review
    docRef = querySnapshot.docs[0].ref;
  } else {
    docRef = await addDoc(collectionRef, {
      name: label,
      status: StatusEnum.PENDING,
      last_modified: serverTimestamp(),
      last_modified_by: currentUser || "backend default",
      members: [],
    });
  }
  addPendingReviewRecord(docRef, collectionName);
  return docRef;
};

export const addMemberToLabels = async (
  labelReferences: DocumentReference[],
  memberRef: DocumentReference,
) => {
  for (const labelRef of labelReferences) {
    await updateDoc(labelRef, {
      members: arrayUnion(memberRef),
      last_modified: serverTimestamp(),
    });
  }
};
