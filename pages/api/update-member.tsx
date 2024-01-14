import { verifyAdminToken, verifyAuthHeader } from "@/lib/auth";
import { FirebaseMemberFieldsEnum, FirebaseTablesEnum } from "@/lib/enums";
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

type UpdateMemberRequest = {
  uid: string;
  fieldName: FirebaseMemberFieldsEnum;
  newData: string | string[];
  currentUser: string;
  suggestedFilter?: boolean;
};

const updateMemberField = async (
  reqBody: UpdateMemberRequest,
): Promise<FirebaseFirestore.WriteResult | null> => {
  await initializeAdmin();
  const docRef = admin
    .firestore()
    .collection(FirebaseTablesEnum.MEMBERS)
    .doc(reqBody.uid);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`Member with uid ${reqBody.uid} does not exist`);
  }

  if (!Object.values(mFields).includes(reqBody.fieldName as mFields)) {
    throw new Error(
      `Field ${reqBody.fieldName} does not exist in the ` +
        `FirebaseMemberFieldsEnum`,
    );
  }

  if (doc.get(reqBody.fieldName) === undefined) {
    throw new Error(
      `Field ${reqBody.fieldName} does not exist for user ${reqBody.uid}`,
    );
  }

  const arrayFields = [
    mFields.INDUSTRIES.toString(),
    mFields.FOCUSES.toString(),
    mFields.REGIONS.toString(),
  ];
  const fieldNameToTable = {
    [mFields.INDUSTRIES]: FirebaseTablesEnum.INDUSTRIES,
    [mFields.FOCUSES]: FirebaseTablesEnum.FOCUSES,
    [mFields.REGIONS]: FirebaseTablesEnum.REGIONS,
  };

  if (reqBody.suggestedFilter && !arrayFields.includes(reqBody.fieldName)) {
    throw new Error(`Field ${reqBody.fieldName} is not a suggested filter`);
  }

  if (!reqBody.suggestedFilter && arrayFields.includes(reqBody.fieldName)) {
    if (typeof reqBody.newData === "string") {
      throw new Error(
        `Field ${reqBody.fieldName} is supposed to be a string array, but ` +
          `newData is a string`,
      );
    }

    const data = doc.data();

    // Deal with filter references (change publicly since we have the
    //  functions available) before updating the member
    const oldReferenceIds = data[reqBody.fieldName].map((ref) => ref.id);
    const newReferences: DocumentReference[] = await getReferencesPublic(
      reqBody.newData,
      fieldNameToTable[reqBody.fieldName],
    );
    const oldReferences = await getReferencesPublic(
      oldReferenceIds,
      fieldNameToTable[reqBody.fieldName],
    );
    const referencesToDelete: DocumentReference[] = oldReferences.filter(
      (ref) => !newReferences.includes(ref),
    );
    const referencesToAdd: DocumentReference[] = newReferences.filter(
      (ref) => !oldReferences.includes(ref),
    );
    const memberRefPublic = await getMemberRefPublic(reqBody.uid);
    await deleteReferencesPublic(memberRefPublic, referencesToDelete);
    await addMemberToReferencesPublic(
      memberRefPublic,
      referencesToAdd,
      reqBody.currentUser,
    );

    // Need to convert to admin.firestore.DocumentReference, difference in
    //  how they're handled
    const adminReferencesToAdd = referencesToAdd.map((ref) =>
      admin.firestore().doc(ref.path),
    );
    const adminReferencesToDelete = referencesToDelete.map((ref) =>
      admin.firestore().doc(ref.path),
    );
    const oldData = doc.get(reqBody.fieldName);
    let writeResult = null;
    if (adminReferencesToDelete.length !== 0) {
      let writeResult = await docRef.update({
        [reqBody.fieldName]: admin.firestore.FieldValue.arrayRemove(
          ...adminReferencesToDelete,
        ),
        last_modified: admin.firestore.FieldValue.serverTimestamp(),
        last_modified_by: reqBody.currentUser || "admin edit",
      });
      console.log(
        `Deleted references ${adminReferencesToDelete} from ` +
          `$reqBody.{fieldName} for ${reqBody.uid}: ${writeResult}`,
      );
    }
    if (adminReferencesToAdd.length !== 0) {
      let writeResult = await docRef.update({
        [reqBody.fieldName]: admin.firestore.FieldValue.arrayUnion(
          ...adminReferencesToAdd,
        ),
        last_modified: admin.firestore.FieldValue.serverTimestamp(),
        last_modified_by: reqBody.currentUser || "admin edit",
      });
      console.log(
        `Added references ${adminReferencesToAdd} to ${reqBody.fieldName} ` +
          `for ${reqBody.uid}: ${writeResult}`,
      );
    }
    console.log(
      `Updated ${reqBody.fieldName} from ${oldData} to ${reqBody.newData} ` +
        `for ${reqBody.uid}`,
    );
    return writeResult;
  } else if (
    reqBody.suggestedFilter &&
    arrayFields.includes(reqBody.fieldName)
  ) {
    for (const newFitler of reqBody.newData) {
      if (typeof newFitler !== "string") {
        throw new Error(
          `Field ${reqBody.fieldName} is supposed to be a string array, but ` +
            `newData contains a non-string`,
        );
      }
      const memberRefPublic = await getMemberRefPublic(reqBody.uid);
      const newLabelRef = await addLabelRefPublic(
        newFitler,
        fieldNameToTable[reqBody.fieldName],
      );
      await addMemberToLabelsPublic([newLabelRef], memberRefPublic);
      const writeResult = await docRef.update({
        [reqBody.fieldName]: admin.firestore.FieldValue.arrayUnion(
          ...[admin.firestore().doc(newLabelRef.path)],
        ),
        last_modified: admin.firestore.FieldValue.serverTimestamp(),
        last_modified_by: reqBody.currentUser || "admin edit",
      });
      console.log(writeResult);
    }
  } else {
    const oldData = doc.get(reqBody.fieldName);
    const writeResult = await docRef.update({
      [reqBody.fieldName]: reqBody.newData,
      last_modified: admin.firestore.FieldValue.serverTimestamp(),
      last_modified_by: reqBody.currentUser || "admin edit",
    });
    console.log(
      `Updated ${reqBody.fieldName} from ${oldData} to 
      ${reqBody.newData} for ${reqBody.uid}`,
    );
    return writeResult;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }
  try {
    if (req.body.uid === undefined) {
      return res.status(422).json({ message: "Missing uid" });
    } else if (req.body.fieldName === undefined) {
      return res.status(422).json({ message: "Missing fieldName" });
    } else if (req.body.newData === undefined) {
      return res.status(422).json({ message: "Missing newData" });
    } else if (req.body.currentUser === undefined) {
      return res.status(422).json({ message: "Missing currentUser" });
    }
    const token = await verifyAuthHeader(req, res);
    if (!token) return;
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updateRequest: UpdateMemberRequest = req.body;
    updateRequest.suggestedFilter =
      req.body.suggestedFilter === undefined ? false : true;

    await updateMemberField(updateRequest).then((writeResult) => {
      console.debug("writeResult for /update-member:", writeResult);
    });
    return res.status(200).json({
      message: `Successfully updated ${req.body.fieldName}`,
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
