import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import Disclaimer from "../../components/form/Disclaimer.js";
import { fetchFocuses } from "../../lib/api";
import ButtonBox from "../../components/form/ButtonBox.js";
import { cssHelperButtonReset } from "../../styles/global.js";
import ErrorMessage from "../../components/form/ErrorMessage.js";
import ProgressBar from "../../components/form/ProgressBar.js";

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
    const isPreviousSelection = focus === focusSelected;
    setDisableSubmit(isPreviousSelection);
    setFocusSelected(isPreviousSelection ? undefined : focus);
  };

  const submitForm = ({ name, location, website, email, focus }) => {
    router.push({
      pathname: "step-04",
      query: {
        name: name,
        location: location,
        email: email,
        website: website,
        focus: focus.id,
      },
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
        <ProgressBar
          headline="Public"
          label="Professional focus"
          currentCount={2}
          totalCount={3}
        />
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
              selected={focus === focusSelected}
              onClick={(e) => {
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
          Continue
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
