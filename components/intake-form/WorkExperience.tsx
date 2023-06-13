import Button from "@/components/Button";
import CheckBox from "@/components/form/CheckBox";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import InputBox from "@/components/form/InputBox";
import Label from "@/components/form/Label";
import RadioBox from "@/components/form/RadioBox";
import { Filter } from "@/lib/api";
import { YearsOfExperienceEnum } from "@/lib/enums";
import { useWindowWidth } from "@/lib/hooks";
import { MAX_FOCUS_COUNT } from "@/lib/utils";
import { scrollToTop } from "helpers";
import React, { useEffect, useState } from "react";
import theme from "styles/theme";
import Selectable, {
  SelectableGrid,
  SelectableVariant,
} from "../form/Selectable";

export interface WorkExperienceInitialProps {
  focuses?: Filter[];
  deferTitle?: "true" | undefined;
  focusesSelected?: string[];
  focusSuggested?: string;
  title?: string;
  yearsExperience?: string;
}

interface WorkExperienceProps {
  initial: WorkExperienceInitialProps;
  onSubmit?: (WorkExperienceInitialProps) => void;
  showNew?: boolean;
}

export default function WorkExperience({
  initial,
  onSubmit,
  showNew,
}: WorkExperienceProps) {
  const width = useWindowWidth();
  const [columnCount, setColumnCount] = useState<2 | 3>(3);
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showSuggestButton, setShowSuggestButton] = useState(true);

  const [focusesSelected, setFocusesSelected] = useState<string[]>(
    initial.focusesSelected
  );
  const [focusSuggested, setFocusSuggested] = useState<string>(
    initial.focusSuggested
  );
  const [title, setTitle] = useState<string>(initial.title);
  const [deferTitle, setDeferTitle] = useState<"true">(initial.deferTitle);
  const [yearsExperience, setYearsExperience] = useState<string>(
    initial.yearsExperience
  );
  const totalFocusesSelected =
    focusesSelected?.length + (focusSuggested ? 1 : 0);
  const isMaxSelected = totalFocusesSelected >= MAX_FOCUS_COUNT;

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
    const isValid = totalFocusesSelected >= 1 && !!yearsExperience;
    if (isValid) setError(undefined);
    setIsValid(isValid);
  }, [yearsExperience, focusSuggested, focusesSelected]);

  useEffect(() => {
    setFocusesSelected(initial.focusesSelected);
    setYearsExperience(initial.yearsExperience);
    setTitle(initial.title);
    setDeferTitle(initial.deferTitle);
  }, [
    initial.focusesSelected,
    initial.yearsExperience,
    initial.title,
    initial.deferTitle,
  ]);

  const handleSelect = (focusID: string) => {
    let newFocusesSelected = [...focusesSelected];
    const isSelected = focusesSelected?.includes(focusID);
    if (isSelected) {
      const index = focusesSelected?.indexOf(focusID);
      newFocusesSelected.splice(index, 1);
    } else if (focusesSelected?.length < MAX_FOCUS_COUNT) {
      newFocusesSelected.push(focusID);
    }
    setFocusesSelected(newFocusesSelected);
  };

  const handleSubmit = () => {
    if (!isValid) {
      setError({
        headline: "Fields missing below.",
        body: "Please fill all required fields below.",
      });
      return;
    }
    if (!title) setDeferTitle("true");
    setLoading(true);
    onSubmit({
      focusesSelected: focusesSelected,
      focusSuggested: focusSuggested,
      title: title,
      deferTitle: deferTitle,
      yearsExperience: yearsExperience,
    });
  };

  return (
    <>
      <section className="max-w-3xl px-8 mt-0 mx-auto mb-4 space-y-6">
        {error && <ErrorMessage headline={error.headline} body={error.body} />}
        <section className="space-y-4">
          <Label
            label="Which of the following best describes your field of work?"
            labelTranslation="He aha kou (mau) hana ʻoi a pau?"
            tagged={
              showNew && initial.focusesSelected.length === 0
                ? "NEW"
                : undefined
            }
          />
          <SelectableGrid columns={columnCount}>
            {initial.focuses.map((focus, i: number) => {
              const isDisabled =
                isMaxSelected && !focusesSelected?.includes(focus.id);
              const isSelected = focusesSelected?.includes(focus.id);

              return (
                <Selectable
                  headline={focus.name}
                  disabled={isDisabled}
                  selected={isSelected}
                  onClick={(e) => handleSelect(focus.id)}
                  key={`Selectable-${i}-`}
                />
              );
            })}
            <div
              style={{
                gridColumn: `span ${
                  Math.ceil(initial.focuses.length / columnCount) *
                    columnCount -
                    initial.focuses.length || columnCount
                }`,
              }}
            >
              {showSuggestButton ? (
                <Selectable
                  centered
                  headline={
                    focusSuggested
                      ? `${focusSuggested}`
                      : "+ Add technical / industry field"
                  }
                  onClick={() => setShowSuggestButton(false)}
                  selected={!!focusSuggested}
                  disabled={isMaxSelected && !!!focusSuggested}
                  fullWidth
                  variant={SelectableVariant.Alt}
                  onClear={
                    focusSuggested
                      ? () =>
                          window.confirm(
                            "Are you sure you want to clear this field?"
                          ) && setFocusSuggested("")
                      : undefined
                  }
                />
              ) : (
                <InputBox
                  fullWidth
                  border
                  focusedOnInit
                  onChange={(e) => {
                    setFocusSuggested(e.target.value);
                  }}
                  onBlur={() => setShowSuggestButton(true)}
                  onEnter={() => setShowSuggestButton(true)}
                  value={focusSuggested}
                  disabled={isMaxSelected && !!!focusSuggested}
                />
              )}
            </div>
          </SelectableGrid>

          {!showSuggestButton || focusSuggested ? (
            <ErrorMessage
              headline="Please suggest with care 🤙🏽"
              body={`As we manually review all submissions, suggesting a new 
        label increases the time it takes to approve your entry. To be mindful of this, please consider any existing labels might fit 
        your situation.`}
              warning
            />
          ) : null}
        </section>

        <section className="space-y-4">
          <Label
            label="How many years of experience do you have in your field?"
            labelTranslation="Ehia ka makahiki o kou hana ʻana ma kou ʻoi hana?"
            tagged={
              showNew && initial.yearsExperience === "" ? "NEW" : undefined
            }
          />
          <div className="flex flex-wrap mx-auto mb-8">
            {Object.values(YearsOfExperienceEnum).map((dur) => (
              <div className="mr-2 mb-2">
                <RadioBox
                  seriesOf="years-experience"
                  checked={dur === yearsExperience}
                  label={dur}
                  onChange={() => setYearsExperience(dur)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Input
            name="title"
            label="What’s your current title?"
            labelTranslation="ʻO wai kou kūlana i hana?"
            placeholder="e.g. Software Engineer"
            value={deferTitle === "true" ? " " : title}
            disabled={deferTitle === "true"}
            onChange={(e) => setTitle(e.target.value)}
            labelTagged={showNew && initial.title === "" ? "NEW" : undefined}
          />

          <CheckBox
            checked={deferTitle === "true"}
            label={"N/A, or Prefer not to answer"}
            id="defer-title"
            onClick={() =>
              setDeferTitle(deferTitle === "true" ? undefined : "true")
            }
          />
        </section>
        <section className="max-w-md mx-auto">
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
