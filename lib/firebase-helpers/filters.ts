import {
  DocumentReference,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import * as admin from "firebase-admin";
import serverSideOnly, { getFirebaseTable } from "./general";
import {
  FirebaseMemberFieldsEnum,
  FirebaseTablesEnum,
  StatusEnum,
  YearsOfExperienceEnum,
} from "@/lib/enums";
import { deleteReferences, getMemberRef } from "./members";
import { getReferences } from "./general";
import { db } from "../firebase";
import {
  Filter,
  FilterData,
  MemberPublic,
  FirestoreDocumentData,
} from "./interfaces";

const statusEnumValues = Object.values(StatusEnum);

export const fieldNameToTable = {
  [FirebaseMemberFieldsEnum.INDUSTRIES]: FirebaseTablesEnum.INDUSTRIES,
  [FirebaseMemberFieldsEnum.FOCUSES]: FirebaseTablesEnum.FOCUSES,
  [FirebaseMemberFieldsEnum.REGIONS]: FirebaseTablesEnum.REGIONS,
  [FirebaseMemberFieldsEnum.EXPERIENCE]: FirebaseTablesEnum.EXPERIENCE,
};

export const addNewLabel = async (
  newFitler: string,
  filterName: string,
  currentUser: string,
  docRef: admin.firestore.DocumentReference,
) => {
  const newLabelRef = await addLabelRef(
    newFitler,
    fieldNameToTable[filterName],
  );
  const writeResult = await docRef.update({
    [filterName]: admin.firestore.FieldValue.arrayUnion(
      ...[admin.firestore().doc(newLabelRef.path)],
    ),
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: currentUser || "admin edit",
  });
  console.log(`Added new label ${newFitler} : ${writeResult}`);
};

export const updateAdminFilterReferences = async (
  referencesToAdd: DocumentReference[],
  referencesToDelete: DocumentReference[],
  docRef: admin.firestore.DocumentReference,
  filterName: string,
  currentUser: string,
) => {
  const adminReferencesToAdd = referencesToAdd.map((ref) =>
    admin.firestore().doc(ref.path),
  );
  const adminReferencesToDelete = referencesToDelete.map((ref) =>
    admin.firestore().doc(ref.path),
  );
  const metadata = {
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: currentUser || "admin edit",
  };
  if (filterName === FirebaseMemberFieldsEnum.EXPERIENCE) {
    await docRef.update({
      [filterName]: adminReferencesToAdd[0],
      ...metadata,
    });
  } else {
    if (adminReferencesToDelete.length !== 0) {
      await docRef.update({
        [filterName]: admin.firestore.FieldValue.arrayRemove(
          ...adminReferencesToDelete,
        ),
        ...metadata,
      });
    }
    if (adminReferencesToAdd.length !== 0) {
      await docRef.update({
        [filterName]: admin.firestore.FieldValue.arrayUnion(
          ...adminReferencesToAdd,
        ),
        ...metadata,
      });
    }
  }
};

export function getExperienceData(): FilterData[] {
  const return_list = [];
  for (const item in YearsOfExperienceEnum) {
    return_list.push({
      fields: { name: YearsOfExperienceEnum[item] },
      id: item,
    });
  }
  return return_list;
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

export const updateFilterReferences = async (
  id: string,
  oldReferenceIds: string[] | undefined | null,
  newReferenceIds: string[] | undefined | null,
  filterName: string,
  currentUser: string,
  updateFilters: boolean,
): Promise<[DocumentReference[], DocumentReference[]]> => {
  // Safety checks
  if (!fieldNameToTable[filterName]) {
    console.warn(`Unknown filter name: ${filterName}`);
    return [[], []];
  }

  const newReferences: DocumentReference[] = await getReferences(
    newReferenceIds,
    fieldNameToTable[filterName],
  );
  const oldReferences: DocumentReference[] = await getReferences(
    oldReferenceIds,
    fieldNameToTable[filterName],
  );
  const referencesToDelete: DocumentReference[] = oldReferences.filter(
    (ref) => !newReferences.includes(ref),
  );
  const referencesToAdd: DocumentReference[] = newReferences.filter(
    (ref) => !oldReferences.includes(ref),
  );
  const memberRefPublic = await getMemberRef(id);
  if (updateFilters) {
    await deleteReferences(memberRefPublic, referencesToDelete);
    await addMemberToReferences(memberRefPublic, referencesToAdd, currentUser);
  }
  return [referencesToAdd, referencesToDelete];
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
  return docRef;
};

type LabelOperation = "add" | "remove";

const updateMemberLabels = async (
  memberRef: DocumentReference,
  operation: LabelOperation,
) => {
  const memberSnapshot = await getDoc(memberRef);
  const memberData = memberSnapshot.data();
  const industries = memberData[FirebaseMemberFieldsEnum.INDUSTRIES];
  const focuses = memberData[FirebaseMemberFieldsEnum.FOCUSES];
  const regions = memberData[FirebaseMemberFieldsEnum.REGIONS];
  const experience = [memberData[FirebaseMemberFieldsEnum.EXPERIENCE]];

  const updateOperation = operation === "add" ? arrayUnion : arrayRemove;

  for (const label of [industries, focuses, regions, experience]) {
    if (label) {
      for (const ref of label) {
        await updateDoc(ref, {
          members: updateOperation(memberRef),
          last_modified: serverTimestamp(),
          last_modified_by: "admin edit",
        });
      }
    }
  }
};

export const addMemberToLabels = async (memberRef: DocumentReference) => {
  await updateMemberLabels(memberRef, "add");
};

export const deleteMemberFromLabels = async (memberRef: DocumentReference) => {
  await updateMemberLabels(memberRef, "remove");
};

export function filterLookup(
  items: FirestoreDocumentData[],
  memberData?: DocumentReference[],
  returnFirstName: boolean = false,
): FilterData[] | string | null {
  if (
    memberData &&
    Array.isArray(memberData) &&
    memberData.length !== 0 &&
    items.length !== 0
  ) {
    const results = memberData.map((item) => {
      const matchingItems = items.filter((thisItem) => item.id === thisItem.id);

      // Debug logging for broken references
      if (matchingItems.length === 0) {
        console.debug(`🚨 BROKEN REFERENCE DETECTED:`);
        console.debug(`   - Referenced ID: ${item.id}`);
        console.debug(
          `   - Available IDs: [${items.map((i) => i.id).join(", ")}]`,
        );
        console.debug(
          `   - This reference points to a deleted/non-existent item`,
        );
        console.debug(
          `   - Member data:`,
          memberData.map((ref) => ref.id),
        );
        console.debug(
          `   - Items type: ${items[0]?.fields?.name ? "industries" : "focuses" || "unknown"}`,
        );
        console.debug(`---`);
      }

      return (
        matchingItems.map((item) => {
          return {
            name:
              typeof item.fields["name"] === "string"
                ? item.fields["name"]
                : null,
            id: typeof item.id === "string" ? item.id : null,
            status: statusEnumValues.includes(
              item.fields["status"] as StatusEnum,
            )
              ? (item.fields["status"] as StatusEnum)
              : null,
          };
        })[0] || null
      );
    });
    return returnFirstName ? results[0].name : results;
  }
  return null;
}

export async function getFiltersBasic(
  members: MemberPublic[],
  filterType: FirebaseTablesEnum | "experience",
  filterData?: FirestoreDocumentData[],
): Promise<Filter[]> {
  const filterList = [];
  const filters =
    filterData ||
    (filterType == "experience"
      ? getExperienceData()
      : await getFirebaseTable(filterType));
  const returnedFilters = filters.map((role) => {
    return {
      name:
        typeof role.fields["name"] === "string" ? role.fields["name"] : null,
      id: typeof role.id === "string" ? role.id : null,
    };
  });
  returnedFilters.forEach((fil) => {
    filterList.push({
      name: fil.name,
      id: fil.id,
      filterType: filterType,
      members: [],
      count: 0,
      hasApprovedMembers: false,
    });
  });
  const memFil = members.filter((member) =>
    filterType == "experience" ? member.yearsExperience : member.region,
  );
  memFil.forEach((member) => {
    const expIndex = filterList.findIndex(
      (exp) =>
        exp.name ===
        (filterType == "experience" ? member.yearsExperience : member.region),
    );
    if (!filterList[expIndex].hasApprovedMembers)
      filterList[expIndex].hasApprovedMembers = true;
    filterList[expIndex].count++;
    filterList[expIndex].members.push(member.id);
  });
  return filterList;
}

function hasApprovedMembers(
  approvedMemberIds: string[],
  memberList: string[],
): boolean {
  for (const member of memberList) {
    if (approvedMemberIds.includes(member)) {
      return true;
    }
  }
  return false;
}

// TODO: Remove hasApprovedMembers since all filters should only have approved
//  members
export async function getFilters(
  filterType: FirebaseTablesEnum,
  limitByMembers?: boolean,
  approvedMemberIds?: string[],
  filterData?: FirestoreDocumentData[],
): Promise<Filter[]> {
  const filters = filterData || (await getFirebaseTable(filterType));
  return filters
    .filter(
      (role) =>
        role.fields["name"] &&
        role.fields.status === "approved" &&
        (limitByMembers
          ? hasApprovedMembers(
              approvedMemberIds,
              (role.fields["members"] as any[]).map((member) => member.id),
            )
          : true),
    )
    .map((role) => {
      const member_ids = (role.fields["members"] as any[]).map(
        (member) => member.id,
      );
      return {
        name:
          typeof role.fields["name"] === "string" ? role.fields["name"] : null,
        id: typeof role.id === "string" ? role.id : null,
        filterType: filterType,
        members: member_ids,
        count: member_ids.length,
        hasApprovedMembers: limitByMembers
          ? hasApprovedMembers(approvedMemberIds, member_ids)
          : true,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export default serverSideOnly({
  addMemberToLabels,
  addMemberToReferences,
  addNewLabel,
  addLabelRef,
  getExperienceData,
  getFilters,
  getFiltersBasic,
  filterLookup,
  updateFilterReferences,
  updateAdminFilterReferences,
});
