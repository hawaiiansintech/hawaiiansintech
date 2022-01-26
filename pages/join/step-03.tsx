import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import MetaTags from "../../components/Metatags.js";
import { Heading } from "../../components/Heading";
import Input from "../../components/form/Input";
import Button from "../../components/Button";
import UndoButton from "../../components/form/UndoButton";
import { fetchFocuses, fetchIndustries } from "../../lib/api";
import Selectable from "../../components/form/Selectable";
import ProgressBar from "../../components/form/ProgressBar";
import Label from "../../components/form/Label";
import InputBox from "../../components/form/InputBox";
import ErrorMessage, {
  ErrorMessageProps,
} from "../../components/form/ErrorMessage";
import RadioBox from "../../components/form/RadioBox";
import { scrollToTop } from "../../helpers.js";

export async function getStaticProps() {
  let focuses = (await fetchFocuses()) ?? [];
  let industries = (await fetchIndustries()) ?? [];
  return {
    props: {
      focuses: focuses.sort((a, b) => b.count - a.count),
      industries: industries,
    },
    revalidate: 60,
  };
}

const MAX_COUNT = 3;

export default function JoinStep3({ focuses, industries }) {
  console.log(industries);
  const router = useRouter();
  const { name, location, website } = router.query;
  const [title, setTitle] = useState<string>();
  const [companySize, setCompanySize] = useState<string>();
  const [yearsExperience, setYearsExperience] = useState<string>();
  const [suggestedFocus, setSuggestedFocus] = useState();
  const [focusesSelected, setFocusesSelected] = useState([]);
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  const totalFocusesSelected =
    focusesSelected.length + (suggestedFocus ? 1 : 0);

  useEffect(() => {
    const checkIfValid =
      totalFocusesSelected >= 1 && !!yearsExperience && !!companySize;
    console.log(`🍒 checkIfValid: ${checkIfValid}`);
    if (checkIfValid) {
      setIsValid(checkIfValid);
      setError(undefined);
    }
  }, [companySize, yearsExperience, suggestedFocus, focusesSelected]);

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
    if (!isValid) {
      setError({
        headline: "Fields missing below.",
        body: "Please fill all required fields below.",
      });
      return;
    }

    let queryParams = {
      name: name,
      location: location,
      website: website,
      focus: focusesSelected.map((fs) => fs.id),
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
      <div
        style={{
          margin: "0 auto 1rem",
          maxWidth: "var(--width-page-interior)",
        }}
      >
        {error && <ErrorMessage headline={error.headline} body={error.body} />}
        <Label
          label="Which of the following best describes your field of work?"
          labelTranslation="He aha kou (mau) hana ʻoi a pau?"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridAutoRows: "1fr",
            columnGap: "0.5rem",
            rowGap: "0.5rem",
            margin: "1rem 0 2rem",
            padding: "0.5rem",
            background: "var(--color-background-alt-2)",
            borderRadius: "var(--border-radius-medium)",
          }}
        >
          {focuses.map((focus, i: number) => {
            const isDisabled =
              isMaxSelected && focusesSelected.indexOf(focus) < 0;
            const isSelected = focusesSelected.indexOf(focus) > -1;

            return (
              <Selectable
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
                key={`Selectable-${i}-`}
              />
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
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
              <Selectable
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
              margin: "1rem 0 2rem",
              textAlign: "center",
            }}
          >
            Maximum of {`${MAX_COUNT}`} reached. Please{" "}
            <UndoButton onClick={handleDeselectLast}>deselect one</UndoButton>{" "}
            to pick another.
          </p>
        )}

        <div style={{ margin: "2rem 0" }}>
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
        <div style={{ marginBottom: "2rem" }}>
          <Label
            label="How many years of experience do you have in your field?"
            labelTranslation="Ehia ka makahiki o kou hana ʻana ma kou ʻoi hana?"
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "1rem auto 2rem",
            }}
          >
            {[
              "Less than a year",
              "1 – 2 years",
              "3 – 4 years",
              "5 – 9 years",
              "10 – 19 years",
              "More than 20 years",
            ].map((dur) => (
              <div style={{ margin: "0 0.5rem 0.5rem 0" }}>
                <RadioBox
                  seriesOf="years-experience"
                  label={dur}
                  onChange={() => {
                    setYearsExperience(dur);
                  }}
                  key={`dur-${dur}`}
                />
              </div>
            ))}
          </div>

          <Label
            label="Which of the following best describes the industry that your company operates within?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridAutoRows: "1fr",
              columnGap: "0.5rem",
              rowGap: "0.5rem",
              margin: "1rem auto 2rem",
              padding: "0.5rem",
              background: "var(--color-background-alt-2)",
              borderRadius: "var(--border-radius-medium)",
            }}
          >
            <div
              style={{
                display: "flex",
                gridColumn: "span 3",
              }}
            >
              <Selectable fullWidth label="Technology" />
            </div>
            <div
              style={{
                position: "relative",
                gridColumn: "span 3",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  border: "0.0625rem solid var(--color-border-alt)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "var(--color-background-alt-2)",
                  padding: "0 0.5rem",
                  color: "var(--color-text-alt-2)",
                  fontWeight: "400",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1rem",
                }}
              >
                AND/OR
              </span>
            </div>
            {industries.map((focus, i: number) => {
              const isDisabled =
                isMaxSelected && focusesSelected.indexOf(focus) < 0;
              const isSelected = focusesSelected.indexOf(focus) > -1;

              return (
                <Selectable
                  label={focus.name}
                  disabled={isDisabled}
                  selected={isSelected}
                  onClick={(e) => {
                    handleSelect(focus);
                  }}
                  key={`ind-${i}`}
                />
              );
            })}
          </div>

          <Label
            label="How many employees work at your company?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "1rem auto 2rem",
            }}
          >
            {[
              "1",
              "2 – 9",
              "10 – 19",
              "20 – 49",
              "50 – 99",
              "100 – 999",
              "1000 – 4999",
              "5000 – 10000",
              "More than 10000",
              "N/A",
            ].map((size) => (
              <div
                style={{ margin: "0 0.5rem 0.5rem 0", marginRight: "0.5rem" }}
              >
                <RadioBox
                  seriesOf="company-size"
                  label={size}
                  onChange={() => {
                    setCompanySize(size);
                  }}
                  key={`size-${size}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <Button onClick={submitForm}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
