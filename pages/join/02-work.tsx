import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import WorkExperience, {
  WorkExperienceInitialProps,
} from "@/components/intake-form/WorkExperience";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import { getFocuses } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS, useInvalid } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Member } from "../api/create-member";

export async function getStaticProps() {
  let focuses = (await getFocuses()) ?? [];
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

  const [data, setData] = useState<Member>();

  // check invalid situation via previous required entries
  useInvalid({ currentPage: "02-work" });

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let joinData = getItem("joinData");
    joinData = joinData ? JSON.parse(joinData) : undefined;
    if (!joinData || typeof joinData === "string") return;
    setData(joinData);
  }, []);

  const handleSubmit = (values: WorkExperienceInitialProps) => {
    let newData = data;
    if (values.title) {
      newData.title = values.title;
    }
    if (values.focusesSelected) {
      newData.focusesSelected = values.focusesSelected;
    }
    if (values.focusSuggested) {
      newData.focusSuggested = values.focusSuggested;
    }
    if (values.yearsExperience) {
      newData.yearsExperience = values.yearsExperience;
    }
    setItem("joinData", JSON.stringify(newData));
    router.push({ pathname: FORM_LINKS[2] });
  };

  return (
    <>
      <Head>
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="01-you" />

      <Heading>Welcome to our little hui.</Heading>

      <WorkExperience
        initial={{
          focuses: focuses,
          focusesSelected: data?.focusesSelected || [],
          focusSuggested: data?.focusSuggested || "",
          title: data?.title || "",
          yearsExperience: data?.yearsExperience || "",
        }}
        onSubmit={handleSubmit}
      />

      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={2} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
