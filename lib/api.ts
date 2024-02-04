import { db } from "@/lib/firebase";
import {
  collection,
  DocumentReference,
  FirestoreDataConverter,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { FirebaseTablesEnum, StatusEnum, YearsOfExperienceEnum } from "./enums";

const statusEnumValues = Object.values(StatusEnum);

export interface MemberPublic {
  companySize?: string;
  emailAbbr?: string;
  focus?: { name: string; id: string }[] | string[];
  focusSuggested?: string;
  id?: string;
  industry?: { name: string; id: string }[] | string[];
  industrySuggested?: string;
  lastModified?: Timestamp;
  link?: string;
  location?: string;
  name?: string;
  region?: string;
  status?: StatusEnum;
  title?: string;
  unsubscribed?: boolean;
  yearsExperience?: string;
}

export interface MemberPublicEditing extends MemberPublic {
  editing?: { field: string; changeTo: string | string[] }[];
}

export interface MemberSecure extends MemberPublic {
  email?: MemberEmail;
}

export interface RegionPublic {
  name?: string;
  id?: string;
  count?: number;
}

export interface DocumentData {
  id: string;
  fields: any;
}

export interface FilterData {
  id: string;
  name: string;
  status?: StatusEnum;
}

export async function getFirebaseTable(
  table: FirebaseTablesEnum,
): Promise<DocumentData[]> {
  const documentsCollection = collection(db, table);
  const documentsSnapshot = await getDocs(documentsCollection);
  const documentsData = documentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    fields: doc.data(),
  }));
  return documentsData;
}

export async function getFirebaseData(
  table: FirebaseTablesEnum,
  converter: FirestoreDataConverter<any>,
): Promise<any[]> {
  const documentsCollection = collection(db, table).withConverter(converter);
  const documentsSnapshot = await getDocs(documentsCollection);
  return documentsSnapshot.docs.map((doc) => doc.data());
}

export function regionLookup(
  regions: DocumentData[],
  memberRegionData: DocumentReference[],
): FilterData {
  return (
    regions.find((region) => {
      if (
        memberRegionData &&
        Array.isArray(memberRegionData) &&
        memberRegionData.length !== 0
      ) {
        return region.id === memberRegionData[0].id;
      }
    })?.fields.name || null
  );
}

export function focusLookup(
  focuses: DocumentData[],
  memberFocusData?: DocumentReference[],
): FilterData[] {
  if (
    memberFocusData &&
    Array.isArray(memberFocusData) &&
    memberFocusData.length !== 0
  ) {
    return memberFocusData.map((foc) => {
      return (
        focuses
          .filter((thisFoc) => foc.id === thisFoc.id)
          .map((foc) => {
            return {
              name:
                typeof foc.fields["name"] === "string"
                  ? foc.fields["name"]
                  : null,
              id: typeof foc.id === "string" ? foc.id : null,
              status: typeof statusEnumValues.includes(foc.fields["status"])
                ? foc.fields["status"]
                : null,
            };
          })[0] || null
      );
    });
  }
  return null;
}

export function industryLookup(
  industries: DocumentData[],
  memberIndustryData: DocumentReference[],
): FilterData[] {
  if (
    memberIndustryData &&
    Array.isArray(memberIndustryData) &&
    memberIndustryData.length !== 0
  ) {
    return memberIndustryData.map((ind) => {
      return (
        industries
          .filter((thisInd) => ind.id === thisInd.id)
          .map((ind) => {
            return {
              name:
                typeof ind.fields["name"] === "string"
                  ? ind.fields["name"]
                  : null,
              id: typeof ind.id === "string" ? ind.id : null,
              status: typeof statusEnumValues.includes(ind.fields["status"])
                ? ind.fields["status"]
                : null,
            };
          })[0] || null
      );
    });
  }
  return null;
}

export interface MemberEmail {
  id?: string;
  name?: string;
  email?: string;
  emailAbbr?: string;
  status?: StatusEnum;
  unsubscribed?: boolean;
}

function hasApprovedMembers(
  approvedMemberIds: string[],
  memberList: DocumentData,
): boolean {
  for (const member in memberList) {
    if (approvedMemberIds.includes(memberList[member])) {
      return true;
    }
  }
  return false;
}

export interface Filter {
  name: string;
  id: string;
  filterType: string;
  members?: string[];
  count?: number;
  hasApprovedMembers?: boolean;
}

export async function getFilters(
  filterType: FirebaseTablesEnum,
  limitByMembers?: boolean,
  approvedMemberIds?: string[],
  filterData?: DocumentData[],
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
              role.fields["members"].map((member) => member.id),
            )
          : true),
    )
    .map((role) => {
      const member_ids = role.fields["members"].map((member) => member.id);
      return {
        name:
          typeof role.fields["name"] === "string" ? role.fields["name"] : null,
        id: typeof role.id === "string" ? role.id : null,
        filterType: filterType,
        members: Array.isArray(role.fields["members"]) ? member_ids : null,
        count: Array.isArray(role.fields["members"]) ? member_ids.length : 0,
        hasApprovedMembers: limitByMembers
          ? hasApprovedMembers(approvedMemberIds, member_ids)
          : true,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function getExperienceData(): FilterData[] {
  let return_list = [];
  for (let item in YearsOfExperienceEnum) {
    return_list.push({
      fields: { name: YearsOfExperienceEnum[item] },
      id: item,
    });
  }
  return return_list;
}

export async function getFiltersBasic(
  members: MemberPublic[],
  filterType: FirebaseTablesEnum | "experience",
  filterData?: DocumentData[],
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
    let expIndex = filterList.findIndex(
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
