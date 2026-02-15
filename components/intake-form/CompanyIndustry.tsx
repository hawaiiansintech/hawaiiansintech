import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Label from "@/components/form/Label";
import RadioBox from "@/components/form/RadioBox";
import { Filter } from "@/lib/firebase-helpers/interfaces";
import { CompanySizeEnum } from "@/lib/enums";
import { useWindowWidth } from "@/lib/hooks";
import { scrollToTop } from "helpers";
import React, { useEffect, useState } from "react";
import theme from "styles/theme";
import Input from "../form/Input";
import Selectable, {
  SelectableGrid,
  SelectableVariant,
} from "../form/Selectable";

const MAX_COUNT = 3;
const TECHNOLOGY_LABEL = "Internet / Technology";

export interface CompanyIndustryInitialProps {
  industries?: Filter[];
  industriesSelected?: string[];
  industrySuggested?: string;
  deferIndustry?: "true" | undefined;
  companySize?: string;
}

interface CompanyIndustryProps {
  initial: CompanyIndustryInitialProps;
  onSubmit?: (CompanyIndustryInitialProps) => void;
  showNew?: boolean;
}

export default function CompanyIndustry({
  initial,
  onSubmit,
  showNew,
}: CompanyIndustryProps) {
  const width = useWindowWidth();
  let industries: Filter[] = initial.industries;
  const [industriesSelected, setIndustriesSelected] = useState<string[]>(
    initial.industriesSelected,
  );
  const [industrySuggested, setIndustrySuggested] = useState<string>();
  const [deferIndustry, setDeferIndustry] = useState<"true">();
  const [companySize, setCompanySize] = useState<string>(initial.companySize);
  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [error] = useState<ErrorMessageProps | null>(null);
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

  useEffect(() => {
    setCompanySize(initial.companySize);
    setIndustriesSelected(initial.industriesSelected);
    setDeferIndustry(initial?.industries?.length === 0 ? "true" : undefined);
  }, [initial.companySize, initial.industriesSelected]);

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
    if (companySize === "") {
      setCompanySize("N/A");
    }
    if (industriesSelected.length === 0 && !industrySuggested) {
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
      <section className="mx-auto mb-4 mt-0 max-w-3xl space-y-6 px-8">
        {error && <ErrorMessage headline={error.headline} body={error.body} />}
        <section className="space-y-4">
          <Label
            label="Which of the following best describes the industrie(s) that you work within?"
            labelTranslation="Ehia ka poʻe e hana ma kou wahi hana?"
            tagged={
              showNew && initial.industriesSelected.length === 0
                ? "NEW"
                : undefined
            }
          />
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
            tagged={showNew && initial.companySize === "" ? "NEW" : undefined}
          />
          <div className={`flex flex-wrap gap-2`}>
            {Object.values(CompanySizeEnum).map((size, i) => {
              return (
                <RadioBox
                  seriesOf="company-size"
                  checked={size === companySize}
                  label={size}
                  onChange={() => setCompanySize(size)}
                  key={`size-${i}`}
                />
              );
            })}
          </div>
        </section>
        <section className="mx-auto max-w-md px-4">
          <Button
            fullWidth
            onClick={handleSubmit}
            loading={loading}
            type="submit"
          >
            Continue
          </Button>
        </section>
      </section>
    </>
  );
}
