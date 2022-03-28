import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import ProgressBar from "@/components/form/ProgressBar";
import { Heading, Subheading } from "@/components/Heading";
import MetaTags from "@/components/Metatags.js";
import { useStorage } from "@/lib/hooks";
import { Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import * as Yup from "yup";
import { clearAllStoredFields } from "./01-you";
import JoinHeader from "./components/join-header";

export default function JoinStep4() {
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
  useEffect(() => {
    const invalid =
      !getItem("jfName") ||
      !getItem("jfLocation") ||
      !getItem("jfWebsite") ||
      !getItem("jfYearsExperience") ||
      ([...JSON.parse(getItem("jfFocuses") || "[]")].length < 1 &&
        !getItem("jfFocusSuggested")) ||
      ([...JSON.parse(getItem("jfIndustries") || "[]")].length < 1 &&
        !getItem("jfIndustrySuggested")) ||
      !getItem("jfCompanySize");
    if (invalid) router.push({ pathname: "01-you", query: { r: "04" } });
  }, []);

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

  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader>
        <ProgressBar
          headline="Private"
          label="How to Reach You"
          currentCount={4}
          totalCount={4}
        />
      </JoinHeader>
      <div className="container">
        <Heading>Welcome to our little hui.</Heading>
        <Subheading>
          This email will be used to confirm any changes to your profile going
          forward. We <strong>will not</strong> share your contact information
          without your permission.
        </Subheading>
        <section
          style={{
            margin: "2rem auto 0",
            maxWidth: theme.layout.width.interior,
          }}
        >
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
            onSubmit={async (values) => {
              setLoading(true);
              setError(undefined);
              const res: Response | any = await createMember();
              const resJSON = await res.json();
              if (res.ok) {
                clearAllStoredFields();
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
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("That email doesn't look right. Please try again.")
                .required(
                  "It's important that we can reach you. Email is required."
                ),
            })}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Input
                  name="email"
                  label="What’s your email?"
                  labelTranslation="He aha kou wahi leka uila?"
                  onBlur={props.handleBlur}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={props.touched.email && props.errors.email}
                />
                <div style={{ margin: "2rem auto 0", maxWidth: "24rem" }}>
                  <Button fullWidth loading={loading} type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </section>
      </div>
    </>
  );
}
