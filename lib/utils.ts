import { useStorage } from "@/lib/hooks";
import { type ClassValue, clsx } from "clsx";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FORM_LINKS = [`01-you`, `02-work`, `03-company`, `04-contact`];

const ALL_STORED_FIELDS = [
  "Name",
  "Location",
  "Website",
  "Focuses",
  "FocusSuggested",
  "Title",
  "DeferTitle",
  "YearsExperience",
  "Industries",
  "DeferIndustry",
  "IndustrySuggested",
  "CompanySize",
  "EmailAbbr",
  "Id",
];

export const useClearAllStoredFields = (): ClearStoredFieldsFunction => {
  const { removeItem } = useStorage();

  return (prefix: string, fields?: string[]) => {
    const fieldsToClear = fields || ALL_STORED_FIELDS;

    // Validate prefix
    if (!prefix || typeof prefix !== "string") {
      console.warn("useClearAllStoredFields: Invalid prefix provided", prefix);
      return;
    }

    // Clear fields with error handling
    fieldsToClear.forEach((item) => {
      try {
        removeItem(`${prefix}${item}`);
      } catch (error) {
        console.error(`Failed to remove storage item ${prefix}${item}:`, error);
      }
    });
  };
};

interface useInvalidProps {
  currentPage: `01-you` | `02-work` | `03-company` | `04-contact`;
}

export const useInvalid = ({ currentPage }: useInvalidProps) => {
  const { getItem } = useStorage();
  const router = useRouter();

  useEffect(() => {
    // Base validation for all pages
    let invalid =
      !getItem("jfName") || !getItem("jfLocation") || !getItem("jfWebsite");

    // Additional validation based on current page
    switch (currentPage) {
      case "02-work":
        if (invalid) {
          router.push({ pathname: "01-you", query: { r: "02" } });
        }
        break;

      case "03-company":
        invalid =
          invalid ||
          !getItem("jfYearsExperience") ||
          ([...JSON.parse(getItem("jfFocuses") || "[]")].length < 1 &&
            !getItem("jfFocusSuggested")) ||
          (!getItem("jfTitle") && !getItem("jfDeferTitle"));

        if (invalid) {
          router.push({ pathname: "01-you", query: { r: "03" } });
        }
        break;

      case "04-contact":
        invalid =
          invalid ||
          !getItem("jfYearsExperience") ||
          ([...JSON.parse(getItem("jfFocuses") || "[]")].length < 1 &&
            !getItem("jfFocusSuggested")) ||
          (!getItem("jfTitle") && !getItem("jfDeferTitle")) ||
          ([...JSON.parse(getItem("jfIndustries") || "[]")].length < 1 &&
            !getItem("jfDeferIndustry") &&
            !getItem("jfIndustrySuggested")) ||
          (!getItem("jfCompanySize") && getItem("jfCompanySize") !== "N/A");

        if (invalid) {
          router.push({ pathname: "01-you", query: { r: "04" } });
        }
        break;
    }
  }, [currentPage, getItem, router]);
};

export const MAX_FOCUS_COUNT = 3;

// Type for the clear function returned by useClearAllStoredFields
export type ClearStoredFieldsFunction = (
  prefix: string,
  fields?: string[],
) => void;

/**
 * Sorts items by their predefined order in a reference array
 *
 * Use case: When you have a complete array to sort (e.g., sorting experience data from Firestore)
 * Data structure: Works with items that have either fields.name (Firestore documents) or name property
 *
 * @param items - Array of items with either fields.name or name property
 * @param referenceOrder - Array of names in the desired order (the "master list")
 * @param nameKey - Optional key to access the name ('fields.name' or 'name'), defaults to 'fields.name'
 * @returns Sorted array of items
 *
 * @example
 * // For Firestore documents (pages/edit/member.tsx, pages/admin/directory.tsx)
 * sortByOrder(data.experience || [], experienceOrder)
 *
 * // For objects with direct name property
 * sortByOrder(filterItems, experienceOrder, "name")
 */
export function sortByOrder<T extends { [key: string]: any }>(
  items: T[],
  referenceOrder: string[],
  nameKey: "fields.name" | "name" = "fields.name",
): T[] {
  return items
    .filter((item) => {
      if (nameKey === "fields.name") {
        return item && item.fields && item.fields.name;
      } else {
        return item && item.name;
      }
    })
    .sort((a, b) => {
      const aName = nameKey === "fields.name" ? a.fields.name : a.name;
      const bName = nameKey === "fields.name" ? b.fields.name : b.name;
      const aIndex = referenceOrder.indexOf(aName);
      const bIndex = referenceOrder.indexOf(bName);

      // Handle cases where names are not found in the reference order array
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1; // Put undefined names at the end
      if (bIndex === -1) return -1; // Put undefined names at the end

      return aIndex - bIndex;
    });
}

/**
 * Compares two items by their position in a reference order array
 *
 * Use case: Inside .sort() callbacks to compare two items (e.g., sorting filter options)
 * Data structure: Works with items that have either fields.name or name property
 *
 * @param a - First item to compare
 * @param b - Second item to compare
 * @param referenceOrder - Array defining the desired order
 * @param nameKey - Key to access the name ('fields.name' or 'name'), defaults to 'name'
 * @returns -1 if a comes before b, 1 if b comes before a, 0 if equal
 *
 * @example
 * // For filter objects in sort callbacks (components/filters/FilterPicker.tsx)
 * .sort((a, b) => {
 *   if (experienceActive) {
 *     return compareByOrder(a, b, experienceOrder, "name");
 *   } else {
 *     return (b.count || 0) - (a.count || 0);
 *   }
 * })
 */
export function compareByOrder<T extends { [key: string]: any }>(
  a: T,
  b: T,
  referenceOrder: string[],
  nameKey: "fields.name" | "name" = "name",
): number {
  const aName = nameKey === "fields.name" ? a.fields.name : a.name;
  const bName = nameKey === "fields.name" ? b.fields.name : b.name;
  const aIndex = referenceOrder.indexOf(aName);
  const bIndex = referenceOrder.indexOf(bName);

  // Handle cases where names are not found in the reference order array
  if (aIndex === -1 && bIndex === -1) return 0;
  if (aIndex === -1) return 1; // Put undefined names at the end
  if (bIndex === -1) return -1; // Put undefined names at the end

  return aIndex - bIndex;
}
