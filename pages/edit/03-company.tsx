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
import JoinHeader from "@/components/intake-form/JoinHeader";
import MetaTags from "@/components/Metatags.js";
import { getIndustries } from "@/lib/api";
import { useStorage, useWindowWidth } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import { scrollToTop } from "../../helpers";

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

export default function JoinStep3({ industries }) {
  const { getItem, setItem, removeItem } = useStorage();
  const router = useRouter();
  const width = useWindowWidth();
  const [name, setName] = useState<string>("");

  const [companySize, setCompanySize] = useState<string>();
  const [industrySuggested, setIndustrySuggested] = useState("");
  const [deferIndustry, setDeferIndustry] = useState<"true">();
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [columnCount, setColumnCount] = useState<2 | 3>(3);

  const totalIndustriesSelected =
    industriesSelected.length + (industrySuggested ? 1 : 0);
  const isMaxSelected = totalIndustriesSelected >= MAX_COUNT;

  let technologyInd =
    industries.find((item) => item.name === TECHNOLOGY_LABEL) || null;
  if (technologyInd) {
    industries = [
      ...industries.filter((item) => item.name !== TECHNOLOGY_LABEL),
    ];
  }

  // check invalid situation via previous required entries
  // useInvalid({ currentPage: "03-company" });

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedName = getItem("editName");
    let updatedName = getItem("newName");
    let storedIndustries = getItem("editIndustries");
    let updatedIndustries = getItem("newIndustries");
    let storedDeferIndustry = getItem("editDeferIndustry");
    let updatedDeferIndustry = getItem("newDeferIndustry");
    let storedCompanySize = getItem("editCompanySize");
    let updatedCompanySize = getItem("newCompanySize");
    let storedIndustrySuggested = getItem("editIndustrySuggested");
    let updatedIndustrySuggested = getItem("newIndustrySuggested");
    if (updatedName || storedName) setName(updatedName || storedName);
    if (!storedDeferIndustry && (updatedIndustries || storedIndustries)) {
      // Convert string "[]" to parsable JSON
      storedIndustries = JSON.parse(updatedIndustries || storedIndustries);
      let match = [...industries, technologyInd]
        .filter((ind) =>
          (updatedIndustries || storedIndustries).includes(ind?.id)
        )
        .map((ind) => ind.id);
      setIndustriesSelected(match);
    }
    if (updatedIndustrySuggested || storedIndustrySuggested)
      setIndustrySuggested(updatedIndustrySuggested || storedIndustrySuggested);
    if (updatedDeferIndustry || storedDeferIndustry) {
      setDeferIndustry("true");
    }
    if (updatedCompanySize || storedCompanySize)
      setCompanySize(updatedCompanySize || storedCompanySize);
  }, []);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  useEffect(() => {
    let mql = window.matchMedia(
      `(min-width: ${theme.layout.breakPoints.small})`
    );
    if (mql.matches) {
      setColumnCount(3);
    } else {
      setColumnCount(2);
    }
  }, [width]);

  const handleSelect = (industry) => {
    let nextIndustriesSelected = [...industriesSelected];
    const isSelected = industriesSelected.includes(industry);

    if (isSelected) {
      const index = industriesSelected.indexOf(industry);
      nextIndustriesSelected.splice(index, 1);
    } else if (industriesSelected.length < MAX_COUNT) {
      nextIndustriesSelected.push(industry);
    }
    setIndustriesSelected(nextIndustriesSelected);
  };

  const handleSubmit = () => {
    setLoading(true);
    removeItem("newIndustries");
    removeItem("newIndustrySuggested");
    removeItem("newDeferIndustry");
    removeItem("newCompanySize");
    if (
      getItem("editIndustrySuggested") !== industrySuggested &&
      industrySuggested
    ) {
      setItem("newIndustrySuggested", industrySuggested);
    }
    if (
      getItem("editDeferIndustry") !== deferIndustry ||
      (industriesSelected.length < 1 && !industrySuggested)
    ) {
      setDeferIndustry("true");
      setItem("newDeferIndustry", "true");
    }
    if (getItem("editCompanySize") !== companySize) {
      setItem("newCompanySize", companySize);
    }
    if (getItem("editIndustries") !== JSON.stringify(industriesSelected)) {
      setItem("newIndustries", JSON.stringify(industriesSelected));
    }
    if (!companySize) {
      setCompanySize("N/A");
      setItem("newCompanySize", "N/A");
    }
    setTimeout(() => {
      router.push({ pathname: FORM_LINKS[3] });
    }, 500);
  };
  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader>
        <ProgressBar
          headline="REQUESTING CHANGES (3/3)"
          label="Company / Industry"
          currentCount={3}
          totalCount={3}
        />
      </JoinHeader>
      <div className="container">
        <Heading>Requesting changes for {name}</Heading>
        <section
          style={{
            margin: "0 auto 1rem",
            maxWidth: theme.layout.width.interior,
          }}
        >
          {error && (
            <ErrorMessage headline={error.headline} body={error.body} />
          )}

          <div style={{ marginBottom: "2rem" }}>
            <Label
              label="Which of the following best describes the industrie(s) that you work within?"
              labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
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
                        deferIndustry === "true"
                      }
                      selected={
                        industriesSelected.includes(technologyInd.id) &&
                        !deferIndustry
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
                      disabled={isDisabled || deferIndustry === "true"}
                      selected={isSelected && !deferIndustry}
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
                  <Selectable
                    headline={"N/A, or Prefer Not to Answer"}
                    fullWidth
                    disabled={isMaxSelected && !deferIndustry}
                    selected={deferIndustry === "true"}
                    onClick={() =>
                      setDeferIndustry(
                        deferIndustry === "true" ? undefined : "true"
                      )
                    }
                  />
                  {showSuggestButton ? (
                    <Selectable
                      headline={
                        industrySuggested
                          ? `${industrySuggested}`
                          : "+ Add industry"
                      }
                      onClick={() => setShowSuggestButton(false)}
                      selected={!!industrySuggested && !deferIndustry}
                      disabled={
                        (isMaxSelected && !!!industrySuggested) ||
                        deferIndustry === "true"
                      }
                      fullWidth
                      centered
                      variant={SelectableVariant.Alt}
                      onClear={
                        industrySuggested && !deferIndustry
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
    </>
  );
}
