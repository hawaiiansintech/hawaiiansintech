import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useSessionStorage } from "../../helpers.js";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import Input from "../../components/form/Input.js";
import Disclaimer from "../../components/form/Disclaimer.js";

export default function JoinStep2() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [nameStored, setNameStored] = useSessionStorage("name", "");
  const [locationStored, setLocationStored] = useSessionStorage("location", "");
  const [emailStored, setEmailStored] = useSessionStorage("email", "");
  const [websiteStored, setWebsiteStored] = useSessionStorage("website", "");

  return (
    <div className="container">
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>

      <Link href="/" shallow={true}>
        <a className="auxNav arrowback">←</a>
      </Link>

      <Header>
        <h2>K, real quick...</h2>
      </Header>
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "42rem",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <Input
            defaultValue={nameStored}
            label="What’s your name?"
            labelTranslation="ʻO wai kou inoa?"
            placeholder="Full name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <Input
            defaultValue={locationStored}
            label="Where you stay now days?"
            labelTranslation="Ma hea ʻoe?"
            placeholder="City, State"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <Input
            defaultValue={emailStored}
            label="What’s your email?"
            labelTranslation="He aha kou wahi leka uila?"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <Input
          defaultValue={websiteStored}
          label="What’s your LinkedIn / professional website?"
          labelTranslation="He aha kou wahi uila ’oihana?"
          onChange={(e) => {
            setWebsite(e.target.value);
          }}
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Button
          onClick={() => {
            setNameStored(name);
            setLocationStored(location);
            setEmailStored(email);
            setWebsiteStored(website);
          }}
          linkTo="/join/step-03"
        >
          Continue
        </Button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Disclaimer>
          We may reach out to connect and talk story. Please feel welcome to do
          the same. We won’t share your contact information without your
          permission.
        </Disclaimer>
      </div>

      <style global jsx>{`
        .container {
          padding-top: 6rem;
        }
      `}</style>
    </div>
  );
}
