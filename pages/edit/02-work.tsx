import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import WorkExperience, {
  WorkExperienceInitialProps,
} from "@/components/intake-form/WorkExperience";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import { getFilters, MemberPublicEditing } from "@/lib/api";
import { FirebaseTablesEnum } from "@/lib/enums";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import lodash from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticProps() {
  let focuses = (await getFilters(FirebaseTablesEnum.FOCUSES)) ?? [];
  return {
    props: {
      focuses: focuses,
      pageTitle: "Request Changes · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function JoinStep2({ focuses, pageTitle }) {
  const router = useRouter();
  const { getItem, setItem } = useStorage();
  const [userData, setUserData] = useState<MemberPublicEditing>({});
  const [editedData, setEditedData] = useState<MemberPublicEditing>({});

  const removeModifiedFrom = (modified: MemberPublicEditing) => {
    if (modified.focus) delete modified.focus;
    if (modified.focusSuggested || modified.focusSuggested === "")
      delete modified.focusSuggested;
    if (modified.yearsExperience) delete modified.yearsExperience;
    if (modified.title || modified.title === "") delete modified.title;
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

  const handleSubmit = (values: WorkExperienceInitialProps) => {
    let modified: MemberPublicEditing = editedData || {};
    removeModifiedFrom(modified);

    if (
      !lodash.isEqual(
        values.focusesSelected,
        userData?.focus?.map((foc) => foc.id)
      )
    ) {
      modified.focus = values.focusesSelected;
    }
    if (values.yearsExperience !== userData.yearsExperience) {
      modified.yearsExperience = values.yearsExperience;
    }
    if (values.title !== userData.title) {
      modified.title = values.title;
    }
    if (editedData.title === "") {
      modified.title = values.title;
    }
    if (values.focusSuggested && values.focusSuggested !== "") {
      modified.focusSuggested = values.focusSuggested;
    }
    if (values.deferTitle) modified.title = "";

    if (modified && Object.keys(modified).length !== 0) updateEdited(modified);
    router.push({ pathname: FORM_LINKS[2], query: router.query });
  };

  if (!userData) return <></>;

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="01-you" />
      <Heading>Requesting changes for {userData.name}</Heading>
      <WorkExperience
        initial={{
          focuses: focuses || [],
          focusesSelected: userData?.focus?.map((foc) => foc.id) || [],
          focusSuggested: editedData?.focusSuggested || undefined,
          title: userData?.title || "",
          deferTitle: userData?.title ? undefined : "true",
          yearsExperience: userData?.yearsExperience || "",
        }}
        onSubmit={handleSubmit}
        showNew
      />
      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={2} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
