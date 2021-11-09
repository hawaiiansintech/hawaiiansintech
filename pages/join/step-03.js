import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { toKebab } from "../../helpers.js";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import RadioBox from "../../components/form/RadioBox.js";
import Disclaimer from "../../components/form/Disclaimer.js";
import SearchBar from "../../components/form/SearchBar.js";
import { createMember, fetchRoles, fetchFocuses } from "../../lib/api";
import ButtonBox from "../../components/form/ButtonBox.js";
import { cssHelperButtonReset } from "../../styles/global.js";
import ErrorMessage from "../../components/form/ErrorMessage.js";
import Label from "../../components/form/Label.js";

export async function getStaticProps() {
  let focuses = (await fetchFocuses()) ?? [];
  focuses = focuses.sort((a, b) => {
    return b.count - a.count;
  });
  return {
    props: {
      focusesData: focuses,
    },
    revalidate: 60,
  };
}

export default function JoinStep3({ focusesData }) {
  const router = useRouter();
  const { name, location, email, website } = router.query;
  const [focuses, setFocuses] = useState(focusesData);
  const [focusSelected, setFocusSelected] = useState();
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [showError, setShowError] = useState(false);

  const handleSelect = (focus) => {
    setDisableSubmit(false);
    setFocusSelected(focus);
  };
  const submitForm = ({ name, location, website, email, focus }) => {
    fetch("/api/create-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, location, website, email, focus }),
    })
      .then((res) => {
        if (res.ok) {
          setDisableSubmit(true);
        } else {
          throw new Error({ status: res.status, statusText: res.statusText });
        }
      })
      .catch((err) => {
        setShowError(true);
      });
  };

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
        <h2>Welcome to our little hui.</h2>
        <p>
          <strong>Pick what you consider the focus of your work.</strong> Our
          goal is to help foster belonging among professional sub-communities
          within our hui, as well as inspire young, aspiring kanaka about the
          different directions to go.
        </p>
      </Header>
      {showError && (
        <div style={{ marginBottom: "1rem" }}>
          <ErrorMessage
            headline={"Gonfunnit, looks like something went wrong."}
            body={"Please try again later."}
          />
        </div>
      )}
      {/* {name} {location} {email} {website}{" "}
      {focusSelected ? focusSelected.name : ""} */}
      {/* <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
        <Label
          label={"Pick what you consider your focus in the industry."}
          // labelTranslation={"labelTranslation"}
        />
      </div> */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridAutoRows: "1fr",
          columnGap: "0.5rem",
          rowGap: "0.5rem",
          maxWidth: "42rem",
          margin: "1rem auto 0",
        }}
      >
        {focuses.map((focus, i) => {
          return (
            <ButtonBox
              label={focus.name}
              onClick={() => {
                handleSelect(focus);
              }}
              key={`ButtonBox-${i}-`}
            />
          );
        })}
        <ButtonBox label="None of these fit; suggest another" border />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Button
          onClick={() => {
            submitForm({
              name: name,
              location: location,
              email: email,
              website: website,
              focus: focusSelected,
            });
          }}
          disabled={disableSubmit}
        >
          Submit
        </Button>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Disclaimer>
          Sharing your professional focus will help the community understand the
          breadth of kanaka expertise in technology.
        </Disclaimer>
      </div>
      <style global jsx>{`
        .container {
          padding-top: 6rem;
        }
        .more-link {
          ${cssHelperButtonReset}
          background: transparent;
          color: var(--color-brand);
          font-weight: 500;
        }
        .more-link:hover {
          color: var(--color-brand-tone);
        }
      `}</style>
    </div>
  );
}
