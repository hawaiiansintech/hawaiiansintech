import { initializeAdmin } from "@/lib/firebase-helpers/initializeAdmin";
import * as admin from "firebase-admin";
import {
  FirebaseMemberFieldsEnum,
  StatusEnum,
  FirebaseTablesEnum,
  FirebaseDefaultValuesEnum,
} from "@/lib/enums";
import {
  addLabelRef,
  filterLookup,
  updateFilterReferences,
} from "@/lib/firebase-helpers/filters";
import {
  addNewLabel,
  updateAdminFilterReferences,
} from "@/lib/firebase-helpers/filters";
import serverSideOnly, { getFirebaseTable } from "./general";
import { memberConverter, Member } from "../firestore-converters/member";
import {
  FirestoreDocumentData,
  FilterData,
  MemberPublic,
  // regionLookup
} from "@/lib/firebase-helpers/interfaces";
import { verifyAdminToken, verifyEmailAuthToken } from "@/lib/api-helpers/auth";
import {
  DocumentReference,
  FirestoreDataConverter,
  addDoc,
  collection,
  doc,
  documentId,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { cloakEmail } from "@/helpers";
import { addSecureEmail, getIdByEmail } from "./emails";
import { db } from "@/lib/firebase";

interface GetMembersOptions {
  token?: string;
  limit?: number;
  cursor?: string;
  paginated?: boolean;
  regions?: FirestoreDocumentData[];
  industries?: FirestoreDocumentData[];
  focuses?: FirestoreDocumentData[];
  experience?: FirestoreDocumentData[];
  memberIds?: string[];
  includeFilters?: boolean;
}

interface PaginatedResponse {
  items: Member[];
  hasMore: boolean;
  cursor: string;
}

export async function getMembers({
  token,
  limit = 25,
  cursor,
  paginated = false,
  regions,
  industries,
  focuses,
  experience,
  memberIds,
  includeFilters = true,
}: GetMembersOptions = {}): Promise<{
  members: MemberPublic[];
  regions: FirestoreDocumentData[];
  industries: FirestoreDocumentData[];
  focuses: FirestoreDocumentData[];
  experience: FirestoreDocumentData[];
  cursor?: string;
  hasMore?: boolean;
}> {
  let isAdmin = false;
  let userEmail = "";
  let userId = "";
  if (token) {
    isAdmin = await verifyAdminToken(token, false);
    if (!isAdmin) {
      console.warn("Token provided is not admin. Continuing.");
    }
    userEmail = await verifyEmailAuthToken(token);
    userId = await getIdByEmail(userEmail);
  }

  let membersArray = [];
  let membersPaginated = null;
  if (paginated) {
    membersPaginated = await getMembersTablePaged(
      memberConverter,
      limit,
      cursor,
    );
    membersArray = membersPaginated.items;
  } else {
    membersArray = await getMembersTable(
      FirebaseTablesEnum.MEMBERS,
      memberConverter,
      !isAdmin,
      isAdmin,
      memberIds,
      userId,
    );
  }

  let focusesData = [];
  let industriesData = [];
  let regionsData = [];
  let experienceData = [];
  if (includeFilters) {
    focusesData =
      focuses ||
      (await getFirebaseTable(
        FirebaseTablesEnum.FOCUSES,
        isAdmin || userId !== "" ? false : true,
      ));

    industriesData =
      industries ||
      (await getFirebaseTable(
        FirebaseTablesEnum.INDUSTRIES,
        isAdmin || userId !== "" ? false : true,
      ));

    // Note: Regions and Years of Experience do not have statuses so no need to
    //  filter by approved
    regionsData =
      regions || (await getFirebaseTable(FirebaseTablesEnum.REGIONS));
    experienceData =
      experience || (await getFirebaseTable(FirebaseTablesEnum.EXPERIENCE));
  }

  return {
    members: membersArray
      .map((member) => {
        const {
          regions,
          industries,
          focuses,
          maskedEmail,
          lastModified,
          lastModifiedBy,
          requests,
          unsubscribed,
          experience,
          ...rest
        } = member;

        let memberObject = { ...rest };

        // Handle lastModifiedBy - convert DocumentReference to string if needed
        if (lastModifiedBy) {
          memberObject["lastModifiedBy"] =
            typeof lastModifiedBy === "string"
              ? lastModifiedBy
              : lastModifiedBy.id || null;
        }

        // Handle lastModified - ensure it's always serializable
        if (lastModified) {
          memberObject["lastModified"] = lastModified.toDate().toLocaleString();
        }

        // Debug logging for focus processing
        const focusResult = includeFilters
          ? filterLookup(focusesData, focuses)
          : focuses.map((focus) => focus.id);

        // Check for null values in focus result
        if (
          focusResult &&
          Array.isArray(focusResult) &&
          focusResult.includes(null)
        ) {
          console.log(`🚨 MEMBER WITH BROKEN FOCUS REFERENCES:`);
          console.log(`   - Member ID: ${member.id}`);
          console.log(`   - Member Name: ${member.name}`);
          console.log(
            `   - Member Focus References: [${focuses.map((ref) => ref.id).join(", ")}]`,
          );
          console.log(
            `   - Available Focus IDs: [${focusesData.map((item) => item.id).join(", ")}]`,
          );
          console.log(`   - Focus Result:`, focusResult);
          console.log(`   - Null entries indicate deleted focus references`);
          console.log(`---`);
        }

        memberObject["focus"] = focusResult;

        // Debug logging for industry processing
        const industryResult = includeFilters
          ? filterLookup(industriesData, industries)
          : industries.map((industry) => industry.id);

        // Check for null values in industry result
        if (
          industryResult &&
          Array.isArray(industryResult) &&
          industryResult.includes(null)
        ) {
          console.log(`🚨 MEMBER WITH BROKEN INDUSTRY REFERENCES:`);
          console.log(`   - Member ID: ${member.id}`);
          console.log(`   - Member Name: ${member.name}`);
          console.log(
            `   - Member Industry References: [${industries.map((ref) => ref.id).join(", ")}]`,
          );
          console.log(
            `   - Available Industry IDs: [${industriesData.map((item) => item.id).join(", ")}]`,
          );
          console.log(`   - Industry Result:`, industryResult);
          console.log(`   - Null entries indicate deleted industry references`);
          console.log(`---`);
        }

        memberObject["industry"] = industryResult;
        memberObject["regions"] = includeFilters
          ? filterLookup(regionsData, regions)
          : regions.map((region) => region?.id);
        const experienceFiltered = filterLookup(
          experienceData,
          experience ? [experience] : [],
        );
        memberObject["experience"] = includeFilters
          ? filterLookup(experienceData, experience ? [experience] : [])
          : [experience?.id];

        // TODO: migrate to regions and experience, adding for backward
        //  compatibility on admin page
        memberObject["yearsExperience"] =
          experienceFiltered && experienceFiltered[0]
            ? (experienceFiltered[0] as FilterData).name
            : (memberObject["yearsExperience"] as string);
        memberObject["region"] = filterLookup(regionsData, regions, true);

        if (isAdmin || userId === member.id) {
          memberObject = {
            ...memberObject,
            emailAbbr: maskedEmail,
            requests: requests,
            unsubscribed: unsubscribed,
          };
        }
        return memberObject;
      })
      .filter((value) => value !== null && value.name)
      .sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    focuses: focusesData,
    industries: industriesData,
    regions: regionsData,
    experience: experienceData,
    cursor: paginated ? membersPaginated.cursor : undefined,
    hasMore: paginated ? membersPaginated.hasMore : undefined,
  };
}

export const updateMember = async (
  memberData: MemberPublic,
  currentUser: string,
  currentUserIsAdmin: boolean,
) => {
  await initializeAdmin();
  const docRef = admin
    .firestore()
    .collection(FirebaseTablesEnum.MEMBERS)
    .doc(memberData.id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`Member with uid ${memberData.id} does not exist`);
  }

  const data = doc.data();
  // Need to convert to array since filterLookup expects an array
  data["experience"] = data["experience"] ? [data["experience"]] : [];

  const memberIsApproved = data["status"] === StatusEnum.APPROVED;
  const updateFilters =
    memberIsApproved ||
    (currentUserIsAdmin && memberData.status === StatusEnum.APPROVED);

  // Handle filter references
  const fields = [
    FirebaseMemberFieldsEnum.FOCUSES.toString(),
    FirebaseMemberFieldsEnum.INDUSTRIES.toString(),
    FirebaseMemberFieldsEnum.REGIONS.toString(),
    FirebaseMemberFieldsEnum.EXPERIENCE.toString(),
  ];
  const fieldSingular = {
    // TODO: Update fields to plural in MemberPublic
    [FirebaseMemberFieldsEnum.FOCUSES.toString()]: "focus",
    [FirebaseMemberFieldsEnum.INDUSTRIES.toString()]: "industry",
    [FirebaseMemberFieldsEnum.REGIONS.toString()]: "region",
    [FirebaseMemberFieldsEnum.EXPERIENCE.toString()]: "yearsExperience",
  };
  for (const field of fields) {
    const oldReferenceIds = data[field] ? data[field].map((ref) => ref.id) : [];
    let newReferenceIds = [];
    if (
      field === FirebaseMemberFieldsEnum.REGIONS.toString() ||
      field === FirebaseMemberFieldsEnum.EXPERIENCE.toString()
    ) {
      const fieldValue = memberData[fieldSingular[field]];
      if (fieldValue) {
        // Handle both single values and arrays
        if (Array.isArray(fieldValue)) {
          newReferenceIds = fieldValue.map((ref) => ref.id);
        } else if (typeof fieldValue === "object" && fieldValue.id) {
          newReferenceIds = [fieldValue.id];
        } else if (typeof fieldValue === "string") {
          newReferenceIds = [fieldValue];
        }
      }
    } else {
      const fieldValue = memberData[fieldSingular[field]];
      if (fieldValue && Array.isArray(fieldValue)) {
        newReferenceIds = fieldValue.map((ref) => ref.id);
      }
    }
    const [referencesToAdd, referencesToDelete] = await updateFilterReferences(
      memberData.id,
      oldReferenceIds,
      newReferenceIds,
      field,
      currentUser,
      updateFilters,
    );
    updateAdminFilterReferences(
      referencesToAdd,
      referencesToDelete,
      docRef,
      field,
      currentUser,
    );
  }

  // Handle new filter suggestions
  const suggested = [
    FirebaseMemberFieldsEnum.FOCUSES.toString(),
    FirebaseMemberFieldsEnum.INDUSTRIES.toString(),
  ];
  for (const field of suggested) {
    const suggestedField = memberData[fieldSingular[field] + "Suggested"];
    if (suggestedField) {
      await addNewLabel(suggestedField, field, currentUser, docRef);
    }
  }

  // Define the fields we want to exclude from database updates
  type FieldsToExclude =
    | "emailAbbr"
    | "yearsExperience"
    | "region"
    | "companySize"
    | "focus"
    | "industry"
    | "lastModified"
    | "focusSuggested"
    | "industrySuggested"
    | "id"
    | "experience"
    | "regions";

  // Create a type that excludes those fields
  type SafeMemberData = Omit<MemberPublic, FieldsToExclude>;

  // Have to drop the fields that are not in the database or are handled above
  const { emailAbbr, companySize } = memberData;
  const droppedMemberData = { ...memberData };

  // Remove the fields that are not in the database or are handled above
  delete droppedMemberData.emailAbbr;
  delete droppedMemberData.yearsExperience;
  delete droppedMemberData.region;
  delete droppedMemberData.companySize;
  delete droppedMemberData.focus;
  delete droppedMemberData.industry;
  delete droppedMemberData.lastModified;
  delete droppedMemberData.focusSuggested;
  delete droppedMemberData.industrySuggested;
  delete droppedMemberData.id;
  delete droppedMemberData.experience;
  delete droppedMemberData.regions;

  // Type assertion for type safety - TypeScript will now prevent accessing excluded fields
  // This means: safeMemberData.emailAbbr, safeMemberData.focus, etc. will cause compile errors
  const safeMemberData: SafeMemberData = droppedMemberData as SafeMemberData;

  // If currentUser is not an admin, don't allow them to change the status
  if (!currentUserIsAdmin) {
    safeMemberData.status = data.status;
  }

  const writeResult = await docRef.update({
    ...safeMemberData,
    company_size: companySize,
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: currentUser || "admin edit",
    masked_email: emailAbbr,
  });

  console.log(
    `Updated member ${memberData.id} with ${JSON.stringify(
      memberData,
    )}: ${writeResult}`,
  );
};

export interface CreateMemberFields {
  name: string;
  email: string;
  location: string;
  website?: string;
  link?: string;
  focusesSelected?: string | string[];
  focusSuggested?: string;
  title?: string;
  yearsExperience?: string;
  experience?: string;
  industriesSelected?: string | string[];
  industrySuggested?: string;
  companySize?: string;
  recordID?: string;
  unsubscribed?: boolean;
}

const idToRef = async (
  labelId: string,
  collectionName: string,
): Promise<DocumentReference> => {
  const collectionRef = collection(db, collectionName);
  const docRef = doc(collectionRef, labelId);
  return docRef;
};

const nameToRef = async (
  labelName: string,
  collectionName: string,
): Promise<DocumentReference> => {
  const collectionRef = collection(db, collectionName);
  const querySnapshot = await getDocs(
    query(collectionRef, where("name", "==", labelName)),
  );
  if (querySnapshot.empty) {
    throw new Error(`No ${collectionName} found with name ${labelName}`);
  }
  return querySnapshot.docs[0].ref;
};

const idsToRefs = async (
  labelIds: string | string[],
  collectionName: string,
): Promise<DocumentReference[]> => {
  if (typeof labelIds === "string") {
    labelIds = [labelIds];
  }
  const refs = [];
  for (const labelId of labelIds) {
    const labelRef = await idToRef(labelId, collectionName);
    refs.push(labelRef);
  }
  return refs;
};

const addMember = async (
  member: CreateMemberFields,
): Promise<DocumentReference> => {
  try {
    const collectionRef = collection(db, FirebaseTablesEnum.MEMBERS);
    const maskedEmail = cloakEmail(member.email);
    const data = {
      ...member,
      last_modified: serverTimestamp(),
      last_modified_by: FirebaseDefaultValuesEnum.LAST_MODIFIED_BY,
      masked_email: maskedEmail,
      requests: "",
      status: StatusEnum.PENDING,
      unsubscribed: member.unsubscribed,
    };
    delete data.email; // Don't store email in the member record
    const docRef = await addDoc(collectionRef, data);
    addSecureEmail(member.email, docRef);
    return docRef;
  } catch (error) {
    console.error("Error adding member: ", error);
    throw error;
  }
};

async function handleLabelRefs(
  selectedIds: string[] | string,
  suggested: string,
  collectionName: "focuses" | "industries",
): Promise<DocumentReference[]> {
  let refs: DocumentReference[] = [];

  if (typeof selectedIds === "string") {
    selectedIds = [selectedIds];
  }

  if (selectedIds) {
    const selectedRefs = await idsToRefs(selectedIds, collectionName);
    refs = [...refs, ...selectedRefs];
  }

  if (suggested) {
    const suggestedRef = await addLabelRef(suggested, collectionName);
    refs = [...refs, suggestedRef];
  }

  return refs;
}

export const addMemberToFirebase = async (
  fields: CreateMemberFields,
): Promise<DocumentReference> => {
  const member = {
    company_size: fields.companySize,
    email: fields.email,
    focuses: [],
    industries: [],
    link: fields.website, //TODO: Remove "website" input param and replace with "link"
    location: fields.location,
    name: fields.name,
    regions: [],
    title: fields.title,
    years_experience: fields.yearsExperience,
    unsubscribed: fields.unsubscribed,
  };

  const focuses = await handleLabelRefs(
    fields.focusesSelected,
    fields.focusSuggested,
    "focuses",
  );
  if (focuses.length > 0) member.focuses = focuses;

  const industries = await handleLabelRefs(
    fields.industriesSelected,
    fields.industrySuggested,
    "industries",
  );
  if (industries.length > 0) member.industries = industries;

  member["experience"] = await nameToRef(fields.yearsExperience, "experience");

  return new Promise(async (resolve, reject) => {
    try {
      const docRef = await addMember(member);
      resolve(docRef);
    } catch (error) {
      console.error("Error adding member:", error);
      reject(error);
    }
  });
};

interface referencesToDelete {
  memberRef: DocumentReference;
  focuses: DocumentReference[];
  industries: DocumentReference[];
  regions: DocumentReference[];
  experience: DocumentReference;
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
    experience: data.experience,
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

export async function getMemberRef(uid: string): Promise<DocumentReference> {
  const memberRef = doc(db, FirebaseTablesEnum.MEMBERS, uid).withConverter(
    memberConverter,
  );
  return memberRef;
}

export async function getMembersTable(
  table: FirebaseTablesEnum,
  converter: FirestoreDataConverter<Member>,
  approved: boolean = false,
  isAdmin: boolean = false,
  memberIds?: string[],
  userId?: string,
): Promise<Member[]> {
  const documentsCollection = collection(db, table).withConverter(converter);
  const queryConditions = [];
  if (approved) {
    queryConditions.push(where("status", "==", StatusEnum.APPROVED));
  }
  if (memberIds?.length) {
    queryConditions.push(where(documentId(), "in", memberIds));
  }
  const q = query(documentsCollection, ...queryConditions);
  const documentsSnapshot = await getDocs(q);
  return documentsSnapshot.docs
    .map((doc) => {
      if (approved || doc.id === userId || isAdmin) {
        return doc.data();
      }
      return null; // Explicitly return null for filtered out members
    })
    .filter((member) => member !== null); // Filter out null values
}

export async function getNumberOfMembers(): Promise<number> {
  const membersCollection = query(
    collection(db, FirebaseTablesEnum.MEMBERS),
    where("status", "==", StatusEnum.APPROVED),
  );
  const snapshot = await getCountFromServer(membersCollection);
  return snapshot.data().count;
}

async function getMembersTablePaged(
  converter: FirestoreDataConverter<Member>,
  pageSize: number = 10,
  cursor?: string,
): Promise<PaginatedResponse> {
  let membersQuery = query(
    collection(db, FirebaseTablesEnum.MEMBERS).withConverter(converter),
    where("status", "==", StatusEnum.APPROVED),
  );
  if (cursor && cursor.trim() !== "") {
    const cursorDoc = await getDoc(doc(db, FirebaseTablesEnum.MEMBERS, cursor));
    if (!cursorDoc.exists()) {
      throw new Error("Invalid cursor");
    }
    membersQuery = query(membersQuery, startAfter(cursorDoc));
  }
  membersQuery = query(membersQuery, limit(pageSize + 1));
  const snapshot = await getDocs(membersQuery);
  const members = snapshot.docs
    .slice(0, pageSize)
    .map((doc) => ({ ...doc.data(), id: doc.id }));
  return {
    items: members,
    hasMore: snapshot.docs.length > pageSize,
    cursor: members.length > 0 ? members[members.length - 1].id : null,
  };
}

export default serverSideOnly({
  getMembers,
  updateMember,
  handleLabelRefs,
  addMemberToFirebase,
  getAllMemberReferencesToDelete,
  deleteReferences,
  getMemberRef,
});
