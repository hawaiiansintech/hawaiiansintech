import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import MetaTags from "../../components/Metatags.js";
import { Heading } from "../../components/Heading";
import Input from "../../components/form/Input";
import Button from "../../components/Button";
import UndoButton from "../../components/form/UndoButton";
import { fetchIndustries } from "../../lib/api";
import Selectable from "../../components/form/Selectable";
import ProgressBar from "../../components/form/ProgressBar";
import Label from "../../components/form/Label";
import InputBox from "../../components/form/InputBox";
import ErrorMessage, {
  ErrorMessageProps,
} from "../../components/form/ErrorMessage";
import RadioBox from "../../components/form/RadioBox";
import { scrollToTop } from "../../helpers.js";
import HorizontalRule from "../../components/HorizontalRule";

const NEXT_PAGE = "04-contact";

export async function getStaticProps() {
  let industries = (await fetchIndustries()) ?? [];
  return {
    props: {
      industries: industries,
    },
    revalidate: 60,
  };
}

const MAX_COUNT = 2;

export default function JoinStep3({ industries }) {
  let technologyInd = industries.find((item) => item.name === "Technology");
  if (technologyInd) {
    industries = [...industries.filter((item) => item.name !== "Technology")];
  }

  const router = useRouter();
  const { name, location, website } = router.query;
  const [companySize, setCompanySize] = useState<string>();
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
    const checkIfValid = totalFocusesSelected >= 1 && !!companySize;
    console.log(`🍒 checkIfValid: ${checkIfValid}`);
    if (checkIfValid) {
      setIsValid(checkIfValid);
      setError(undefined);
    }
  }, [companySize, suggestedFocus, focusesSelected]);

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
      companySize: companySize,
    };
    if (suggestedFocus) {
      queryParams["suggestedFocus"] = suggestedFocus;
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
        label="Where You Work"
        currentCount={3}
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

        <div style={{ marginBottom: "2rem" }}>
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
            {technologyInd && (
              <>
                <div
                  style={{
                    display: "flex",
                    gridColumn: "span 3",
                  }}
                >
                  <Selectable fullWidth label={technologyInd.name} />
                </div>
                <div
                  style={{
                    gridColumn: "span 3",
                    display: "flex",
                    justifyContent: "stretch",
                    alignItems: "center",
                  }}
                >
                  <HorizontalRule label="AND/OR" />
                </div>
              </>
            )}
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
      </section>
    </div>
  );
}
