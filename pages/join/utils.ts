import { useStorage } from "@/lib/hooks";
import { useEffect } from "react";

export const joinFormMap = [`01-you`, `02-work`, `03-company`];

const ALL_STORED_FIELDS = [
  "jfName",
  "jfLocation",
  "jfWebsite",
  "jfFocuses",
  "jfFocusSuggested",
  "jfTitle",
  "jfDeferTitle",
  "jfYearsExperience",
  "jfIndustries",
  "jfDeferIndustry",
  "jfIndustrySuggested",
  "jfCompanySize",
];

export const clearAllStoredFields = () => {
  const { removeItem } = useStorage();
  ALL_STORED_FIELDS.map((item) => removeItem(item));
};

export const fasd = () => {
  const { getItem } = useStorage();
  useEffect(() => {
    let storedName = getItem("jfName");
    let storedLocation = getItem("jfLocation");
    let storedWebsite = getItem("jfWebsite");
    // if (storedName) setName(storedName);
    // if (storedLocation) setLocation(storedLocation);
    // if (storedWebsite) setWebsite(storedWebsite);
  }, []);
};
