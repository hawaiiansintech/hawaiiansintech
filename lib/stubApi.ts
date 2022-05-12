import { Focus, Industry, MemberPublic } from "./api";
export type { Focus, Industry, MemberPublic };

/**
 * Stubbed function to simulate fetching technologists
 * without connecting to airtable.
 *
 * @returns stubbed values
 */

interface MemberPublicDupe {
  name?: string;
  companySize?: string;
  emailAbbr?: string[];
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

export function getMembers(): MemberPublic[] {
  return [
    {
      id: "fakeMemberID01",
      name: "Andrew Taeoalii",
      location: "Hilo",
      region: "Hawaiʻi",
      emailAbbr: ["a", "w", "@hawaiiansintech.org"],
      title: "Engineering Manager",
      link: "https://linkedin.com/in/andrewtaeoalii",
      focus: [{ name: "Engineering", id: "fakeFocusID01" }],
      industry: [{ name: "Internet / Technology", id: "fakeIndustryID01" }],
      companySize: "5000 – 1000",
      yearsExperience: "10 – 19 years",
    },
    {
      id: "fakeMemberID02",
      name: "Emmit Kamakani Parubrub",
      location: "San Francisco Bay Area",
      region: "California",
      title: "Software Engineer in Test II",
      link: "https://www.linkedin.com/in/emmit-parubrub/",
      emailAbbr: ["k", "i", "@hawaiiansintech.org"],
      focus: [{ name: "Engineering", id: "fakeFocusID01" }],
      industry: [{ name: "Healthcare", id: "fakeIndustryID02" }],
      companySize: "1000 – 4999",
      yearsExperience: "3 – 4 years",
    },
    {
      id: "fakeMemberID03",
      name: "Taylor Ho",
      location: "San Francisco",
      region: "California",
      title: "Principal UX/UI Designer",
      link: "https://linkedin.com/in/taylorho",
      emailAbbr: ["k", "i", "@hawaiiansintech.org"],
      focus: [
        { name: "Engineering", id: "fakeFocusID01" },
        { name: "Design", id: "fakeFocusID02" },
      ],
      industry: [{ name: "Internet / Technology", id: "fakeIndustryID01" }],
      companySize: "1000 – 4999",
      yearsExperience: "10 – 19 years",
    },
  ];
}

/**
 * Stubbed function to fetch roles without connecting to airtable.
 *
 * @returns stubbed roles
 */

export function getFocuses(limitByMembers?: boolean): Focus[] {
  return [
    {
      count: 3,
      hasApprovedMembers: true,
      id: "fakeFocusID01",
      members: ["fakeMemberID01", "fakeMemberID02", "fakeMemberID03"],
      name: "Engineering",
    },
    {
      count: 1,
      hasApprovedMembers: true,
      id: "fakeFocusID02",
      members: ["fakeMemberID03"],
      name: "Design",
    },
  ];
}

/**
 * Stubbed function to fetch roles without connecting to airtable.
 *
 * @returns stubbed roles
 */

export function getIndustries(): Industry[] {
  return [
    {
      count: 2,
      id: "fakeIndustryID01",
      members: ["fakeMemberID02", "fakeMemberID03"],
      name: "Internet / Technology",
    },
    {
      count: 1,
      id: "fakeIndustryID02",
      members: ["fakeMemberID01"],
      name: "Healthcare",
    },
  ];
}
