import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import InputBox from "@/components/form/InputBox";
import Label from "@/components/form/Label";
import RadioBox from "@/components/form/RadioBox";
import { Industry } from "@/lib/api";
import { useWindowWidth } from "@/lib/hooks";
import { scrollToTop } from "helpers";
import React, { useEffect, useState } from "react";
import theme from "styles/theme";
import Selectable, {
  SelectableGrid,
  SelectableVariant,
} from "../form/Selectable";

const MAX_COUNT = 3;
const TECHNOLOGY_LABEL = "Internet / Technology";

export interface CompanyIndustryInitialProps {
  industry?: string[];
  industrySuggested?: string;
  industryDeferred?: boolean;
  companySize?: string;
}

interface CompanyIndustryProps {
  industryIndex?: Industry[];
  initial: CompanyIndustryInitialProps;
  onSubmit?: (CompanyIndustryInitialProps) => void;
  showNew?: boolean;
}

export default function CompanyIndustry({
  industryIndex,
  initial,
  onSubmit,
  showNew,
}: CompanyIndustryProps) {
  const width = useWindowWidth();
  const [industry, setIndustry] = useState<string[]>(initial.industry);
  const [industrySuggested, setIndustrySuggested] = useState<string>();
  const [industryDeferred, setDeferIndustry] = useState<boolean>();
  const [companySize, setCompanySize] = useState<string>(initial.companySize);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [columnCount, setColumnCount] = useState<2 | 3>(3);

  const totalIndustriesSelected = industry.length + (industrySuggested ? 1 : 0);
  const isMaxSelected = totalIndustriesSelected >= MAX_COUNT;

  let technologyInd =
    industryIndex.find((ind) => ind.name === TECHNOLOGY_LABEL) || null;
  if (technologyInd) {
    industryIndex = [
      ...industryIndex.filter((ind) => ind.name !== TECHNOLOGY_LABEL),
    ];
  }

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

  useEffect(() => {
    setCompanySize(initial.companySize);
    setIndustry(initial.industry);
    setDeferIndustry(industry?.length === 0);
  }, [initial.companySize, initial.industry]);

  const handleSelect = (industry) => {
    let nextIndustriesSelected = [...industry];
    const isSelected = industry.includes(industry);

    if (isSelected) {
      const index = industry.indexOf(industry);
      nextIndustriesSelected.splice(index, 1);
    } else if (industry.length < MAX_COUNT) {
      nextIndustriesSelected.push(industry);
    }
    setIndustry(nextIndustriesSelected);
  };

  const handleSubmit = () => {
    setLoading(true);
    const shouldDelay =
      companySize === "" || (industry.length === 0 && !industrySuggested);
    if (companySize === "") {
      setCompanySize("N/A");
    }
    if (industry.length === 0 && !industrySuggested) {
      setDeferIndustry(true);
    }
    setTimeout(
      () => {
        onSubmit({
          industry: industry,
          industryDeferred: industryDeferred,
          industrySuggested: industrySuggested,
          companySize: companySize,
        });
      },
      shouldDelay ? 500 : 0
    );
  };

  return (
    <>
      <section
        style={{
          margin: "0 auto 1rem",
          padding: "0 2rem",
          maxWidth: theme.layout.width.interior,
        }}
      >
        {error && <ErrorMessage headline={error.headline} body={error.body} />}

        <div style={{ marginBottom: "2rem" }}>
          <Label
            label="Which of the following best describes the industrie(s) that you work within?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
            tagged={
              showNew && initial.industry.length === 0 ? "NEW" : undefined
            }
          />
          <div style={{ margin: "1rem auto 2rem" }}>
            <SelectableGrid columns={columnCount}>
              {technologyInd && (
                <Selectable
                  headline={technologyInd.name}
                  gridSpan={columnCount}
                  disabled={
                    (isMaxSelected && !industry.includes(technologyInd.id)) ||
                    industryDeferred
                  }
                  selected={
                    industry.includes(technologyInd.id) && !industryDeferred
                  }
                  onClick={() => handleSelect(technologyInd.id)}
                  fullWidth
                />
              )}
              {industryIndex.map((ind, i: number) => {
                const isDisabled = isMaxSelected && !industry.includes(ind.id);
                const isSelected = industry.includes(ind.id);

                return (
                  <Selectable
                    headline={ind.name}
                    disabled={isDisabled || industryDeferred}
                    selected={isSelected && !industryDeferred}
                    onClick={(e) => handleSelect(ind.id)}
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
                  disabled={isMaxSelected && !industryDeferred}
                  selected={industryDeferred}
                  onClick={() => setDeferIndustry(!industryDeferred)}
                />
                {showSuggestButton ? (
                  <Selectable
                    headline={
                      industrySuggested
                        ? `${industrySuggested}`
                        : "+ Add industry"
                    }
                    onClick={() => setShowSuggestButton(false)}
                    selected={!!industrySuggested && !industryDeferred}
                    disabled={
                      (isMaxSelected && !!!industrySuggested) ||
                      industryDeferred
                    }
                    fullWidth
                    centered
                    variant={SelectableVariant.Alt}
                    onClear={
                      industrySuggested && !industryDeferred
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
            tagged={showNew && initial.companySize === "" ? "NEW" : undefined}
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
            ].map((size, i) => {
              return (
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
              );
            })}
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
    </>
  );
}
