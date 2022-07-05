import { ErrorMessageProps } from "@/components/form/ErrorMessage";
import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import CompanyIndustry, {
  CompanyIndustryInitialProps,
} from "@/components/intake-form/CompanyIndustry";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import { getIndustries, MemberPublicEditing } from "@/lib/api";
import { useStorage, useWindowWidth } from "@/lib/hooks";
import { FORM_LINKS, useInvalid } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import { scrollToTop } from "../../helpers";

export async function getStaticProps() {
  let industryIndex = (await getIndustries()) ?? [];
  return {
    props: {
      industryIndex: industryIndex,
      pageTitle: "Join · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

const MAX_COUNT = 3;
const TECHNOLOGY_LABEL = "Internet / Technology";

export default function JoinStep3({ industryIndex, pageTitle }) {
  const { getItem, setItem, removeItem } = useStorage();
  const router = useRouter();
  const width = useWindowWidth();

  const [data, setData] = useState<MemberPublicEditing>({});

  const [companySize, setCompanySize] = useState<string>();
  const [industrySuggested, setIndustrySuggested] = useState("");
  const [deferIndustry, setDeferIndustry] = useState<"true">();
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [columnCount, setColumnCount] = useState<2 | 3>(3);

  const totalIndustriesSelected =
    industriesSelected.length + (industrySuggested ? 1 : 0);
  const isMaxSelected = totalIndustriesSelected >= MAX_COUNT;

  let technologyInd =
    industryIndex.find((item) => item.name === TECHNOLOGY_LABEL) || null;
  if (technologyInd) {
    industryIndex = [
      ...industryIndex.filter((item) => item.name !== TECHNOLOGY_LABEL),
    ];
  }

  // check invalid situation via previous required entries
  useInvalid({ currentPage: "03-company" });

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let joinData: string = getItem("joinData");
    joinData = joinData ? JSON.parse(joinData) : undefined;
    if (!joinData || typeof joinData === "string") return;
    setData(joinData);
  }, []);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  useEffect(() => {
    let mql = window.matchMedia(
      `(min-width: ${theme.layout.breakPoints.small})`
    );
    if (mql.matches) {
      setColumnCount(3);
    } else {
      setColumnCount(2);
    }
  }, [width]);

  const handleSelect = (industry) => {
    let nextIndustriesSelected = [...industriesSelected];
    const isSelected = industriesSelected.includes(industry);

    if (isSelected) {
      const index = industriesSelected.indexOf(industry);
      nextIndustriesSelected.splice(index, 1);
    } else if (industriesSelected.length < MAX_COUNT) {
      nextIndustriesSelected.push(industry);
    }
    setIndustriesSelected(nextIndustriesSelected);
  };

  const handleSubmit = (values: CompanyIndustryInitialProps) => {
    setLoading(true);
    let newData = data;
    if (values.industry) {
      newData.industry = values.industry;
    }
    if (values.industrySuggested) {
      newData.industrySuggested = values.industrySuggested;
    }
    if (values.companySize) {
      newData.companySize = values.companySize;
    }
    setItem("joinData", JSON.stringify(newData));

    router.push({ pathname: FORM_LINKS[3] });
  };
  return (
    <>
      <Head>
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="02-work" />

      <Heading>Welcome to our little hui.</Heading>

      <CompanyIndustry
        initial={{
          industryDeferred: data?.industry?.length > 0,
          industry: data?.industry ? data?.industry.map((ind) => ind.id) : [],
          companySize: data?.companySize || "",
        }}
        industryIndex={industryIndex}
        onSubmit={handleSubmit}
      />

      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={3} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
