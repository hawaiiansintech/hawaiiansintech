import {
  DocumentData,
  MemberPublic,
  RegionPublic,
  focusLookup,
  getFirebaseData,
  getFirebaseTable,
  industryLookup,
  regionLookup,
} from "@/lib/api";
import { verifyAdminToken } from "@/lib/auth";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import { memberConverter } from "@/lib/firestore-converters/member";

interface GetMembersOptions {
  /**
   * Required check if the user is admin via verifyAdminToken(token)
   *  - If the user is an admin, allow returning of all Statuses;
   *    Including [StatusEnum.PENDING, StatusEnum.IN_PROGRESS, StatusEnum.DECLINED].
   */
  token?: string;
}

export async function getMembers(options: GetMembersOptions = {}): Promise<{
  members: MemberPublic[];
  regions: DocumentData[];
  industries: DocumentData[];
  focuses: DocumentData[];
}> {
  const members = await getFirebaseData(
    FirebaseTablesEnum.MEMBERS,
    memberConverter,
  );
  const { token } = options;

  let isAdmin = false;
  if (token) {
    isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      console.warn("Token provided is not authorized");
    }
  }

  const focusesData = await getFirebaseTable(FirebaseTablesEnum.FOCUSES);
  const industriesData = await getFirebaseTable(FirebaseTablesEnum.INDUSTRIES);
  const regionsData = await getFirebaseTable(FirebaseTablesEnum.REGIONS);

  return {
    members: members
      .filter((member) => isAdmin || member.status === StatusEnum.APPROVED)
      .map((member) => {
        const {
          regions,
          industries,
          focuses,
          lastModifiedBy,
          maskedEmail,
          lastModified,
          emailAbbr,
          requests,
          unsubscribed,
          ...rest
        } = member;

        let memberObject = {
          ...rest,
          region: regionLookup(regionsData, regions),
          industry: industryLookup(industriesData, industries),
          focus: focusLookup(focusesData, focuses),
        };

        if (isAdmin) {
          memberObject = {
            ...memberObject,
            lastModified: lastModified.toDate().toLocaleString(),
            emailAbbr: maskedEmail,
            requests: requests,
            unsubscribed: unsubscribed,
          };
        }

        return memberObject;
      })
      .filter((value) => value !== null)
      .sort((a, b) => a.name.localeCompare(b.name)),
    focuses: focusesData,
    industries: industriesData,
    regions: regionsData,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    let data;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      data = await getMembers({ token: token });
    } else {
      console.log({ message: "No authorization header included" });
      data = await getMembers();
    }

    return res.status(200).json({
      message: "Successfully fetched members and supporting data.",
      members: data.members,
      focuses: data.focuses,
      industries: data.industries,
      regions: data.regions,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
