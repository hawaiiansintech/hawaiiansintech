import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import CompanyIndustry, {
  CompanyIndustryInitialProps,
} from "@/components/intake-form/CompanyIndustry";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import { getIndustries, MemberPublic } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import lodash from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NEXT_PAGE = "04-contact";

export async function getStaticProps() {
  let industryIndex = (await getIndustries()) ?? [];
  return {
    props: {
      industryIndex: industryIndex,
      pageTitle: "Request Changes · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function JoinStep3({ industryIndex, pageTitle }) {
  const { getItem, setItem } = useStorage();
  const router = useRouter();
  const [userData, setUserData] = useState<MemberPublic>({});
  const [editedData, setEditedData] = useState<MemberPublic>({});

  const removeModifiedFrom = (modified: MemberPublic) => {
    if (modified.industry) delete modified.industry;
    if (modified.companySize) delete modified.companySize;
    if (modified.industrySuggested || modified.industrySuggested === "")
      delete modified.industrySuggested;
  };

  const updateEdited = (data: MemberPublic) => {
    setItem(`editedData`, JSON.stringify(data));
    setEditedData(data);
  };

  useEffect(() => {
    let userData: string = getItem("userData");
    userData = userData ? JSON.parse(userData) : undefined;
    if (userData && typeof userData !== "string") {
      setUserData(userData);
    } else {
      router.push("/edit");
    }

    let modified: string | MemberPublic = getItem("editedData");
    modified = modified ? JSON.parse(modified) : {};
    if (modified && typeof modified !== "string") {
      removeModifiedFrom(modified);
      updateEdited(modified);
    }
  }, []);

  const handleSubmit = (values: CompanyIndustryInitialProps) => {
    let modified: MemberPublic = editedData || {};
    removeModifiedFrom(modified);

    if (
      !lodash.isEqual(
        values.industry,
        userData?.industry?.map((foc) => foc.id)
      )
    ) {
      modified.industry = values.industry;
    }
    if (values.companySize !== userData.companySize) {
      modified.companySize = values.companySize;
    }
    if (values.companySize === "") {
      modified.companySize = "N/A";
    }
    if (values.industrySuggested) {
      modified.industrySuggested = values.industrySuggested;
    }

    if (modified && modified !== {}) updateEdited(modified);

    setTimeout(() => {
      router.push({ pathname: FORM_LINKS[3] });
    }, 500);
  };
  return (
    <>
      <Head>
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="02-work" />
      <Heading>Requesting changes for {userData?.name}</Heading>
      <CompanyIndustry
        initial={{
          industryDeferred: userData?.industryDeferred,
          industry: userData?.industry
            ? userData?.industry.map((ind) => ind.id)
            : [],
          companySize: userData?.companySize || "",
        }}
        industryIndex={industryIndex}
        onSubmit={handleSubmit}
        showNew
      />
      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={3} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
