import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import MetaTags from "../../components/Metatags.js";
import { HeaderHeading, HeaderDescription } from "../../components/Header.js";
import Input from "../../components/form/Input.js";
import Button from "../../components/Button.js";
import Disclaimer from "../../components/form/Disclaimer.js";
import { fetchFocuses } from "../../lib/api";
import ButtonBox from "../../components/form/ButtonBox.js";
import ProgressBar from "../../components/form/ProgressBar.js";
import Label from "../../components/form/Label.js";
import InputBox from "../../components/form/InputBox.js";

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

const errorMotionProps = {
  hidden: { color: "var(--color-text--alt)" },
  show: {
    color: "var(--color-brand)",
  },
  transition: {
    easing: "easeInOut",
  },
};

export default function JoinStep3({ focusesData }) {
  const router = useRouter();
  const { name, location, email, website } = router.query;
  const [focuses, setFocuses] = useState(focusesData);
  const [title, setTitle] = useState("");
  const [suggestedFocus, setSuggestedFocus] = useState();
  const [focusesSelected, setFocusesSelected] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [showSuggestButton, setShowSuggestButton] = useState(true);

  const totalFocusesSelected =
    focusesSelected.length + (suggestedFocus ? 1 : 0);

  const handleSelect = (focus) => {
    const index = focusesSelected.indexOf(focus);
    let newFocusesSelected = [...focusesSelected];
    if (index > -1) {
      newFocusesSelected.splice(index, 1);
    } else if (focusesSelected.length <= 2) {
      newFocusesSelected.push(focus);
    }
    setFocusesSelected(newFocusesSelected);
    setDisableSubmit(newFocusesSelected.length + (suggestedFocus ? 1 : 0) < 1);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleBlursuggestedFocus = (e) => {
    setShowSuggestButton(true);
    setSuggestedFocus(e.target.value ? e.target.value : undefined);
    setDisableSubmit(e.target.value.length < 1);
  };

  const handleDeselectLast = () => {
    let newFocusesSelected = [...focusesSelected].filter(
      (f, i) => i !== focusesSelected.length - 1
    );
    setFocusesSelected(newFocusesSelected);
  };

  const submitForm = () => {
    let focus = focusesSelected.map((fs) => {
      return fs.id;
    });

    let queryParams = {
      name: name,
      location: location,
      email: email,
      website: website,
      focus: focus,
    };
    if (title) {
      queryParams["title"] = title;
    }
    if (suggestedFocus) {
      queryParams["suggestedFocus"] = suggestedFocus;
    }
    router.push({
      pathname: "step-04",
      query: queryParams,
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
      <ProgressBar
        headline="Public"
        label="Professional mea"
        currentCount={2}
        totalCount={3}
      />
      <HeaderHeading>Welcome to our little hui.</HeaderHeading>
      <div style={{ marginBottom: "2rem" }}>
        <HeaderDescription>
          Our goal is to foster relationships and belonging among these
          professional sub-communities within our technical hui; to illustrate
          the different directions to aspiring kanaka.
        </HeaderDescription>
      </div>
      <div style={{ margin: "0 auto 1rem", maxWidth: "42rem" }}>
        <Label
          label="What’s your focus of work?"
          labelTranslation="He aha kou (mau) hana ʻoi a pau?"
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridAutoRows: "1fr",
          columnGap: "0.5rem",
          rowGap: "0.5rem",
          maxWidth: "42rem",
          margin: "0 auto 2rem",
        }}
      >
        {focuses.map((focus, i) => {
          return (
            <ButtonBox
              label={focus.name}
              disabled={
                totalFocusesSelected >= 3 && focusesSelected.indexOf(focus) < 0
              }
              selected={focusesSelected.indexOf(focus) > -1}
              onClick={(e) => {
                handleSelect(focus);
              }}
              key={`ButtonBox-${i}-`}
            />
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          maxWidth: "42rem",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h4 style={{ margin: "0 0 0.25rem" }}>Anything missing?</h4>
          <h4 style={{ fontWeight: "400", margin: "0 0 1rem" }}>
            Suggest an area of focus that you expect to be here.
          </h4>
        </div>
        {showSuggestButton ? (
          <ButtonBox
            label={
              suggestedFocus
                ? `For consideration: ${suggestedFocus}`
                : "Suggest new"
            }
            onClick={() => {
              setShowSuggestButton(!showSuggestButton);
            }}
            border={!!!suggestedFocus}
            selected={!!suggestedFocus}
            disabled={totalFocusesSelected >= 3 && !!!suggestedFocus}
          />
        ) : (
          <InputBox
            onBlur={handleBlursuggestedFocus}
            fullHeight
            fullWidth
            border
            focusedOnInit
            defaultValue={suggestedFocus}
            disabled={totalFocusesSelected >= 3 && !!!suggestedFocus}
          />
        )}
      </div>
      {totalFocusesSelected >= 3 && (
        <p
          style={{
            margin: "1rem auto 2rem",
            maxWidth: "42rem",
            textAlign: "center",
          }}
        >
          Maximum of 3 reached. Please{" "}
          <a href="#" onClick={handleDeselectLast}>
            deselect one
          </a>{" "}
          to pick another.
        </p>
      )}
      <div style={{ margin: "2rem auto 0", maxWidth: "42rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Input
            name="title"
            label="What’s your current title?"
            labelTranslation="ʻO wai kou kūlana i hana?"
            placeholder="e.g. Software Engineer"
            optional
            onChange={handleChangeTitle}
          />
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Button onClick={submitForm} disabled={disableSubmit}>
          Continue
        </Button>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Disclaimer>
          Sharing your professional focus will help the community understand the
          breadth of kanaka expertise in technology.
        </Disclaimer>
      </div>
    </div>
  );
}
