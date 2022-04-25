import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import JoinHeader from "@/components/intake-form/JoinHeader";
import WorkExperience, {
  WorkExperienceInitialProps,
} from "@/components/intake-form/WorkExperience";
import MetaTags from "@/components/Metatags.js";
import { getFocuses } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS, useInvalid } from "@/lib/utils";
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

  const [focusesSelected, setFocusesSelected] = useState<string[]>([]);
  const [focusSuggested, setFocusSuggested] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [deferTitle, setDeferTitle] = useState<"true">();
  const [yearsExperience, setYearsExperience] = useState<string>();

  // check invalid situation via previous required entries
  useInvalid({ currentPage: "02-work" });

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedFocuses = getItem("jfFocuses");
    let storedFocusSuggested = getItem("jfFocusSuggested");
    let storedTitle = getItem("jfTitle");
    let storedDeferTitle = getItem("jfDeferTitle");
    let storedYearsExperience = getItem("jfYearsExperience");
    if (storedFocuses) {
      let match = focuses
        .filter((foc) => JSON.parse(storedFocuses).includes(foc.id))
        .map((foc) => foc.id);
      setFocusesSelected(match);
    }
    if (storedFocusSuggested) setFocusSuggested(storedFocusSuggested);
    if (storedDeferTitle) {
      setTitle("");
      setDeferTitle("true");
    }
    if (storedDeferTitle !== "true" && storedTitle) setTitle(storedTitle);
    if (storedYearsExperience) setYearsExperience(storedYearsExperience);
  }, []);

  const handleSubmit = (values: WorkExperienceInitialProps) => {
    // Clear pre-existing data
    removeItem("jfFocuses");
    removeItem("jfFocusSuggested");
    removeItem("jfTitle");
    removeItem("jfDeferTitle");
    removeItem("jfYearsExperience");
    // Set as stringified array
    if (values.focusesSelected)
      setItem("jfFocuses", JSON.stringify(values.focusesSelected));
    if (values.focusSuggested)
      setItem("jfFocusSuggested", values.focusSuggested);
    if (values.deferTitle || !values.title) {
      setItem("jfDeferTitle", "true");
    }
    if (values.title) setItem("jfTitle", values.title);
    if (values.yearsExperience)
      setItem("jfYearsExperience", values.yearsExperience);
    router.push({ pathname: FORM_LINKS[2] });
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
          headline="Public"
          label="Talent Profile (1/2)"
          currentCount={2}
          totalCount={4}
        />
      </JoinHeader>
      <div className="container">
        <Heading>Welcome to our little hui.</Heading>

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
