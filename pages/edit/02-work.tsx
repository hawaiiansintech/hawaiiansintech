import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import JoinHeader from "@/components/intake-form/JoinHeader";
import WorkExperience, {
  WorkExperienceInitialProps,
} from "@/components/intake-form/WorkExperience";
import MetaTags from "@/components/Metatags.js";
import { getFocuses, MemberPublicEditing } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import lodash from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticProps() {
  let focuses = (await getFocuses()) ?? [];
  return {
    props: {
      focuses: focuses.sort((a, b) => b.count - a.count),
    },
    revalidate: 60,
  };
}

export default function JoinStep2({ focuses }) {
  const router = useRouter();
  const { getItem, setItem, removeItem } = useStorage();
  const [userData, setUserData] = useState<MemberPublicEditing>({});
  const [editedData, setEditedData] = useState<MemberPublicEditing>({});

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
      if (modified.focus) delete modified.focus;
      if (modified.focusSuggested) delete modified.focusSuggested;
      if (modified.yearsExperience) delete modified.yearsExperience;
      if (modified.title || modified.title === "") delete modified.title;
      updateEdited(modified);
    }
  }, []);

  useEffect(() => {
    if (!editedData) return;
    // setItem(`editedData-${new Date()}`, JSON.stringify(editedData));
  }, [editedData]);

  const handleSubmit = (values: WorkExperienceInitialProps) => {
    let modified: MemberPublicEditing = editedData || {};
    if (modified.focus) delete modified.focus;
    if (modified.focusSuggested) delete modified.focusSuggested;
    if (modified.yearsExperience) delete modified.yearsExperience;
    if (modified.title || modified.title === "") delete modified.title;

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
    if (values.deferTitle) modified.title = "";
    if (values.focusSuggested) modified.focusSuggested = values.focusSuggested;

    if (modified && modified !== {}) updateEdited(modified);
    router.push({ pathname: FORM_LINKS[2], query: router.query });
  };

  if (!userData) return <></>;

  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader>
        <ProgressBar
          headline="REQUESTING CHANGES (2/2)"
          label="Work Experience"
          currentCount={2}
          totalCount={2}
        />
      </JoinHeader>
      <div className="container">
        <Heading>Requesting changes for {userData.name}</Heading>
        <WorkExperience
          initial={{
            focuses: focuses || [],
            focusesSelected: userData?.focus?.map((foc) => foc.id) || [],
            focusSuggested: editedData?.focusSuggested || "",
            title: userData?.title || "",
            deferTitle: userData?.title ? undefined : "true",
            yearsExperience: userData?.yearsExperience || "",
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}