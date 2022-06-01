import ProgressBar from "@/components/form/ProgressBar";
import { Heading, Subheading } from "@/components/Heading";
import BasicInformationForm from "@/components/intake-form/BasicInformation";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import { useStorage } from "@/lib/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Member } from "../api/create-member";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Join · Hawaiians in Technology",
    },
  };
}

export default function JoinStep1({ pageTitle }) {
  const router = useRouter();
  const { r, edit } = router.query;
  const { getItem, setItem, removeItem } = useStorage();
  const [data, setData] = useState<Member>();

  useEffect(() => {
    let joinData = getItem("joinData");
    joinData = joinData ? JSON.parse(joinData) : undefined;
    if (!joinData || typeof joinData === "string") return;
    setData(joinData);
  }, []);

  // clear fields if param `r` is present
  useEffect(() => {
    if (!r) return;
    setData(undefined);
    removeItem("joinData");
    if (typeof window !== "undefined")
      window.history.replaceState(null, "", "/join/01-you");
  }, [r]);

  const handleSubmit = (values: {
    name: string;
    location: string;
    website: string;
  }) => {
    setItem(
      "joinData",
      JSON.stringify({
        ...data,
        name: values.name,
        location: values.location,
        website: values.website,
      })
    );

    router.push({ pathname: `02-work` });
  };

  const handleReset = () => {
    setData(undefined);
    removeItem("joinData");
  };

  return (
    <>
      <Head>
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="/" />

      <Heading>Welcome to our little hui.</Heading>
      <Subheading centered>
        To join the directory, we just ask that you are{" "}
        <strong>Native Hawaiian</strong> and work in the{" "}
        <strong>field / industry of technology</strong>.
      </Subheading>
      <BasicInformationForm
        initial={{
          name: data?.name || "",
          location: data?.location || "",
          website: data?.website || "",
        }}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={1} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
