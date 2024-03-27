import { verifyAdminToken, verifyAuthHeader } from "@/lib/auth";
import { FirebaseTablesEnum } from "@/lib/enums";
import { initializeAdmin } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { FirebaseMemberFieldsEnum as mFields } from "@/lib/enums";
import { DocumentReference } from "@firebase/firestore";
import {
  getMemberRef as getMemberRefPublic,
  deleteReferences as deleteReferencesPublic,
  addMemberToReferences as addMemberToReferencesPublic,
  getReferences as getReferencesPublic,
  addLabelRef as addLabelRefPublic,
  addMemberToLabels as addMemberToLabelsPublic,
} from "@/lib/firebase-helpers/public/directory";
import { NextApiRequest, NextApiResponse } from "next";
import { MemberPublic } from "@/lib/api";
import { memberPublicValidator } from "@/lib/validators/memberPublicValidator";

const fieldNameToTable = {
  [mFields.INDUSTRIES]: FirebaseTablesEnum.INDUSTRIES,
  [mFields.FOCUSES]: FirebaseTablesEnum.FOCUSES,
  [mFields.REGIONS]: FirebaseTablesEnum.REGIONS,
};

const updateAdminFilterReferences = async (
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
  if (adminReferencesToDelete.length !== 0) {
    await docRef.update({
      [filterName]: admin.firestore.FieldValue.arrayRemove(
        ...adminReferencesToDelete,
      ),
      last_modified: admin.firestore.FieldValue.serverTimestamp(),
      last_modified_by: currentUser || "admin edit",
    });
  }
  if (adminReferencesToAdd.length !== 0) {
    await docRef.update({
      [filterName]: admin.firestore.FieldValue.arrayUnion(
        ...adminReferencesToAdd,
      ),
      last_modified: admin.firestore.FieldValue.serverTimestamp(),
      last_modified_by: currentUser || "admin edit",
    });
  }
};

const updatePublicFilterReferences = async (
  id: string,
  oldReferenceIds: string[],
  newReferenceIds: string[],
  filterName: string,
  currentUser: string,
): Promise<[DocumentReference[], DocumentReference[]]> => {
  const newReferences: DocumentReference[] = await getReferencesPublic(
    newReferenceIds,
    fieldNameToTable[filterName],
  );
  const oldReferences = await getReferencesPublic(
    oldReferenceIds,
    fieldNameToTable[filterName],
  );
  const referencesToDelete: DocumentReference[] = oldReferences.filter(
    (ref) => !newReferences.includes(ref),
  );
  const referencesToAdd: DocumentReference[] = newReferences.filter(
    (ref) => !oldReferences.includes(ref),
  );
  const memberRefPublic = await getMemberRefPublic(id);
  await deleteReferencesPublic(memberRefPublic, referencesToDelete);
  await addMemberToReferencesPublic(
    memberRefPublic,
    referencesToAdd,
    currentUser,
  );
  return [referencesToAdd, referencesToDelete];
};

const addNewLabel = async (
  id: string,
  newFitler: string,
  filterName: string,
  currentUser: string,
  docRef: admin.firestore.DocumentReference,
) => {
  const memberRefPublic = await getMemberRefPublic(id);
  const newLabelRef = await addLabelRefPublic(
    newFitler,
    fieldNameToTable[filterName],
  );
  await addMemberToLabelsPublic([newLabelRef], memberRefPublic);
  const writeResult = await docRef.update({
    [filterName]: admin.firestore.FieldValue.arrayUnion(
      ...[admin.firestore().doc(newLabelRef.path)],
    ),
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: currentUser || "admin edit",
  });
  console.log(`Added new label ${newFitler} : ${writeResult}`);
};

const updateMember = async (memberData: MemberPublic, currentUser: string) => {
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

  // Handle filter references
  const fields = [
    mFields.FOCUSES.toString(),
    mFields.INDUSTRIES.toString(),
    mFields.REGIONS.toString(),
  ];
  const fieldSingular = {
    // TODO: Update fields to plural in MemberPublic
    [mFields.FOCUSES.toString()]: "focus",
    [mFields.INDUSTRIES.toString()]: "industry",
    [mFields.REGIONS.toString()]: "region",
  };
  for (const field of fields) {
    const oldReferenceIds = data[field] ? data[field].map((ref) => ref.id) : [];
    const newReferenceIds =
      // TODO: Update region to regions
      field === mFields.REGIONS.toString() && memberData[fieldSingular[field]]
        ? [memberData[fieldSingular[field]]]
        : memberData[fieldSingular[field]]
        ? memberData[fieldSingular[field]].map((ref) => ref.id)
        : [];
    const [referencesToAdd, referencesToDelete] =
      await updatePublicFilterReferences(
        memberData.id,
        oldReferenceIds,
        newReferenceIds,
        field,
        currentUser,
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
  const suggested = [mFields.FOCUSES.toString(), mFields.INDUSTRIES.toString()];
  for (const field of suggested) {
    const suggestedField = memberData[fieldSingular[field] + "Suggested"];
    if (suggestedField) {
      await addNewLabel(
        memberData.id,
        suggestedField,
        field,
        currentUser,
        docRef,
      );
    }
  }

  // Have to drop the fields that are not in the database or are handled above
  const {
    emailAbbr,
    yearsExperience,
    region,
    companySize,
    focus,
    industry,
    lastModified,
    focusSuggested,
    industrySuggested,
    ...droppedMemberData
  } = memberData;

  const writeResult = await docRef.update({
    ...droppedMemberData,
    company_size: companySize,
    last_modified: admin.firestore.FieldValue.serverTimestamp(),
    last_modified_by: currentUser || "admin edit",
    masked_email: emailAbbr,
    years_experience: yearsExperience,
  });

  console.log(
    `Updated member ${memberData.id} with ${JSON.stringify(
      memberData,
    )}: ${writeResult}`,
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }
  try {
    if (req.body.memberPublic === undefined) {
      return res.status(422).json({ message: "Missing member memberPublic" });
    } else if (req.body.currentUser === undefined) {
      return res.status(422).json({ message: "Missing currentUser" });
    }

    try {
      await memberPublicValidator.validate(req.body.memberPublic);
    } catch (error) {
      return res.status(422).json({ message: error.message });
    }

    const token = await verifyAuthHeader(req, res);
    if (!token) return;
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await updateMember(req.body.memberPublic, req.body.currentUser).then(
      (writeResult) => {
        console.debug("writeResult for /update-member:", writeResult);
      },
    );
    return res.status(200).json({
      message: `Successfully updated ${req.body.memberPublic.id}`,
    });
  } catch (error) {
    console.error(error.message);
    console.log(error);
    return res.status(error.statusCode || 500).json({
      error: "Gonfunnit, looks like something went wrong!",
      body: "Please try again later.",
    });
  }
}
