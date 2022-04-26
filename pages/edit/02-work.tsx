import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import JoinHeader from "@/components/intake-form/JoinHeader";
import WorkExperience, {
  WorkExperienceInitialProps,
} from "@/components/intake-form/WorkExperience";
import MetaTags from "@/components/Metatags.js";
import { getFocuses } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
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

  const [name, setName] = useState<string>("");
  const [focusesSelected, setFocusesSelected] = useState<string[]>([]);
  const [focusSuggested, setFocusSuggested] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [deferTitle, setDeferTitle] = useState<"true">();
  const [yearsExperience, setYearsExperience] = useState<string>();

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedName = getItem("editName");
    let updatedName = getItem("newName");
    let storedFocuses = getItem("editFocuses");
    let updatedFocuses = getItem("newFocuses");
    let storedFocusSuggested = getItem("editFocusSuggested");
    let updatedFocusSuggested = getItem("newFocusSuggested");
    let storedTitle = getItem("editTitle");
    let updatedTitle = getItem("newTitle");
    let storedDeferTitle = getItem("editDeferTitle");
    let updatedDeferTitle = getItem("newDeferTitle");
    let storedYearsExperience = getItem("editYearsExperience");
    let updatedYearsExperience = getItem("newYearsExperience");
    if (updatedFocuses || storedFocuses) {
      let match = focuses
        .filter((foc) =>
          JSON.parse(updatedFocuses || storedFocuses).includes(foc.id)
        )
        .map((foc) => foc.id);
      setFocusesSelected(match);
    }
    if (updatedName || storedName) setName(updatedName || storedName);
    if (updatedFocusSuggested || storedFocusSuggested)
      setFocusSuggested(updatedFocusSuggested || storedFocusSuggested);
    if (updatedDeferTitle || storedDeferTitle) {
      setTitle("");
      setDeferTitle("true");
    }
    if (
      !updatedDeferTitle &&
      !storedDeferTitle &&
      (updatedTitle || storedTitle)
    )
      setTitle(updatedTitle || storedTitle);
    if (updatedYearsExperience || storedYearsExperience)
      setYearsExperience(updatedYearsExperience || storedYearsExperience);
  }, []);

  const handleSubmit = (values: WorkExperienceInitialProps) => {
    // Clear pre-existing data
    removeItem("newFocuses");
    removeItem("newFocusSuggested");
    removeItem("newTitle");
    removeItem("newDeferTitle");
    removeItem("newYearsExperience");
    // Set as stringified array
    if (getItem("editFocuses") !== JSON.stringify(values.focusesSelected))
      setItem("newFocuses", JSON.stringify(values.focusesSelected));
    if (
      getItem("editFocusSuggested") !== values.focusSuggested &&
      values.focusSuggested
    )
      setItem("newFocusSuggested", values.focusSuggested);
    if (getItem("editDeferTitle") !== values.deferTitle || !values.title) {
      setItem("newDeferTitle", "true");
    }
    if (getItem("editTitle") !== values.title)
      setItem("newTitle", values.title);
    if (getItem("editYearsExperience") !== values.yearsExperience)
      setItem("newYearsExperience", values.yearsExperience);
    router.push({ pathname: FORM_LINKS[2], query: router.query });
  };

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
        <Heading>Requesting changes for {name}</Heading>
        <WorkExperience
          initial={{
            focuses: focuses,
            focusesSelected: focusesSelected,
            focusSuggested: focusSuggested,
            title: title,
            deferTitle: deferTitle,
            yearsExperience: yearsExperience,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
