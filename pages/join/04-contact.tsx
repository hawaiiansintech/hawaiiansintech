import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import TurnstileWidget from "@/components/TurnstileWidget";
import { Checkbox } from "@/components/ui/checkbox";
import { useStorage } from "@/lib/hooks";
import { useClearAllStoredFields, useInvalid } from "@/lib/utils";
import { Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Join · Hawaiians in Technology",
    },
  };
}

export default function JoinStep4({ pageTitle }) {
  const router = useRouter();
  const { getItem } = useStorage();
  const clearAllStoredFields = useClearAllStoredFields();
  const [email, setEmail] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [focusesSelected, setFocusesSelected] = useState<string[]>([]);
  const [focusSuggested, setFocusSuggested] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([]);
  const [industrySuggested, setIndustrySuggested] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [yearsExperience, setYearsExperience] = useState<string>();
  const [subscribed] = useState<boolean>(true);

  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorMessageProps>(undefined);

  const [turnstileToken, setTurnstileToken] = useState<string>(null);
  const [widgetKey, setWidgetKey] = useState<number>(0);

  const createMember = async (): Promise<Response> => {
    return fetch("/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        location,
        website,
        focusesSelected,
        focusSuggested,
        title,
        yearsExperience,
        industriesSelected,
        industrySuggested,
        companySize,
        email,
        unsubscribed: !subscribed,
        turnstileToken,
      }),
    });
  };

  // check invalid situation via previous required entries
  useInvalid({ currentPage: "04-contact" });

  // check localStorage and set pre-defined fields
  useEffect(() => {
    const storedName = getItem("jfName");
    const storedLocation = getItem("jfLocation");
    const storedWebsite = getItem("jfWebsite");
    const storedFocuses = getItem("jfFocuses");
    const storedFocusSuggested = getItem("jfFocusSuggested");
    const storedTitle = getItem("jfTitle");
    const storedYearsExperience = getItem("jfYearsExperience");
    const storedIndustries = getItem("jfIndustries");
    const storedIndustrySuggested = getItem("jfIndustrySuggested");
    const storedCompanySize = getItem("jfCompanySize");

    if (storedName) setName(storedName);
    if (storedLocation) setLocation(storedLocation);
    if (storedWebsite) setWebsite(storedWebsite);
    if (storedFocuses) setFocusesSelected(JSON.parse(storedFocuses));
    if (storedFocusSuggested) setFocusSuggested(storedFocusSuggested);
    if (storedTitle) setTitle(storedTitle);
    if (storedYearsExperience) setYearsExperience(storedYearsExperience);
    if (storedIndustries) setIndustriesSelected(JSON.parse(storedIndustries));
    if (storedIndustrySuggested) setIndustrySuggested(storedIndustrySuggested);
    if (storedCompanySize) setCompanySize(storedCompanySize);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(undefined);
    const res: Response = await createMember();
    const resJSON = await res.json();
    if (res.ok) {
      clearAllStoredFields("jf");
      router.push({
        pathname: "thank-you",
        query: {
          // Passes the selected values to the thank-you page
          focusesSelected: focusesSelected,
          industriesSelected: industriesSelected,
        },
      });
    } else if (res.status === 422) {
      setLoading(false);
      setError({
        headline: resJSON.error,
        body: resJSON.body,
      });
    } else if (res.status === 409) {
      setLoading(false);
      setError({
        headline: "Looks like that email is already in use.",
        body: resJSON.body,
      });
    } else if (
      resJSON.message &&
      resJSON.message.includes("Turnstile verification failed")
    ) {
      setWidgetKey((prevKey) => prevKey + 1); // re-render the TurnstileWidget
      setLoading(false);
      setError({
        headline: "There was an issue with the cloudflare check.",
        body: "Please take a look at the box below and try again.",
      });
    } else {
      setLoading(false);
      setError({
        headline: "Gonfunnit, looks like something went wrong!",
        body: "Please try again later.",
      });
    }
  };

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backLinkTo="03-company" variant="minimized" />

      <Heading>Welcome to our little hui.</Heading>

      <section className="mx-auto mb-4 max-w-3xl px-8">
        {error && (
          <div style={{ marginBottom: "1rem" }}>
            <ErrorMessage headline={error.headline} body={error.body} />
          </div>
        )}
        <Formik
          enableReinitialize
          initialValues={{ email: email }}
          validateOnBlur={validateAfterSubmit}
          validateOnChange={validateAfterSubmit}
          validate={() => setValidateAfterSubmit(true)}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("That email doesn't look right. Please try again.")
              .required(
                "It's important that we can reach you. Email is required.",
              ),
          })}
        >
          {(props) => {
            return (
              <form
                onSubmit={props.handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="flex gap-4 rounded-lg bg-tan-300 p-4">
                  <span className="text-3xl">🤫</span>
                  <p>
                    <strong>
                      We treat your email address as private information
                    </strong>
                    . We wonʻt share it without your explicit consent.{" "}
                    <Link
                      href="/terms-of-use#joining-the-directory"
                      target="_blank"
                    >
                      Learn more
                    </Link>
                  </p>
                </div>
                <Input
                  name="email"
                  label="What’s your email?"
                  labelTranslation="He aha kou wahi leka uila?"
                  onBlur={props.handleBlur}
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={props.touched.email && props.errors.email}
                />
                <div className="flex gap-x-2">
                  <Checkbox name="send-me-emails" id="send-me-emails" />
                  <label
                    htmlFor="send-me-emails"
                    className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Let me know about{" "}
                    <strong className="font-semibold">
                      features and community updates
                    </strong>{" "}
                    <span className="text-stone-500">(~once a month)</span>.
                  </label>
                </div>
                <p className="my-2 text-center text-xs text-secondary-foreground">
                  By continuing, you confirm that you&rsquo;ve agreed to our{" "}
                  <Link
                    href="/terms-of-use"
                    target="_blank"
                    className="text-stone-500 underline hover:text-stone-600"
                  >
                    Terms of Use &amp; Privacy Policy
                  </Link>
                  .
                </p>

                <div className="mx-auto w-full max-w-md px-4">
                  <Button fullWidth loading={loading} type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>
      </section>
      <div className="mt-6">
        <ProgressBar currentCount={4} totalCount={4} width="6.4rem" />
      </div>
      <div className="mt-8 flex justify-center pb-12">
        <TurnstileWidget
          key={widgetKey}
          onVerify={setTurnstileToken}
        ></TurnstileWidget>{" "}
      </div>
    </>
  );
}
