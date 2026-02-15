import { Filter, MemberPublic } from "./interfaces";
import { CompanySizeEnum, YearsOfExperienceEnum, StatusEnum } from "../enums";
export type { MemberPublic };

/**
 * Stubbed function to simulate fetching technologists
 * without connecting to firebase.
 * Generates anonymized, on-the-fly mock data that matches
 * the real getMembers function structure.
 *
 * @param count - Number of mock members to generate (default: 50)
 * @param seed - Seed for consistent randomization (default: 12345)
 * @returns Generated mock member data
 */

import MOCK_FIRST_NAMES from "./mock-data/first-names.json";
import MOCK_LAST_NAMES from "./mock-data/last-names.json";
import MOCK_TITLES from "./mock-data/titles.json";
import MOCK_FOCUSES from "./mock-data/focuses.json";
import MOCK_INDUSTRIES from "./mock-data/industries.json";
import REGIONS_LOCATIONS from "./mock-data/regions_locations.json";

// Simple seeded random number generator for consistent results
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  choices<T>(array: T[], count: number): T[] {
    const result: T[] = [];
    const used = new Set<number>();

    while (result.length < count && used.size < array.length) {
      const index = this.nextInt(0, array.length - 1);
      if (!used.has(index)) {
        used.add(index);
        result.push(array[index]);
      }
    }

    return result;
  }
}

export function mockGetMembers(
  count: number = 50,
  seed: number = 12345,
): MemberPublic[] {
  const rng = new SeededRandom(seed);
  const members: MemberPublic[] = [];

  const companySizes = Object.values(CompanySizeEnum);
  const yearsExperience = Object.values(YearsOfExperienceEnum);

  // Get available regions from the regions_locations mapping
  const availableRegions = Object.keys(REGIONS_LOCATIONS);

  for (let i = 0; i < count; i++) {
    const firstName = rng.choice(MOCK_FIRST_NAMES);
    const lastName = rng.choice(MOCK_LAST_NAMES);
    const name = `${firstName} ${lastName}`;

    // Select a region first, then pick a location from that region
    const region = rng.choice(availableRegions);
    const locationsInRegion =
      REGIONS_LOCATIONS[region as keyof typeof REGIONS_LOCATIONS];
    const location = rng.choice(locationsInRegion);

    // Generate email abbreviation based on name
    const firstInitial = firstName.charAt(0).toLowerCase();
    const lastInitial = lastName.charAt(0).toLowerCase();
    const emailAbbr = `${firstInitial}...${lastInitial}@hawaiiansintech.org`;

    // Generate member ID for consistent linking
    const memberId = `mock_member_${String(i + 1).padStart(3, "0")}`;

    // Generate local mock profile URL instead of LinkedIn
    const link = `/dev-mock-user/${memberId}`;

    // Select 1-3 focus areas
    const focusCount = rng.nextInt(1, 3);
    const focus = rng.choices(MOCK_FOCUSES, focusCount);

    // Select 1-2 industries
    const industryCount = rng.nextInt(1, 2);
    const industry = rng.choices(MOCK_INDUSTRIES, industryCount);

    // Select experience level (ensure consistency between experience array and yearsExperience)
    const selectedExperience = rng.choice(yearsExperience);

    const member: MemberPublic = {
      id: memberId,
      name,
      location,
      region, // Keep the singular region for backward compatibility
      regions: [
        {
          name: region,
          id: `region_${region.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        },
      ],
      emailAbbr,
      title: rng.choice(MOCK_TITLES),
      link,
      focus,
      industry,
      experience: [
        {
          name: selectedExperience,
          id: `experience_${selectedExperience
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")}`,
        },
      ],
      companySize: rng.choice(companySizes),
      yearsExperience: selectedExperience,
      status: StatusEnum.APPROVED,
      unsubscribed: false,
    };

    members.push(member);
  }

  // Sort by name to match real getMembers behavior
  return members.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

/**
 * Stubbed function to fetch filters without connecting to firebase.
 * Generates dynamic filter data that corresponds to the mock members.
 *
 * @param filterType - Type of filter (focus, industry, region, experience)
 * @param limitByMembers - Whether to limit filters to those with members
 * @param approvedMemberIds - Array of approved member IDs
 * @returns Generated filter data
 */
export function getFilters(
  filterType: string,
  limitByMembers?: boolean,
  approvedMemberIds?: string[],
): Filter[] {
  // Generate mock members to calculate filter counts
  const mockMembers = mockGetMembers(50);
  const filters: Filter[] = [];

  switch (filterType.toLowerCase()) {
    case "focus":
    case "focuses":
      MOCK_FOCUSES.forEach((focus) => {
        const memberIds = mockMembers
          .filter(
            (member) =>
              Array.isArray(member.focus) &&
              member.focus.some(
                (f) => typeof f === "object" && f.id === focus.id,
              ),
          )
          .map((member) => member.id!)
          .filter(Boolean);

        if (!limitByMembers || memberIds.length > 0) {
          filters.push({
            id: focus.id,
            name: focus.name,
            filterType: "focus",
            members: memberIds,
            count: memberIds.length,
            hasApprovedMembers: memberIds.length > 0,
          });
        }
      });
      break;

    case "industry":
    case "industries":
      MOCK_INDUSTRIES.forEach((industry) => {
        const memberIds = mockMembers
          .filter(
            (member) =>
              Array.isArray(member.industry) &&
              member.industry.some(
                (i) => typeof i === "object" && i.id === industry.id,
              ),
          )
          .map((member) => member.id!)
          .filter(Boolean);

        if (!limitByMembers || memberIds.length > 0) {
          filters.push({
            id: industry.id,
            name: industry.name,
            filterType: "industry",
            members: memberIds,
            count: memberIds.length,
            hasApprovedMembers: memberIds.length > 0,
          });
        }
      });
      break;

    case "region":
    case "regions":
      const uniqueRegions = Array.from(
        new Set(mockMembers.map((m) => m.region).filter(Boolean)),
      );
      uniqueRegions.forEach((regionName) => {
        const memberIds = mockMembers
          .filter((member) => member.region === regionName)
          .map((member) => member.id!)
          .filter(Boolean);

        if (!limitByMembers || memberIds.length > 0) {
          filters.push({
            id: `region_${regionName?.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
            name: regionName!,
            filterType: "region",
            members: memberIds,
            count: memberIds.length,
            hasApprovedMembers: memberIds.length > 0,
          });
        }
      });
      break;

    case "experience":
      const uniqueExperience = Array.from(
        new Set(mockMembers.map((m) => m.yearsExperience).filter(Boolean)),
      );
      uniqueExperience.forEach((experienceName) => {
        const memberIds = mockMembers
          .filter((member) => member.yearsExperience === experienceName)
          .map((member) => member.id!)
          .filter(Boolean);

        if (!limitByMembers || memberIds.length > 0) {
          filters.push({
            id: `experience_${experienceName?.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
            name: experienceName!,
            filterType: "experience",
            members: memberIds,
            count: memberIds.length,
            hasApprovedMembers: memberIds.length > 0,
          });
        }
      });
      break;

    default:
      // Return all filters if no specific type requested
      return [
        ...getFilters("focus", limitByMembers, approvedMemberIds),
        ...getFilters("industry", limitByMembers, approvedMemberIds),
        ...getFilters("region", limitByMembers, approvedMemberIds),
        ...getFilters("experience", limitByMembers, approvedMemberIds),
      ];
  }

  // Sort by count descending, then by name
  return filters.sort((a, b) => {
    if (b.count !== a.count) {
      return (b.count || 0) - (a.count || 0);
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Helper function to get mock filter data for a specific filter table
 * that corresponds to the generated mock members.
 *
 * @param filterTable - The filter table type (focuses, industries, regions, experience)
 * @param memberCount - Number of mock members to base filters on (default: 50)
 * @param seed - Seed for consistent randomization (default: 12345)
 * @returns Object with members and filter data
 */
export function getMockDataWithFilters(
  filterTable?: string,
  memberCount: number = 50,
  seed: number = 12345,
) {
  const members = mockGetMembers(memberCount, seed);

  if (!filterTable) {
    return {
      members,
      focuses: getFilters("focus"),
      industries: getFilters("industry"),
      regions: getFilters("region"),
      experience: getFilters("experience"),
    };
  }

  const filters = getFilters(filterTable);

  return {
    members,
    [filterTable]: filters,
  };
}

/**
 * Example usage function showing how to use the mock data
 * in a way that matches the real getMembers API response structure.
 *
 * @param options - Options similar to real getMembers function
 * @returns Mock response matching real API structure
 */
export function mockGetMembersWithFilters(
  options: {
    limit?: number;
    includeFilters?: boolean;
    regions?: any[];
    industries?: any[];
    focuses?: any[];
    experience?: any[];
  } = {},
) {
  const {
    limit = 25,
    includeFilters = true,
    regions,
    industries,
    focuses,
    experience,
  } = options;

  const allMembers = mockGetMembers(100); // Generate larger pool
  const members = allMembers.slice(0, limit); // Apply limit

  const result: any = {
    members,
    cursor: members.length > 0 ? members[members.length - 1].id : null, // Mock cursor for pagination
    hasMore: limit < allMembers.length, // Mock hasMore flag
  };

  if (includeFilters) {
    result.focuses = focuses || getFilters("focus");
    result.industries = industries || getFilters("industry");
    result.regions = regions || getFilters("region");
    result.experience = experience || getFilters("experience");
  }

  return result;
}
