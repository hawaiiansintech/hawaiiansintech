import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import MetaTags from "../../components/Metatags.js";
import { Heading } from "../../components/Heading";
import Input from "../../components/form/Input";
import Button from "../../components/Button";
import UndoButton from "../../components/form/UndoButton";
import { fetchFocuses } from "../../lib/api";
import Selectable from "../../components/form/Selectable";
import ProgressBar from "../../components/form/ProgressBar";
import Label from "../../components/form/Label";
import InputBox from "../../components/form/InputBox";
import ErrorMessage, {
  ErrorMessageProps,
} from "../../components/form/ErrorMessage";
import RadioBox from "../../components/form/RadioBox";
import { scrollToTop } from "../../helpers.js";
import { FocusFields } from "../api/create-focus.jsx";

const NEXT_PAGE = "03-company";

export async function getStaticProps() {
  let focuses = (await fetchFocuses()) ?? [];
  return {
    props: {
      focuses: focuses.sort((a, b) => b.count - a.count),
    },
    revalidate: 60,
  };
}

const MAX_COUNT = 3;

export default function JoinStep3({ focuses }) {
  const router = useRouter();
  const { name, location, website } = router.query;
  const [title, setTitle] = useState<string>();
  const [yearsExperience, setYearsExperience] = useState<string>();
  const [suggestedFocus, setSuggestedFocus] = useState();
  const [focusesSelected, setFocusesSelected] = useState([]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  const totalFocusesSelected =
    focusesSelected.length + (suggestedFocus ? 1 : 0);

  useEffect(() => {
    const checkIfValid = totalFocusesSelected >= 1 && !!yearsExperience;
    if (checkIfValid) {
      setIsValid(checkIfValid);
      setError(undefined);
    }
  }, [yearsExperience, suggestedFocus, focusesSelected]);

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

  const createFocus = async ({ name }: FocusFields) => {
    return new Promise((resolve, reject) => {
      fetch("/api/create-focus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }).then(
        (response: Response) => {
          resolve(response);
        },
        (error: Response) => {
          reject(error);
        }
      );
    });
  };

  const submitForm = async () => {
    if (!isValid) {
      setError({
        headline: "Fields missing below.",
        body: "Please fill all required fields below.",
      });
      return;
    }
    let res: Response | any;
    if (suggestedFocus) {
      res = await createFocus({ name: suggestedFocus });
    }
    let queryParams = {
      name: name,
      location: location,
      website: website,
      focus: [...focusesSelected.map((fs) => fs.id), res],
      yearsExperience: yearsExperience,
    };
    if (title) {
      queryParams["title"] = title;
    }
    router.push({
      pathname: NEXT_PAGE,
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
        totalCount={4}
      />
      <div style={{ marginTop: "4rem" }}>
        <Heading>Welcome to our little hui.</Heading>
      </div>
      <section
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
        </div>
        <div style={{ marginTop: "2rem" }}>
          <Button onClick={submitForm}>Continue</Button>
        </div>
      </section>
    </div>
  );
}
