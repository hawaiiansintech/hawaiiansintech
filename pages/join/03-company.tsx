import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "../../components/form/ErrorMessage";
import Label from "../../components/form/Label";
import ProgressBar from "../../components/form/ProgressBar";
import RadioBox from "../../components/form/RadioBox";
import Selectable from "../../components/form/Selectable";
import { Heading } from "../../components/Heading";
import HorizontalRule from "../../components/HorizontalRule";
import MetaTags from "../../components/Metatags.js";
import { scrollToTop } from "../../helpers.js";
import { fetchIndustries } from "../../lib/api";
import { useStorage } from "../../lib/hooks";
import { clearAllStoredFields } from "./01-you";

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
const TECHNOLOGY_LABEL = "Internet / Technology";

export default function JoinStep3({ industries }) {
  const { getItem, setItem } = useStorage();
  const router = useRouter();
  const [companySize, setCompanySize] = useState<string>();
  const [suggestedIndustry, setSuggestedIndustry] = useState();
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([""]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState(null);

  let technologyInd =
    industries.find((item) => item.name === TECHNOLOGY_LABEL) || undefined;
  if (technologyInd) {
    industries = [
      ...industries.filter((item) => item.name !== TECHNOLOGY_LABEL),
    ];
  }

  // check invalid situation via previous required entries
  useEffect(() => {
    const prevReqFields =
      !getItem("jfName") ||
      !getItem("jfLocation") ||
      !getItem("jfWebsite") ||
      !getItem("jfFocuses");

    if (prevReqFields) {
      clearAllStoredFields();
      router.push({ pathname: "01-you" });
    }
  }, []);

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedIndustries = getItem("jfIndustries");
    let storedCompanySize = getItem("jfCompanySize");
    if (storedIndustries) {
      // Convert string "[]" to parsable JSON
      storedIndustries = JSON.parse(storedIndustries);
      let match = [...industries, technologyInd]
        .filter((ind) => storedIndustries.includes(ind?.id))
        .map((ind) => ind.id);
      setIndustriesSelected(match);
    }
    if (storedCompanySize) setCompanySize(storedCompanySize);
  }, []);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  const totalIndustriesSelected =
    industriesSelected.length + (suggestedIndustry ? 1 : 0);

  useEffect(() => {
    const isValid = totalIndustriesSelected >= 1 && !!companySize;
    if (isValid) {
      setIsValid(isValid);
      setError(undefined);
    }
  }, [companySize, suggestedIndustry, industriesSelected]);

  const handleSelect = (industry) => {
    let nextIndustriesSelected = [...industriesSelected];
    const index = industriesSelected.indexOf(industry);
    const isSelected = index > -1;

    if (isSelected) {
      nextIndustriesSelected.splice(index, 1);
    } else if (industriesSelected.length < MAX_COUNT) {
      nextIndustriesSelected.push(industry);
    }
    setIndustriesSelected(nextIndustriesSelected);
  };

  const handleBlurSuggested = (e) => {
    setShowSuggestButton(true);
    setSuggestedIndustry(e.target.value ? e.target.value : undefined);
  };

  const handleDeselectLast = () => {
    let nextFocusesSelected = [...industriesSelected];
    nextFocusesSelected.pop();
    setIndustriesSelected(nextFocusesSelected);
  };

  const handleClearSuggested = () => {
    if (window.confirm("Are you sure you want to clear this field?")) {
      setSuggestedIndustry(undefined);
    }
  };

  const submitForm = () => {
    setLoading(true);
    if (!isValid) {
      setError({
        headline: "Fields missing below.",
        body: "Please fill all required fields below.",
      });
      setLoading(false);
      return;
    }
    if (industriesSelected)
      setItem("jfIndustries", JSON.stringify(industriesSelected));
    if (companySize) setItem("jfCompanySize", companySize);
    router.push({ pathname: NEXT_PAGE });
  };

  const isMaxSelected = totalIndustriesSelected >= MAX_COUNT;

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
                  <Selectable
                    label={technologyInd.name}
                    disabled={
                      isMaxSelected &&
                      !industriesSelected.includes(technologyInd.id)
                    }
                    selected={industriesSelected.includes(technologyInd.id)}
                    onClick={() => handleSelect(technologyInd.id)}
                    fullWidth
                  />
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
            {industries.map((industry, i: number) => {
              const isDisabled =
                isMaxSelected && !industriesSelected.includes(industry.id);
              const isSelected = industriesSelected.includes(industry.id);

              return (
                <Selectable
                  label={industry.name}
                  disabled={isDisabled}
                  selected={isSelected}
                  onClick={(e) => {
                    handleSelect(industry.id);
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
            ].map((size, i) => (
              <div
                style={{ margin: "0 0.5rem 0.5rem 0", marginRight: "0.5rem" }}
              >
                <RadioBox
                  seriesOf="company-size"
                  checked={size === companySize}
                  label={size}
                  onChange={() => setCompanySize(size)}
                  key={`size-${i}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <Button onClick={submitForm} loading={loading}>
            Continue
          </Button>
        </div>
      </section>
    </div>
  );
}
