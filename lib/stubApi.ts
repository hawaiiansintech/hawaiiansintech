import { Filter, MemberPublic } from "./api";
import { CompanySizeEnum, YearsOfExperienceEnum } from "./enums";
export type { MemberPublic };
/**
 * Stubbed function to simulate fetching technologists
 * without connecting to firebase.
 *
 * @returns stubbed values
 */

interface MemberPublicDupe {
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

export function getMembers(): MemberPublicDupe[] {
  return [
    {
      id: "fakeMemberID01",
      name: "Andrew Taeoalii",
      location: "Hilo",
      region: "Hawaiʻi",
      emailAbbr: "a...w@hawaiiansintech.org",
      title: "Engineering Manager",
      link: "https://linkedin.com/in/andrewtaeoalii",
      focus: [{ name: "Engineering", id: "fakeFocusID01" }],
      industry: [{ name: "Internet / Technology", id: "fakeIndustryID01" }],
      companySize: CompanySizeEnum.FIVE_THOUSAND_TO_TEN_THOUSAND,
      yearsExperience: YearsOfExperienceEnum.TEN_TO_NINETEEN,
    },
    {
      id: "fakeMemberID02",
      name: "Emmit Kamakani Parubrub",
      location: "San Francisco Bay Area",
      region: "California",
      title: "Software Engineer in Test II",
      link: "https://www.linkedin.com/in/emmit-parubrub/",
      emailAbbr: "k...i@hawaiiansintech.org",
      focus: [{ name: "Engineering", id: "fakeFocusID01" }],
      industry: [{ name: "Healthcare", id: "fakeIndustryID02" }],
      companySize:
        CompanySizeEnum.ONE_THOUSAND_TO_FOUR_THOUSAND_NINE_HUNDRED_NINETY_NINE,
      yearsExperience: YearsOfExperienceEnum.TEN_TO_NINETEEN,
    },
    {
      id: "fakeMemberID03",
      name: "Taylor Ho",
      location: "San Francisco",
      region: "California",
      title: "Principal UX/UI Designer",
      link: "https://linkedin.com/in/taylorho",
      emailAbbr: "k...i@hawaiiansintech.org",
      focus: [
        { name: "Engineering", id: "fakeFocusID01" },
        { name: "Design", id: "fakeFocusID02" },
      ],
      industry: [{ name: "Internet / Technology", id: "fakeIndustryID01" }],
      companySize:
        CompanySizeEnum.ONE_THOUSAND_TO_FOUR_THOUSAND_NINE_HUNDRED_NINETY_NINE,
      yearsExperience: YearsOfExperienceEnum.TEN_TO_NINETEEN,
    },
  ];
}

/**
 * Stubbed function to fetch roles without connecting to firebase.
 *
 * @returns stubbed roles
 */

export function getFilters(
  filterType: string,
  limitByMembers?: boolean,
  approvedMemberIds?: string[]
): Filter[] {
  return [
    {
      count: 3,
      hasApprovedMembers: true,
      filterType: "focus",
      id: "fakeFocusID01",
      members: ["fakeMemberID01", "fakeMemberID02", "fakeMemberID03"],
      name: "Engineering",
    },
    {
      count: 1,
      hasApprovedMembers: true,
      filterType: "focus",
      id: "fakeFocusID02",
      members: ["fakeMemberID03"],
      name: "Design",
    },
    {
      count: 2,
      id: "fakeIndustryID01",
      filterType: "industry",
      members: ["fakeMemberID02", "fakeMemberID03"],
      name: "Internet / Technology",
    },
    {
      count: 1,
      id: "fakeIndustryID02",
      filterType: "industry",
      members: ["fakeMemberID01"],
      name: "Healthcare",
    },
  ];
}
