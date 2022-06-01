import { useStorage } from "@/lib/hooks";
import { Member } from "@/pages/api/create-member";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

export const clearAllStoredFields = (prefix: string) => {
  const { removeItem } = useStorage();
  ALL_STORED_FIELDS.map((item) => removeItem(`${prefix}${item}`));
};

interface useInvalidProps {
  currentPage: `01-you` | `02-work` | `03-company` | `04-contact`;
}

export const useInvalid = ({ currentPage }: useInvalidProps) => {
  const { getItem } = useStorage();
  const router = useRouter();

  let joinData: string | Member = getItem("joinData");
  joinData = joinData ? JSON.parse(joinData) : undefined;
  if (!joinData || typeof joinData === "string") return;

  let invalid = !joinData.name || !joinData.location || !joinData.website;
  switch (currentPage) {
    case `02-work`:
      return useEffect(() => {
        if (invalid) {
          router.push({ pathname: "01-you", query: { r: "02" } });
        }
      }, []);
    case `03-company`:
      invalid =
        invalid ||
        !joinData.yearsExperience ||
        (joinData.focusesSelected.length < 1 && !joinData.focusSuggested);
      return useEffect(() => {
        if (invalid) router.push({ pathname: "01-you", query: { r: "03" } });
      }, []);
    case `04-contact`:
      invalid =
        invalid ||
        !joinData.yearsExperience ||
        (joinData.focusesSelected.length < 1 && !joinData.focusSuggested) ||
        (joinData.industriesSelected.length < 1 &&
          !joinData.industrySuggested) ||
        !joinData.companySize;
      return useEffect(() => {
        // (!getItem("jfCompanySize") && getItem("jfCompanySize") !== "N/A");
        if (invalid) router.push({ pathname: "01-you", query: { r: "04" } });
      }, []);
  }
};

export const MAX_FOCUS_COUNT = 3;
