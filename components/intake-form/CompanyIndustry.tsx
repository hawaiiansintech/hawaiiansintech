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
  industries?: Industry[];
  industriesSelected?: string[];
  industriesSuggested?: string;
  deferIndustry?: "true" | undefined;
  companySize?: string;
}

interface CompanyIndustryProps {
  initial: CompanyIndustryInitialProps;
  onSubmit?: (CompanyIndustryProps) => void;
}

export default function CompanyIndustry({
  initial,
  onSubmit,
}: CompanyIndustryProps) {
  const width = useWindowWidth();
  let industries: Industry[] = initial.industries;
  const [industriesSelected, setIndustriesSelected] = useState<string[]>(
    initial.industriesSelected
  );
  const [industrySuggested, setIndustrySuggested] = useState<string>();
  const [deferIndustry, setDeferIndustry] = useState<"true">();
  const [companySize, setCompanySize] = useState<string>(initial.companySize);
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
    setIndustriesSelected(initial.industriesSelected);
    setDeferIndustry(initial?.industries?.length === 0 ? "true" : undefined);
  }, [initial.companySize, initial.industriesSelected]);

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
    if (companySize === "") {
      setCompanySize("N/A");
    }
    if (industriesSelected.length === 0) {
      setDeferIndustry("true");
    }
    onSubmit({
      industriesSelected: industriesSelected,
      industrySuggested: industrySuggested,
      companySize: companySize,
    });
  };

  return (
    <>
      <section
        style={{
          margin: "0 auto 1rem",
          maxWidth: theme.layout.width.interior,
        }}
      >
        {error && <ErrorMessage headline={error.headline} body={error.body} />}

        <div style={{ marginBottom: "2rem" }}>
          <Label
            label="Which of the following best describes the industrie(s) that you work within?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
          />
          <div style={{ margin: "1rem auto 2rem" }}>
            <SelectableGrid columns={columnCount}>
              {technologyInd && (
                <Selectable
                  headline={technologyInd.name}
                  gridSpan={columnCount}
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
