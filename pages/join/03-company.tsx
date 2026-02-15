import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import Label from "@/components/form/Label";
import ProgressBar from "@/components/form/ProgressBar";
import RadioBox from "@/components/form/RadioBox";
import Selectable, {
  SelectableGrid,
  SelectableVariant,
} from "@/components/form/Selectable";
import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import { getFilters } from "@/lib/firebase-helpers/filters";
import { CompanySizeEnum, FirebaseTablesEnum } from "@/lib/enums";
import { useStorage, useWindowWidth } from "@/lib/hooks";
import { FORM_LINKS, useInvalid } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import { scrollToTop } from "../../helpers";

export async function getStaticProps() {
  const industries = (await getFilters(FirebaseTablesEnum.INDUSTRIES)) ?? [];
  return {
    props: {
      industries: industries,
      pageTitle: "Join · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

const MAX_COUNT = 3;
const TECHNOLOGY_LABEL = "Internet / Technology";

export default function JoinStep3({ industries, pageTitle }) {
  const { getItem, setItem, removeItem } = useStorage();
  const router = useRouter();
  const width = useWindowWidth();

  const [companySize, setCompanySize] = useState<string>();
  const [industrySuggested, setIndustrySuggested] = useState("");
  const [deferIndustry, setDeferIndustry] = useState<"true">();
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([]);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error] = useState<ErrorMessageProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [columnCount, setColumnCount] = useState<2 | 3>(3);

  const totalIndustriesSelected =
    industriesSelected.length + (industrySuggested ? 1 : 0);
  const isMaxSelected = totalIndustriesSelected >= MAX_COUNT;

  const technologyInd =
    industries.find((item) => item.name === TECHNOLOGY_LABEL) || null;
  if (technologyInd) {
    industries = [
      ...industries.filter((item) => item.name !== TECHNOLOGY_LABEL),
    ];
  }

  // check invalid situation via previous required entries
  useInvalid({ currentPage: "03-company" });

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedIndustries = getItem("jfIndustries");
    const storedDeferIndustry = getItem("jfDeferIndustry");
    const storedCompanySize = getItem("jfCompanySize");
    const storedIndustrySuggested = getItem("jfIndustrySuggested");
    if (!storedDeferIndustry && storedIndustries) {
      // Convert string "[]" to parsable JSON
      storedIndustries = JSON.parse(storedIndustries);
      const match = [...industries, technologyInd]
        .filter((ind) => storedIndustries.includes(ind?.id))
        .map((ind) => ind.id);
      setIndustriesSelected(match);
    }
    if (!storedDeferIndustry && storedIndustrySuggested)
      setIndustrySuggested(storedIndustrySuggested);
    if (storedDeferIndustry) {
      setDeferIndustry("true");
    }
    if (storedCompanySize) setCompanySize(storedCompanySize);
  }, []);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${theme.layout.breakPoints.small})`,
    );
    if (mql.matches) {
      setColumnCount(3);
    } else {
      setColumnCount(2);
    }
  }, [width]);

  const handleSelect = (industry) => {
    const nextIndustriesSelected = [...industriesSelected];
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
    if (industriesSelected.length > 0) {
      setItem("jfIndustries", JSON.stringify(industriesSelected));
    } else {
      removeItem("jfIndustries");
    }
    if (industrySuggested) {
      setItem("jfIndustrySuggested", industrySuggested);
    } else {
      removeItem("jfIndustrySuggested");
    }
    if (
      deferIndustry ||
      (industriesSelected.length < 1 && !industrySuggested)
    ) {
      setDeferIndustry("true");
      setItem("jfDeferIndustry", "true");
    } else {
      removeItem("jfDeferIndustry");
    }
    if (companySize) {
      setItem("jfCompanySize", companySize);
    } else {
      setCompanySize("N/A");
      setItem("jfCompanySize", "N/A");
    }
    setTimeout(() => {
      router.push({ pathname: FORM_LINKS[3] });
    }, 500);
  };
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backLinkTo="02-work" variant="minimized" />

      <Heading>Welcome to our little hui.</Heading>
      <section className="mx-auto mb-4 mt-0 max-w-3xl space-y-6 px-8">
        {error && <ErrorMessage headline={error.headline} body={error.body} />}
        <section className="space-y-4">
          <Label
            label="Which of the following best describes the industrie(s) that you work within?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
          />
          <SelectableGrid columns={columnCount}>
            {technologyInd && (
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
                gridSpan={columnCount}
              />
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
                  onClick={() => handleSelect(industry.id)}
                  key={`ind-${i}`}
                />
              );
            })}
            <div
              className="grid auto-rows-fr grid-cols-1 gap-2"
              style={{
                gridTemplateColumns: "1fr 1fr",
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
                    deferIndustry === "true" ? undefined : "true",
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
                  variant={SelectableVariant.Blank}
                  onClear={
                    industrySuggested && !deferIndustry
                      ? () =>
                          window.confirm(
                            "Are you sure you want to clear this field?",
                          ) && setIndustrySuggested("")
                      : undefined
                  }
                />
              ) : (
                <Input
                  autoFocus
                  name="add-field"
                  centered
                  fullHeight
                  onChange={(e) => {
                    setIndustrySuggested(e.target.value);
                  }}
                  onBlur={() => setShowSuggestButton(true)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") setShowSuggestButton(true);
                  }}
                  value={industrySuggested}
                  disabled={isMaxSelected && !!!industrySuggested}
                />
              )}
            </div>
          </SelectableGrid>
          {!showSuggestButton || industrySuggested ? (
            <ErrorMessage
              headline="Please suggest with care 🤙🏽"
              body={`Suggesting a new label increases the time it takes to approve your entry, as we manually review all submissions. Please consider any existing labels that might fit 
          your situation.`}
              warning
            />
          ) : null}
        </section>
        <section className="space-y-4">
          <Label
            label="How many employees work at your company?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
          />
          <div className={`flex flex-wrap gap-2`}>
            {Object.values(CompanySizeEnum).map((size, i) => (
              <RadioBox
                seriesOf="company-size"
                checked={size === companySize}
                label={size}
                onChange={() => setCompanySize(size)}
                key={`size-${i}`}
              />
            ))}
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
      </section>

      <div className="mt-6 pb-12">
        <ProgressBar currentCount={3} totalCount={4} width="6.4rem" />
      </div>
    </>
  );
}
