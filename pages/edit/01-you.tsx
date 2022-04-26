import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import BasicInformationForm from "@/components/intake-form/BasicInformation";
import JoinHeader from "@/components/intake-form/JoinHeader";
import MetaTags from "@/components/Metatags.js";
import { useStorage } from "@/lib/hooks";
import { clearAllStoredFields, FORM_LINKS } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function JoinStep1(props) {
  const router = useRouter();
  const { r } = router.query;
  const { getItem, setItem, removeItem } = useStorage();
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // clear fields if param `r` is present
  useEffect(() => {
    if (!r) return;

    clearAllStoredFields("edit");
    setName("");
    setLocation("");
    setWebsite("");
    if (typeof window !== "undefined")
      window.history.replaceState(null, "", "/join/01-you");
  }, [r]);

  useEffect(() => {
    let storedName = getItem("editName");
    let updatedName = getItem("newName");
    let storedLocation = getItem("editLocation");
    let updatedLocation = getItem("newLocation");
    let storedWebsite = getItem("editWebsite");
    let updatedWebsite = getItem("newWebsite");
    if (updatedName || storedName) setName(updatedName || storedName);
    if (updatedLocation || storedLocation)
      setLocation(updatedLocation || storedLocation);
    if (updatedWebsite || storedWebsite)
      setWebsite(updatedWebsite || storedWebsite);
  }, []);

  const handleSubmit = (values) => {
    removeItem("newName");
    removeItem("newLocation");
    removeItem("newWebsite");
    if (getItem("editName") !== values.name) setItem("newName", values.name);
    if (getItem("editLocation") !== values.location)
      setItem("newLocation", values.location);
    if (getItem("editWebsite") !== values.website)
      setItem("newWebsite", values.website);
    router.push({ pathname: FORM_LINKS[1], query: router.query });
  };

  const handleReset = () => {
    setName("");
    setLocation("");
    setWebsite("");
    clearAllStoredFields("edit");
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
          headline="REQUESTING CHANGES (1/2)"
          label="Basic Information"
          currentCount={1}
          totalCount={2}
        />
      </JoinHeader>
      <div className="container">
        <Heading>Requesting changes for {name}</Heading>
        <BasicInformationForm
          initial={{ name: name, location: location, website: website }}
          onSubmit={handleSubmit}
          onReset={handleReset}
          renderResetButton={false}
        />
      </div>
    </>
  );
}
