import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import CompanyIndustry, {
  CompanyIndustryInitialProps,
} from "@/components/intake-form/CompanyIndustry";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav";
import { getIndustries, MemberPublicEditing } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import lodash from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NEXT_PAGE = "04-contact";

export async function getStaticProps() {
  let industries = (await getIndustries()) ?? [];
  return {
    props: {
      industries: industries,
    },
    revalidate: 60,
  };
}

export default function JoinStep3({ industries }) {
  const { getItem, setItem } = useStorage();
  const router = useRouter();
  const [userData, setUserData] = useState<MemberPublicEditing>({});
  const [editedData, setEditedData] = useState<MemberPublicEditing>({});

  const removeModifiedFrom = (modified: MemberPublicEditing) => {
    if (modified.industry) delete modified.industry;
    if (modified.companySize) delete modified.companySize;
    if (modified.industrySuggested || modified.industrySuggested === "")
      delete modified.industrySuggested;
  };

  const updateEdited = (data: MemberPublicEditing) => {
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

    let modified: string | MemberPublicEditing = getItem("editedData");
    modified = modified ? JSON.parse(modified) : {};
    if (modified && typeof modified !== "string") {
      removeModifiedFrom(modified);
      updateEdited(modified);
    }
  }, []);

  const handleSubmit = (values: CompanyIndustryInitialProps) => {
    let modified: MemberPublicEditing = editedData || {};
    removeModifiedFrom(modified);

    if (
      !lodash.isEqual(
        values.industriesSelected,
        userData?.industry?.map((foc) => foc.id)
      )
    ) {
      modified.industry = values.industriesSelected;
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
        <title>Hawaiians in Technology | Request Changes</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <Nav backUrl="02-work" />
      <Heading>Requesting changes for {userData?.name}</Heading>
      <CompanyIndustry
        initial={{
          industries: industries,
          deferIndustry: userData?.industry?.length === 0 ? undefined : "true",
          industriesSelected: userData?.industry
            ? userData?.industry.map((ind) => ind.id)
            : [],
          companySize: userData?.companySize || "",
        }}
        onSubmit={handleSubmit}
        showNew
      />
      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={3} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
