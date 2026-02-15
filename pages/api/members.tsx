import {
  verifyAdminOrEmailAuthToken,
  verifyAdminToken,
  verifyAuthHeader,
  verifyTurnstileToken,
} from "@/lib/api-helpers/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { memberPublicValidator } from "@/lib/validators/memberPublicValidator";
import { handleApiErrors } from "@/lib/api-helpers/errors";
import { checkMethods, checkBodyParams } from "@/lib/api-helpers/format";
import { MemberPublic } from "@/lib/firebase-helpers/interfaces";
import {
  addMemberToFirebase,
  getMemberRef,
  getMembers,
  updateMember,
} from "@/lib/firebase-helpers/members";
import { emailExists } from "@/lib/firebase-helpers/emails";
import { DocumentReference } from "firebase/firestore";
import { sendConfirmationEmails } from "@/lib/email";
import { sendSensitiveChangesEmail } from "@/lib/email/send-sensitive-change-email";
import {
  addMemberToLabels,
  deleteMemberFromLabels,
} from "@/lib/firebase-helpers/filters";
import { StatusEnum } from "@/lib/enums";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  checkMethods(req.method, ["GET"]);
  const authHeader = req.headers.authorization;
  let data;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    data = await getMembers({ token: token });
  } else {
    console.log({ message: "No authorization header included" });
    const payload = {};
    if (req.query.cursor) {
      payload["cursor"] = req.query.cursor as string;
      payload["paginated"] = true;
    }
    if (req.query.memberIds) {
      payload["memberIds"] = (req.query.memberIds as string)
        .split(",")
        .filter(Boolean);
    }
    if (req.query.withoutFilters) {
      payload["includeFilters"] = false;
    }
    data = await getMembers(payload);
  }

  return res.status(200).json({
    message: "Successfully fetched members and supporting data.",
    members: data.members,
    focuses: data.focuses,
    industries: data.industries,
    regions: data.regions,
    experience: data.experience,
    cursor: data.cursor,
    hasMore: data.hasMore,
  });
}

type MemberChange = {
  [K in keyof MemberPublic]?: {
    old: MemberPublic[K] | undefined;
    new: MemberPublic[K] | undefined;
  };
};

function getSensitiveChanges(
  memberOld: MemberPublic,
  memberNew: MemberPublic,
): MemberChange {
  const changes = {};
  [
    "name",
    "title",
    "link",
    "location",
    "focusSuggested",
    "industrySuggested",
  ].forEach((key) => {
    const oldValue = memberOld[key];
    const newValue = memberNew[key];

    if (oldValue !== newValue) {
      changes[key] = {
        old: oldValue,
        new: newValue,
      };
    }
  });
  return changes;
}

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
  checkBodyParams(req, {
    memberOld: "object",
    memberNew: "object",
    currentUser: "string",
  });
  const { memberOld, memberNew } = req.body;
  try {
    await memberPublicValidator.validate(memberNew);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }

  const token = await verifyAuthHeader(req);
  const isAdmin = await verifyAdminToken(token, false);
  await verifyAdminOrEmailAuthToken(memberNew.id, token);

  const sensitiveChanges = getSensitiveChanges(memberOld, memberNew);

  await updateMember(memberNew, req.body.currentUser, isAdmin).then(
    (writeResult) => {
      console.debug("writeResult for /update-member:", writeResult);
    },
  );

  if (Object.keys(sensitiveChanges).length > 0) {
    await sendSensitiveChangesEmail({
      name: memberNew.name,
      recordID: memberNew.id,
      changes: JSON.stringify(sensitiveChanges),
    });
  }

  const memberRef = await getMemberRef(memberNew.id);
  if (
    memberOld.status !== StatusEnum.APPROVED &&
    memberNew.status === StatusEnum.APPROVED &&
    isAdmin
  ) {
    // Add member to label references if approved
    addMemberToLabels(memberRef);
  } else if (
    memberOld.status === StatusEnum.APPROVED &&
    memberNew.status !== StatusEnum.APPROVED &&
    isAdmin
  ) {
    // Remove member from label references if unapproved
    deleteMemberFromLabels(memberRef);
  }

  return res.status(200).json({
    message: `Successfully updated ${memberNew.id}`,
  });
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  checkBodyParams(req, { turnstileToken: "string" });
  const turnstileToken = req.body.turnstileToken;
  const ip = Array.isArray(req.headers["CF-Connecting-IP"])
    ? req.headers["CF-Connecting-IP"][0]
    : req.headers["CF-Connecting-IP"];
  await verifyTurnstileToken(turnstileToken, ip);

  const {
    email,
    name,
    location,
    title,
    website, // TODO: Remove "website" input param and replace with "link"
  } = req.body;

  const isEmailUsed = await emailExists(email);
  if (isEmailUsed) {
    console.log("🚫 email already exists");
    return res.status(409).json({
      error: "409",
      body: "Sorry, please use a different email.",
    });
  }
  const docRef: DocumentReference = await addMemberToFirebase({
    ...req.body,
  }).then((body) => {
    console.log("✅ added member to firebase");
    return body;
  });
  const { id } = docRef;

  await sendConfirmationEmails({
    email: email,
    recordID: id,
    name: name,
    location: location,
    title: title,
    link: website, // TODO: Remove "website" input param and replace with "link"
  })
    .then(() => {
      console.log("✅ sent 2 emails via sendgrid");
    })
    .catch((error) => {
      console.error("🚫 Error sending email:", error);
      throw error;
    });

  return res.status(200).json({ message: "Successfully added member." });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    checkMethods(req.method, ["GET", "PUT", "POST"]);
    if (req.method === "GET") {
      await getHandler(req, res);
    } else if (req.method === "PUT") {
      await putHandler(req, res);
    } else if (req.method === "POST") {
      await postHandler(req, res);
    } else {
      res.status(405).json({ message: "Only GET and PUT requests allowed" });
    }
  } catch (error) {
    console.log("🚫 Error in /members:", error);
    return handleApiErrors(error, res);
  }
}
