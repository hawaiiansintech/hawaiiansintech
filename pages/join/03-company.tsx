import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import InputBox from "@/components/form/InputBox";
import Label from "@/components/form/Label";
import ProgressBar from "@/components/form/ProgressBar";
import RadioBox from "@/components/form/RadioBox";
import Selectable, {
  SelectableGrid,
  SelectableVariant,
} from "@/components/form/Selectable";
import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags.js";
import { getIndustries } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { scrollToTop } from "../../helpers.js";

const NEXT_PAGE = "04-contact";

export async function getStaticProps() {
  let industries = (await getIndustries()) ?? [];
  return {
    props: {
      industries: industries,
    },
    revalidate: 60,
  };
}

const MAX_COUNT = 3;
const TECHNOLOGY_LABEL = "Internet / Technology";
const DEFER_LABEL = "N/A, or Prefer Not to Answer";

export default function JoinStep3({ industries }) {
  const { getItem, setItem, removeItem } = useStorage();
  const router = useRouter();
  const [companySize, setCompanySize] = useState<string>();
  const [industrySuggested, setIndustrySuggested] = useState("");
  const [deferIndustrySelected, setDeferIndustrySelected] =
    useState<boolean>(false);
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [columnCount, setColumnCount] = useState<2 | 3>(3);

  const totalIndustriesSelected =
    industriesSelected.length + (industrySuggested ? 1 : 0);
  const isMaxSelected = totalIndustriesSelected >= MAX_COUNT;

  const isValid = totalIndustriesSelected >= 1 && !!companySize;

  let technologyInd =
    industries.find((item) => item.name === TECHNOLOGY_LABEL) || null;
  let deferInd = industries.find((item) => item.name === DEFER_LABEL) || null;
  if (technologyInd) {
    industries = [
      ...industries.filter(
        (item) => item.name !== TECHNOLOGY_LABEL && item.name !== DEFER_LABEL
      ),
    ];
  }

  // check invalid situation via previous required entries
  useEffect(() => {
    const invalid =
      !getItem("jfName") ||
      !getItem("jfLocation") ||
      !getItem("jfWebsite") ||
      !getItem("jfYearsExperience") ||
      ([...JSON.parse(getItem("jfFocuses") || "[]")].length < 1 &&
        !getItem("jfFocusSuggested"));
    if (invalid) router.push({ pathname: "01-you", query: { r: "03" } });
  }, []);

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedIndustries = getItem("jfIndustries");
    let storedCompanySize = getItem("jfCompanySize");
    let storedIndustrySuggested = getItem("jfIndustrySuggested");
    if (storedIndustries) {
      // Convert string "[]" to parsable JSON
      storedIndustries = JSON.parse(storedIndustries);
      let match = [...industries, technologyInd, deferInd]
        .filter((ind) => storedIndustries.includes(ind?.id))
        .map((ind) => ind.id);
      setIndustriesSelected(match);
    }
    if (storedCompanySize) setCompanySize(storedCompanySize);
    if (storedIndustrySuggested) setIndustrySuggested(storedIndustrySuggested);
  }, []);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  useEffect(() => {
    const handleResize = () => {
      let mql = window.matchMedia("(min-width: 640px)");
      if (mql.matches) {
        setColumnCount(3);
      } else {
        setColumnCount(2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isValid) setError(undefined);
  }, [companySize, industrySuggested, industriesSelected]);

  useEffect(() => {
    setDeferIndustrySelected(industriesSelected.includes(deferInd.id));
  }, [industriesSelected]);

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

  const handleSubmit = () => {
    const industryDefered = industriesSelected.includes(deferInd.id);
    setLoading(true);
    if (isValid) {
      if (industryDefered) {
        setItem("jfIndustries", JSON.stringify([deferInd.id]));
      } else {
        setItem("jfIndustries", JSON.stringify(industriesSelected));
      }
      if (companySize) setItem("jfCompanySize", companySize);

      if (industrySuggested && !industryDefered) {
        setItem("jfIndustrySuggested", industrySuggested);
      } else {
        removeItem("jfIndustrySuggested");
      }
      router.push({ pathname: NEXT_PAGE });
    } else {
      setLoading(false);
      setError({
        headline: "Fields missing below.",
        body: "Please fill all required fields below.",
      });
    }
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
            hint={
              <>
                <strong>
                  We understand tech jobs aren't always "in tech".
                </strong>{" "}
                If you're in a technical field but within another industry,
                please feel free to omit the top option.
              </>
            }
          />
          <div style={{ margin: "1rem auto 2rem" }}>
            <SelectableGrid columns={columnCount}>
              {technologyInd && (
                <div
                  style={{
                    display: "flex",
                    gridColumn: `span ${columnCount}`,
                  }}
                >
                  <Selectable
                    headline={technologyInd.name}
                    disabled={
                      (isMaxSelected &&
                        !industriesSelected.includes(technologyInd.id)) ||
                      deferIndustrySelected
                    }
                    selected={
                      industriesSelected.includes(technologyInd.id) &&
                      !deferIndustrySelected
                    }
                    onClick={() => handleSelect(technologyInd.id)}
                    fullWidth
                  />
                </div>
              )}
              {industries.map((industry, i: number) => {
                const isDisabled =
                  isMaxSelected && !industriesSelected.includes(industry.id);
                const isSelected = industriesSelected.includes(industry.id);

                return (
                  <Selectable
                    headline={industry.name}
                    disabled={isDisabled || deferIndustrySelected}
                    selected={isSelected && !deferIndustrySelected}
                    onClick={(e) => handleSelect(industry.id)}
                    key={`ind-${i}`}
                  />
                );
              })}
              <div
                style={{
                  display: "grid",

                  gridTemplateColumns: "1fr 1fr",
                  gridAutoRows: "1fr",
                  columnGap: "0.5rem",
                  rowGap: "0.5rem",
                  gridColumn: `span ${columnCount}`,
                }}
              >
                {deferInd && (
                  <Selectable
                    headline={deferInd.name}
                    fullWidth
                    disabled={isMaxSelected && !deferIndustrySelected}
                    selected={deferIndustrySelected}
                    onClick={() => handleSelect(deferInd.id)}
                  />
                )}
                {showSuggestButton ? (
                  <Selectable
                    headline={
                      industrySuggested
                        ? `${industrySuggested}`
                        : "+ Add industry"
                    }
                    onClick={() => setShowSuggestButton(false)}
                    selected={!!industrySuggested && !deferIndustrySelected}
                    disabled={
                      (isMaxSelected && !!!industrySuggested) ||
                      deferIndustrySelected
                    }
                    fullWidth
                    centered
                    variant={SelectableVariant.Alt}
                    onClear={
                      industrySuggested && !deferIndustrySelected
                        ? () =>
                            window.confirm(
                              "Are you sure you want to clear this field?"
                            ) && setIndustrySuggested("")
                        : undefined
                    }
                  />
                ) : (
                  <InputBox
                    fullWidth
                    border
                    focusedOnInit
                    onChange={(e) => setIndustrySuggested(e.target.value)}
                    onBlur={() => setShowSuggestButton(true)}
                    onEnter={() => setShowSuggestButton(true)}
                    value={industrySuggested}
                    disabled={isMaxSelected && !!!industrySuggested}
                  />
                )}
              </div>
            </SelectableGrid>
          </div>

          <Label
            label="How many employees work at your company?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
            hint={
              <>
                <strong>
                  Size isn't everything, but it also <em>isn't</em> nothing.
                </strong>{" "}
                This will help us assess the sort of company you work for.
              </>
            }
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
                key={`size-${i}`}
              >
                <RadioBox
                  seriesOf="company-size"
                  checked={size === companySize}
                  label={size}
                  onChange={() => setCompanySize(size)}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={{ margin: "2rem auto 0", maxWidth: "24rem" }}>
          <Button
            fullWidth
            onClick={handleSubmit}
            loading={loading}
            type="submit"
          >
            Continue
          </Button>
        </div>
      </section>
    </div>
  );
}
