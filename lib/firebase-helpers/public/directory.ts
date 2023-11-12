import { FirebaseTablesEnum } from "@/lib/enums";
import { deleteDoc, doc, DocumentReference, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
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

export async function getAllMemberReferencesToDelete(uid: string): Promise<referencesToDelete> {
  const documentRef = doc(db, FirebaseTablesEnum.MEMBERS, uid).withConverter(memberConverter);
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
    const updatedMemberRefs = memberRefs.filter((ref) => ref.id !== memberRefToDelete);
    console.log("Removing member from:", reference.id);
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
  const memberRef = doc(db, FirebaseTablesEnum.MEMBERS, uid).withConverter(memberConverter);
  return memberRef;
}

export async function getReferences(referenceIds: string[], table: FirebaseTablesEnum): Promise<DocumentReference[]> {
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
    const updatedMemberRefs = memberRefs ? memberRefs.concat(memberDoc) : [memberDoc];
    console.log("Adding member to:", reference.id);
    await updateDoc(reference, {
      members: updatedMemberRefs,
      last_modified: serverTimestamp(),
      last_modified_by: currentUser || "admin edit",
    });
  }
}
