import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FirebaseTablesEnum, YearsOfExperienceEnum } from "./enums";

export interface MemberPublic {
  name?: string;
  companySize?: string;
  emailAbbr?: string;
  focus?: { name: string; id: string }[] | string[];
  focusSuggested?: string;
  id?: string;
  industry?: { name: string; id: string }[] | string[];
  industrySuggested?: string;
  link?: string;
  location?: string;
  region?: string;
  title?: string;
  yearsExperience?: string;
}

export interface MemberPublicEditing extends MemberPublic {
  editing?: { field: string; changeTo: string | string[] }[];
}

export interface DocumentData {
  id: string;
  fields: any;
}

export interface FilterData {
  id: string;
  name: string;
}

export async function getFirebaseTable(
  table: FirebaseTablesEnum
): Promise<DocumentData[]> {
  const documentsCollection = collection(db, table);
  const documentsSnapshot = await getDocs(documentsCollection);
  const documentsData = documentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    fields: doc.data(),
  }));
  return documentsData;
}

function regionLookup(
  member: DocumentData,
  regions: DocumentData[]
): FilterData {
  return (
    regions.find((region) => {
      const memberRegion = member.fields.regions;
      if (
        memberRegion &&
        Array.isArray(memberRegion) &&
        memberRegion.length !== 0
      ) {
        return region.id === memberRegion[0].id;
      }
    })?.fields.name || null
  );
}

function focusLookup(
  member: DocumentData,
  focuses: DocumentData[]
): FilterData[] {
  const memberFocus = member.fields.focuses;
  if (memberFocus && Array.isArray(memberFocus) && memberFocus.length !== 0) {
    return memberFocus.map((foc) => {
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
            };
          })[0] || null
      );
    });
  }
  return null;
}

function industryLookup(
  member: DocumentData,
  industries: DocumentData[]
): FilterData[] {
  const memberIndustry = member.fields.industries;
  if (
    memberIndustry &&
    Array.isArray(memberIndustry) &&
    memberIndustry.length !== 0
  ) {
    return memberIndustry.map((ind) => {
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
            };
          })[0] || null
      );
    });
  }
  return null;
}

export async function getMembers(
  focusesData?: DocumentData[],
  industriesData?: DocumentData[],
  regionsData?: DocumentData[]
): Promise<MemberPublic[]> {
  const members = await getFirebaseTable(FirebaseTablesEnum.MEMBERS);
  const focuses =
    focusesData || (await getFirebaseTable(FirebaseTablesEnum.FOCUSES));
  const industries =
    industriesData || (await getFirebaseTable(FirebaseTablesEnum.INDUSTRIES));
  const regions =
    regionsData || (await getFirebaseTable(FirebaseTablesEnum.REGIONS));
  return members
    .map((member) => {
      const regionLookupVal = regionLookup(member, regions);
      return member.fields.status === "approved"
        ? {
            name:
              typeof member.fields["name"] === "string"
                ? member.fields["name"]
                : null,
            location:
              typeof member.fields["location"] === "string"
                ? member.fields["location"]
                : null,
            link:
              typeof member.fields["link"] === "string"
                ? member.fields["link"]
                : null,
            title:
              typeof member.fields["title"] === "string"
                ? member.fields["title"]
                : null,
            id: typeof member.id === "string" ? member.id : null,
            companySize:
              typeof member.fields["company_size"] === "string"
                ? member.fields["company_size"]
                : null,
            yearsExperience:
              typeof member.fields["years_experience"] === "string"
                ? member.fields["years_experience"]
                : null,
            emailAbbr: member.fields["masked_email"] || null,
            region:
              typeof regionLookupVal === "string" ? regionLookupVal : null,
            industry: industryLookup(member, industries),
            focus: focusLookup(member, focuses),
          }
        : null;
    })
    .filter(function (value) {
      return value !== null;
    })
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
}

function hasApprovedMembers(
  approvedMemberIds: string[],
  memberList: DocumentData
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
  filterData?: DocumentData[]
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
              role.fields["members"].map((member) => member.id)
            )
          : true)
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
  filterData?: DocumentData[]
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
    filterType == "experience" ? member.yearsExperience : member.region
  );
  memFil.forEach((member) => {
    let expIndex = filterList.findIndex(
      (exp) =>
        exp.name ===
        (filterType == "experience" ? member.yearsExperience : member.region)
    );
    if (!filterList[expIndex].hasApprovedMembers)
      filterList[expIndex].hasApprovedMembers = true;
    filterList[expIndex].count++;
    filterList[expIndex].members.push(member.id);
  });
  return filterList;
}
