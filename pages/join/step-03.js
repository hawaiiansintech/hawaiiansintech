import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import MetaTags from "../../components/Metatags.js";
import { Heading } from "../../components/Heading.tsx";
import Input from "../../components/form/Input.js";
import Button from "../../components/Button.js";
import UndoButton from "../../components/UndoButton.js";
import { fetchFocuses } from "../../lib/api";
import ButtonBox from "../../components/form/ButtonBox.tsx";
import ProgressBar from "../../components/form/ProgressBar.js";
import Label from "../../components/form/Label.js";
import InputBox from "../../components/form/InputBox.js";
import ErrorMessage from "../../components/form/ErrorMessage.js";
import RadioBox from "../../components/form/RadioBox.tsx";

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
  const { name, location, website } = router.query;
  const [title, setTitle] = useState("");
  const [yearsExperience, setYearsExperience] = useState();
  const [companySize, setCompanySize] = useState();
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
    if (window.confirm("Are you sure you want to clear this field?")) {
      setSuggestedFocus(undefined);
    }
  };

  const submitForm = () => {
    if (totalFocusesSelected < 1 || !!!yearsExperience || !!!companySize) {
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
      website: website,
      focus: focus,
      yearsExperience: yearsExperience,
      companySize: companySize,
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
        label="What You Do"
        currentCount={2}
        totalCount={3}
      />
      <div style={{ marginTop: "4rem" }}>
        <Heading>Welcome to our little hui.</Heading>
      </div>
      <div ref={errorPlaceholderRef} />
      {isErrored && (
        <div
          style={{
            margin: "0 auto 1rem",
            maxWidth: "var(--page-interior-width)",
          }}
        >
          <ErrorMessage
            headline="Fields missing below."
            body="Please fill all required fields below."
          />
        </div>
      )}

      <div
        style={{
          margin: "0 auto 1rem",
          maxWidth: "var(--page-interior-width)",
        }}
      >
        <Label
          label="Which of the following best describe what you do?"
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
          maxWidth: "var(--page-interior-width)",
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
              badgeNumber={
                focusesSelected.length > 1 && isSelected
                  ? focusesSelected.indexOf(focus) + 1
                  : undefined
              }
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
          maxWidth: "var(--page-interior-width)",
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
              label={suggestedFocus ? `${suggestedFocus}` : "Suggest another"}
              onClick={() => {
                setShowSuggestButton(!showSuggestButton);
              }}
              border={!!!suggestedFocus}
              selected={!!suggestedFocus}
              disabled={isMaxSelected && !!!suggestedFocus}
            />
            {suggestedFocus !== undefined && (
              <div style={{ marginLeft: "0.5rem" }}>
                <UndoButton onClick={handleClearSuggested}>Clear</UndoButton>
              </div>
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
            maxWidth: "var(--page-interior-width)",
            textAlign: "center",
          }}
        >
          Maximum of {`${MAX_COUNT}`} reached. Please{" "}
          <UndoButton onClick={handleDeselectLast}>deselect one</UndoButton> to
          pick another.
        </p>
      )}

      <div
        style={{
          maxWidth: "var(--page-interior-width)",
          margin: "0 auto 2rem",
        }}
      >
        <div
          style={{
            margin: "2rem auto 0",
          }}
        >
          <Label
            label="How many years of experience do you have in your field?"
            labelTranslation="Ehia ka makahiki o kou hana ʻana ma kou ʻoi hana?"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "0.5rem auto 2rem",
          }}
        >
          {[
            "Up to a year",
            "1 – 4 years",
            "5 – 9 years",
            "10 – 14 years",
            "15+ years",
          ].map((dur) => (
            <div style={{ margin: "0 0.5rem 0.5rem 0" }}>
              <RadioBox
                seriesOf="years-experience"
                label={dur}
                onChange={() => {
                  setYearsExperience(dur);
                }}
              />
            </div>
          ))}
        </div>

        <Label
          label="How big is the company you work for?"
          labelTranslation="--?"
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "0.5rem auto 2rem",
          }}
        >
          {[
            "1",
            "2 – 10",
            "11 – 50",
            "51 – 200",
            "201 – 500",
            "501 – 1000",
            "1001 – 5000",
            "5000 – 10000",
            "10000+",
            "Not Currently Working",
          ].map((size) => (
            <div style={{ margin: "0 0.5rem 0.5rem 0", marginRight: "0.5rem" }}>
              <RadioBox
                seriesOf="company-size"
                label={size}
                onChange={() => {
                  setCompanySize(size);
                }}
              />
            </div>
          ))}
        </div>

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
      <div style={{ marginTop: "2rem" }}>
        <Button onClick={submitForm}>Continue</Button>
      </div>
    </div>
  );
}
