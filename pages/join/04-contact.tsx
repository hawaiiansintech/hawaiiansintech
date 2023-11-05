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
import { Checkbox } from "@/components/ui/checkbox";
import { useStorage } from "@/lib/hooks";
import { clearAllStoredFields, useInvalid } from "@/lib/utils";
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
  const { getItem, setItem, removeItem } = useStorage();
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
  const [subscribed, setSubscribed] = useState<boolean>(true);

  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorMessageProps>(undefined);

  const createMember = async () => {
    return new Promise((resolve, reject) => {
      fetch("/api/create-member", {
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
        }),
      }).then(
        (response: Response) => {
          resolve(response);
        },
        (error: Response) => {
          reject(error);
        }
      );
    });
  };

  // check invalid situation via previous required entries
  useInvalid({ currentPage: "04-contact" });

  // check localStorage and set pre-defined fields
  useEffect(() => {
    let storedName = getItem("jfName");
    let storedLocation = getItem("jfLocation");
    let storedWebsite = getItem("jfWebsite");
    let storedFocuses = getItem("jfFocuses");
    let storedFocusSuggested = getItem("jfFocusSuggested");
    let storedTitle = getItem("jfTitle");
    let storedYearsExperience = getItem("jfYearsExperience");
    let storedIndustries = getItem("jfIndustries");
    let storedIndustrySuggested = getItem("jfIndustrySuggested");
    let storedCompanySize = getItem("jfCompanySize");

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

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(undefined);
    const res: Response | any = await createMember();
    const resJSON = await res.json();
    if (res.ok) {
      clearAllStoredFields("jf");
      router.push({ pathname: "thank-you" });
    } else if (res.status === 422) {
      setLoading(false);
      setError({
        headline: resJSON.error,
        body: resJSON.body,
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
      <Nav backUrl="03-company" />

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
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("That email doesn't look right. Please try again.")
              .required(
                "It's important that we can reach you. Email is required."
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
                    . We wonʻt share it without your explicit consent. Only
                    trusted members of our administrative hui will have access
                    to this contact information.{" "}
                    <Link
                      href="/privacy-policy#joining-the-directory"
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
                    Please let me know about{" "}
                    <strong className="font-semibold">
                      features and community updates
                    </strong>{" "}
                    <span className="text-stone-500">(~once a month)</span>.
                  </label>
                </div>
                <p className="my-2 text-center text-xs text-secondary-foreground">
                  By continuing, you confirm that you're 13 years or older and
                  that you've read and agreed to the{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-stone-500 underline hover:text-stone-600"
                  >
                    Privacy Policy
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
      <ProgressBar currentCount={4} totalCount={4} width="6.4rem" />
    </>
  );
}
