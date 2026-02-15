import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import WorkExperience, {
  WorkExperienceInitialProps,
} from "@/components/intake-form/WorkExperience";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import { getFilters } from "@/lib/firebase-helpers/filters";
import { FirebaseTablesEnum } from "@/lib/enums";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS, useInvalid } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticProps() {
  const focuses = (await getFilters(FirebaseTablesEnum.FOCUSES)) ?? [];
  return {
    props: {
      focuses: focuses.sort((a, b) => b.count - a.count),
      pageTitle: "Join · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function JoinStep2({ focuses, pageTitle }) {
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
    const storedFocuses = getItem("jfFocuses");
    const storedFocusSuggested = getItem("jfFocusSuggested");
    const storedTitle = getItem("jfTitle");
    const storedDeferTitle = getItem("jfDeferTitle");
    const storedYearsExperience = getItem("jfYearsExperience");
    if (storedFocuses) {
      const match = focuses
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
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backLinkTo="01-you" variant="minimized" />

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

      <div className="mt-6 pb-12">
        <ProgressBar currentCount={2} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
