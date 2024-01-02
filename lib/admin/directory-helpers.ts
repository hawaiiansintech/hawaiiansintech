import { FirebaseTablesEnum } from "@/lib/enums";
import {
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { memberConverter } from "../../lib/firestore-converters/member";

export interface referencesToDelete {
  memberRef: DocumentReference;
  focuses: DocumentReference[];
  industries: DocumentReference[];
  regions: DocumentReference[];
  secureMemberData: DocumentReference;
}

export async function getReferencesToDelete(
  uid: string
): Promise<referencesToDelete> {
  const documentRef = doc(db, FirebaseTablesEnum.MEMBERS, uid).withConverter(
    memberConverter
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
  references: DocumentReference[]
) {
  for (const reference of references) {
    const documentSnapshot = await getDoc(reference);
    const memberRefs = documentSnapshot.data().members;
    const memberRefToDelete = memberRef.id;
    const updatedMemberRefs = memberRefs.filter(
      (ref) => ref.id !== memberRefToDelete
    );
    console.log("Removing member from:", reference.id);
    await updateDoc(reference, {
      members: updatedMemberRefs,
      last_modified: serverTimestamp(),
      last_modified_by: sessionStorage.getItem("user"),
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
