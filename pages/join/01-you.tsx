import ProgressBar from "@/components/form/ProgressBar";
import { Heading, Subheading } from "@/components/Heading";
import BasicInformationForm from "@/components/intake-form/BasicInformation";
import JoinHeader from "@/components/intake-form/JoinHeader";
import MetaTags from "@/components/Metatags.js";
import { useStorage } from "@/lib/hooks";
import { clearAllStoredFields } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RequestForm from "./components/request-form";

export default function JoinStep1(props) {
  const router = useRouter();
  const { r, edit } = router.query;
  const { getItem, setItem } = useStorage();
  const [showEdit, setEditIsShowing] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // clear fields if param `r` is present
  useEffect(() => {
    if (!r) return;

    clearAllStoredFields();
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
    setEditIsShowing(!showEdit);
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
    clearAllStoredFields();
  };

  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader hideCenter={showEdit} showModify toggleEdit={handleToggle}>
        <ProgressBar
          headline="Public"
          label="Who You Are"
          currentCount={1}
          totalCount={4}
        />
      </JoinHeader>
      <Heading>
        {showEdit ? "Request Changes" : "Welcome to our little hui."}
      </Heading>
      {showEdit || (
        <Subheading centered>
          To join the directory, we just ask that you are{" "}
          <strong>Native Hawaiian</strong> and work in the{" "}
          <strong>field / industry of technology</strong>.
        </Subheading>
      )}
      {showEdit ? (
        <RequestForm onToggle={() => setEditIsShowing(!showEdit)} />
      ) : (
        <BasicInformationForm
          initial={{ name: name, location: location, website: website }}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      )}
    </>
  );
}
