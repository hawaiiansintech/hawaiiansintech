import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
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
import ErrorMessage from "../../components/form/ErrorMessage.js";

export async function getStaticProps() {
  let focuses = (await fetchFocuses()) ?? [];
  focuses = focuses.sort((a, b) => {
    return b.count - a.count;
  });
  return {
    props: {
      focuses: focuses,
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

const MAX_COUNT = 3;

export default function JoinStep3({ focuses }) {
  const router = useRouter();
  const { name, location, email, website } = router.query;
  const [title, setTitle] = useState("");
  const [isErrored, setIsErrored] = useState(false);
  const [suggestedFocus, setSuggestedFocus] = useState();
  const [focusesSelected, setFocusesSelected] = useState([]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const errorPlaceholderRef = useRef();

  const totalFocusesSelected =
    focusesSelected.length + (suggestedFocus ? 1 : 0);

  const handleSelect = (focus) => {
    let nextFocusesSelected = [...focusesSelected];
    const index = focusesSelected.indexOf(focus);
    const isSelected = index > -1;
    setIsErrored(false);

    if (isSelected) {
      nextFocusesSelected.splice(index, 1);
    } else if (focusesSelected.length < MAX_COUNT) {
      nextFocusesSelected.push(focus);
    }
    setFocusesSelected(nextFocusesSelected);
  };

  const handleBlurSuggested = (e) => {
    setShowSuggestButton(true);
    setSuggestedFocus(e.target.value ? e.target.value : undefined);
  };

  const handleDeselectLast = () => {
    let nextFocusesSelected = [...focusesSelected];
    nextFocusesSelected.pop();
    setFocusesSelected(nextFocusesSelected);
  };

  const handleClearSuggested = () => {
    if (
      window.confirm("Are you sure you want to clear this suggestion field?")
    ) {
      setSuggestedFocus(undefined);
    }
  };

  const submitForm = () => {
    if (totalFocusesSelected < 1) {
      setIsErrored(true);
      if (errorPlaceholderRef.current) {
        window.scrollTo({
          top: errorPlaceholderRef.current.offsetTop,
          behavior: "smooth",
        });
      }
      return;
    }

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
  const isMaxSelected = totalFocusesSelected >= MAX_COUNT;

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
      {/* <div style={{ marginBottom: "2rem" }}>
        <HeaderDescription>
          Our goal is to foster relationships and belonging among these
          professional sub-communities within our technical hui; to illustrate
          the different directions to aspiring kanaka.
        </HeaderDescription>
      </div> */}
      <div ref={errorPlaceholderRef} />
      {isErrored && (
        <div style={{ margin: "0 auto 1rem", maxWidth: "42rem" }}>
          <ErrorMessage
            headline="A professional focus is required."
            body="Please pick at least one below."
          />
        </div>
      )}
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
          const isDisabled =
            isMaxSelected && focusesSelected.indexOf(focus) < 0;
          const isSelected = focusesSelected.indexOf(focus) > -1;

          return (
            <ButtonBox
              label={focus.name}
              disabled={isDisabled}
              selected={isSelected}
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <ButtonBox
              label={suggestedFocus ? `${suggestedFocus}` : "Suggest new"}
              onClick={() => {
                setShowSuggestButton(!showSuggestButton);
              }}
              border={!!!suggestedFocus}
              selected={!!suggestedFocus}
              disabled={isMaxSelected && !!!suggestedFocus}
            />
            {suggestedFocus !== undefined && (
              <button
                onClick={handleClearSuggested}
                style={{ marginLeft: "0.5rem" }}
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <InputBox
            onBlur={handleBlurSuggested}
            fullHeight
            fullWidth
            border
            focusedOnInit
            defaultValue={suggestedFocus}
            disabled={isMaxSelected && !!!suggestedFocus}
          />
        )}
      </div>
      {isMaxSelected && (
        <p
          style={{
            margin: "1rem auto 2rem",
            maxWidth: "42rem",
            textAlign: "center",
          }}
        >
          Maximum of {`${MAX_COUNT}`} reached. Please{" "}
          <button onClick={handleDeselectLast}>deselect one</button> to pick
          another.
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
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Button onClick={submitForm}>Continue</Button>
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
