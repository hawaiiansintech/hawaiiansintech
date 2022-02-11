import Button from "@/components/Button";
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
import { useStorage } from "@/lib/hooks";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { scrollToTop } from "../../helpers.js";

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

  const [focusesSelected, setFocusesSelected] = useState<string[]>([]);
  const [focusSuggested, setFocusSuggested] = useState<string>("");
  const [title, setTitle] = useState<string>("");
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
    if (storedTitle) setTitle(storedTitle);
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

  const totalFocusesSelected =
    focusesSelected.length + (focusSuggested ? 1 : 0);
  const isMaxSelected = totalFocusesSelected >= MAX_COUNT;

  useEffect(() => {
    const isValid = totalFocusesSelected >= 1 && !!yearsExperience;
    setIsValid(isValid);
    if (isValid) setError(undefined);
  }, [yearsExperience, focusSuggested, focusesSelected]);

  const handleSelect = (focusID: string) => {
    let newFocusesSelected = [...focusesSelected];
    const index = focusesSelected.indexOf(focusID);
    const isSelected = index > -1;
    if (isSelected) {
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
    // Set as stringified array
    if (focusesSelected.length) {
      setItem("jfFocuses", JSON.stringify(focusesSelected));
    } else {
      removeItem("jfFocuses");
    }
    if (focusSuggested) {
      setItem("jfFocusSuggested", focusSuggested);
    } else {
      removeItem("jfFocusSuggested");
    }
    if (title) {
      setItem("jfTitle", title);
    } else {
      removeItem("jfTitle");
    }
    setItem("jfYearsExperience", yearsExperience);
    router.push({
      pathname: NEXT_PAGE,
    });
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
        label="What You Do"
        currentCount={2}
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
        <Label
          label="Which of the following best describes your field of work?"
          labelTranslation="He aha kou (mau) hana ʻoi a pau?"
          hint={
            <>
              <strong>
                We'll sort you (and others) by logically-grouped, broad
                expertises in the directory.
              </strong>{" "}
              <em>Select up to 3</em>, if you're a special unicorn!
            </>
          }
        />
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
          <Input
            name="title"
            label="What’s your current title?"
            labelTranslation="ʻO wai kou kūlana i hana?"
            placeholder="e.g. Software Engineer"
            value={title}
            labelHint={
              <>
                <strong>Titles are optional.</strong> Jobs and titles often
                come-and-go. We care more about <em>what you do</em> than what
                they call you.
              </>
            }
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <Label
            label="How many years of experience do you have in your field?"
            labelTranslation="Ehia ka makahiki o kou hana ʻana ma kou ʻoi hana?"
            hint={
              <>
                <strong>
                  This is a loose proxy to where you're at in your career.
                </strong>{" "}
                It was either this or "
                <em>Eh, really, how good you stay at this?</em>"
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
