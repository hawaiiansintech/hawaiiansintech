import Button from "@/components/Button";
import CheckBox from "@/components/form/CheckBox";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
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
import { getFocuses } from "@/lib/api";
import { useStorage, useWindowWidth } from "@/lib/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import { scrollToTop } from "../../helpers";
import JoinHeader from "./components/join-header";

const NEXT_PAGE = "03-company";

export async function getStaticProps() {
  let focuses = (await getFocuses()) ?? [];
  return {
    props: {
      focuses: focuses.sort((a, b) => b.count - a.count),
    },
    revalidate: 60,
  };
}

const MAX_COUNT = 3;

export default function JoinStep2({ focuses }) {
  const router = useRouter();
  const { getItem, setItem, removeItem } = useStorage();
  const width = useWindowWidth();

  const [focusesSelected, setFocusesSelected] = useState<string[]>([]);
  const [focusSuggested, setFocusSuggested] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [deferTitle, setDeferTitle] = useState<"true" | "false">("false");
  const [yearsExperience, setYearsExperience] = useState<string>();

  const [showSuggestButton, setShowSuggestButton] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [columnCount, setColumnCount] = useState<2 | 3>(3);

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedFocuses = getItem("jfFocuses");
    let storedFocusSuggested = getItem("jfFocusSuggested");
    let storedTitle = getItem("jfTitle");
    let storedDeferTitle = getItem("jfDeferTitle");
    let storedYearsExperience = getItem("jfYearsExperience");
    if (storedFocuses) {
      // Convert string "[]" to parsable JSON
      storedFocuses = JSON.parse(storedFocuses);
      let match = focuses
        .filter((foc) => storedFocuses.includes(foc.id))
        .map((foc) => foc.id);
      setFocusesSelected(match);
    }
    if (storedFocusSuggested) setFocusSuggested(storedFocusSuggested);
    if (storedDeferTitle === "true") {
      setDeferTitle(storedDeferTitle);
      setTitle("");
    }
    if (storedDeferTitle !== "true" && storedTitle) setTitle(storedTitle);
    if (storedYearsExperience) setYearsExperience(storedYearsExperience);
  }, []);

  // check invalid situation via previous required entries
  useEffect(() => {
    const invalid =
      !getItem("jfName") || !getItem("jfLocation") || !getItem("jfWebsite");
    if (invalid) router.push({ pathname: "01-you", query: { r: "02" } });
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

  const totalFocusesSelected =
    focusesSelected.length + (focusSuggested ? 1 : 0);
  const isMaxSelected = totalFocusesSelected >= MAX_COUNT;

  useEffect(() => {
    const isValid = totalFocusesSelected >= 1 && !!yearsExperience;
    if (isValid) setError(undefined);
    setIsValid(isValid);
  }, [yearsExperience, focusSuggested, focusesSelected]);

  const handleSelect = (focusID: string) => {
    let newFocusesSelected = [...focusesSelected];
    const isSelected = focusesSelected.includes(focusID);
    if (isSelected) {
      const index = focusesSelected.indexOf(focusID);
      newFocusesSelected.splice(index, 1);
    } else if (focusesSelected.length < MAX_COUNT) {
      newFocusesSelected.push(focusID);
    }
    setFocusesSelected(newFocusesSelected);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!isValid) {
      setLoading(false);
      setError({
        headline: "Fields missing below.",
        body: "Please fill all required fields below.",
      });
      return;
    }
    // Clear pre-existing data
    removeItem("jfFocuses");
    removeItem("jfFocusSuggested");
    removeItem("jfTitle");
    removeItem("jfDeferTitle");
    removeItem("jfYearsExperience");
    // Set as stringified array
    if (focusesSelected) setItem("jfFocuses", JSON.stringify(focusesSelected));
    if (focusSuggested) setItem("jfFocusSuggested", focusSuggested);
    if (!title) setDeferTitle("true");
    if (deferTitle === "true" || !title) {
      setItem("jfDeferTitle", "true");
    }
    if (title) setItem("jfTitle", title);
    if (yearsExperience) setItem("jfYearsExperience", yearsExperience);
    router.push({
      pathname: NEXT_PAGE,
    });
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
          headline="Public"
          label="Talent Profile (1/2)"
          currentCount={2}
          totalCount={4}
        />
      </JoinHeader>
      <div className="container">
        <Heading>Welcome to our little hui.</Heading>
        <section
          style={{
            margin: "0 auto 1rem",
            maxWidth: theme.layout.width.interior,
          }}
        >
          {error && (
            <ErrorMessage headline={error.headline} body={error.body} />
          )}
          <div style={{ margin: "2rem 0" }}>
            <Label
              label="Which of the following best describes your field of work?"
              labelTranslation="He aha kou (mau) hana ʻoi a pau?"
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <SelectableGrid columns={columnCount}>
              {focuses.map((focus, i: number) => {
                const isDisabled =
                  isMaxSelected && !focusesSelected.includes(focus.id);
                const isSelected = focusesSelected.includes(focus.id);

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
                    Math.ceil(focuses.length / columnCount) * columnCount -
                      focuses.length || columnCount
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
          </div>
          <div style={{ margin: "2rem 0" }}>
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
                <div style={{ margin: "0 0.5rem 0.5rem 0" }} key={`dur-${dur}`}>
                  <RadioBox
                    seriesOf="years-experience"
                    checked={dur === yearsExperience}
                    label={dur}
                    onChange={() => setYearsExperience(dur)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ margin: "2rem 0" }}>
            <Input
              name="title"
              label="What’s your current title?"
              labelTranslation="ʻO wai kou kūlana i hana?"
              placeholder="e.g. Software Engineer"
              value={deferTitle === "true" ? " " : title}
              disabled={deferTitle === "true"}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div style={{ marginTop: "1rem", display: "inline-block" }}>
              <CheckBox
                checked={deferTitle === "true"}
                label={"N/A, or Prefer not to answer"}
                id="defer-title"
                onClick={() =>
                  setDeferTitle(deferTitle === "true" ? "false" : "true")
                }
              />
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
