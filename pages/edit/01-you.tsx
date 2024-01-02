import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import BasicInformationForm from "@/components/intake-form/BasicInformation";
import LoadingSpinner from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import { MemberPublicEditing } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Request Changes · Hawaiians in Technology",
    },
  };
}

export default function JoinStep1({ pageTitle }) {
  const router = useRouter();
  const { r } = router.query;
  const { getItem, setItem, removeItem } = useStorage();
  const [data, setData] = useState<MemberPublicEditing>();

  useEffect(() => {
    let userData: string = getItem("userData");
    userData = userData ? JSON.parse(userData) : undefined;
    if (!userData) {
      router.push("/edit");
    }
    let storedData = getItem("userData");
    storedData = storedData ? JSON.parse(storedData) : "";
    removeItem("editedData");
    if (!storedData || typeof storedData === "string") return;
    setData(storedData);
  }, []);

  const handleSubmit = (values) => {
    let modified: MemberPublicEditing = {};

    if (values.name !== data.name) modified.name = values.name;
    if (values.location !== `${data.location}, ${data.region}`)
      modified.location = values.location;
    if (values.website !== data.link) modified.link = values.website;

    if (Object.keys(modified).length !== 0) {
      setItem("editedData", JSON.stringify(modified));
    }

    router.push({ pathname: FORM_LINKS[1], query: router.query });
  };

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="/edit" />
      <Heading>Requesting changes for {data.name}</Heading>
      <BasicInformationForm
        initial={{
          name: data.name,
          location: `${data.location}, ${data.region}`,
          website: data.link,
        }}
        onSubmit={handleSubmit}
      />
      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={1} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
