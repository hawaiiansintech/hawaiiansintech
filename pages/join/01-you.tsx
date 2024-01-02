import ProgressBar from "@/components/form/ProgressBar";
import { Heading, Subheading } from "@/components/Heading";
import BasicInformationForm from "@/components/intake-form/BasicInformation";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import { useStorage } from "@/lib/hooks";
import { clearAllStoredFields } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const { getItem, setItem } = useStorage();
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // clear fields if param `r` is present
  useEffect(() => {
    if (!r) return;

    clearAllStoredFields("jf");
    setName("");
    setLocation("");
    setWebsite("");
    if (typeof window !== "undefined")
      window.history.replaceState(null, "", "/join/01-you");
  }, [r]);

  useEffect(() => {
    let storedName = getItem("jfName");
    let storedLocation = getItem("jfLocation");
    let storedWebsite = getItem("jfWebsite");
    if (storedName) setName(storedName);
    if (storedLocation) setLocation(storedLocation);
    if (storedWebsite) setWebsite(storedWebsite);
  }, []);

  const handleToggle = () => {
    router.push({ pathname: `/edit` });
  };

  const handleSubmit = (values) => {
    setItem("jfName", values.name);
    setItem("jfLocation", values.location);
    setItem("jfWebsite", values.website);
    router.push({ pathname: `02-work` });
  };

  const handleReset = () => {
    setName("");
    setLocation("");
    setWebsite("");
    clearAllStoredFields("jf");
  };

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="/" />

      <Heading>Welcome to our little hui.</Heading>
      <Subheading centered>
        To join the directory, we just ask that you are{" "}
        <strong className="font-semibold text-stone-700">
          Native Hawaiian
        </strong>{" "}
        and work in the{" "}
        <strong className="font-semibold text-stone-700">
          field / industry of technology
        </strong>
        .
      </Subheading>
      <BasicInformationForm
        initial={{ name: name, location: location, website: website }}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
      <div style={{ margin: "1rem 0 4rem" }}>
        <ProgressBar currentCount={1} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
