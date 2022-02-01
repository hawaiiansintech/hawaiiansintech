import { withFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Button from "../../components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "../../components/form/ErrorMessage";
import Input from "../../components/form/Input";
import ProgressBar from "../../components/form/ProgressBar";
import { Heading, Subheading } from "../../components/Heading";
import MetaTags from "../../components/Metatags.js";
import { scrollToTop } from "../../helpers.js";
import { useStorage } from "../../lib/hooks";
import { clearAllStoredFields } from "./01-you";

export default function JoinStep4() {
  const router = useRouter();
  const { getItem, setItem } = useStorage();

  // check invalid situation via previous required entries
  useEffect(() => {
    const prevReqFields =
      !getItem("jfName") ||
      !getItem("jfLocation") ||
      !getItem("jfWebsite") ||
      !getItem("jfFocuses") ||
      !getItem("jfYearsExperience");

    if (prevReqFields) {
      clearAllStoredFields();
      router.push({ pathname: "01-you" });
    }
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <Link href="/join" shallow={true}>
        <a className="auxNav arrowback">←</a>
      </Link>
      <ProgressBar
        headline="Private"
        label="How to Reach You"
        currentCount={4}
        totalCount={4}
      />
      <div style={{ marginTop: "4rem" }}>
        <Heading>Welcome to our little hui.</Heading>
        <Subheading>
          This email will be used to confirm any changes to your profile going
          forward. We <strong>will not</strong> share your contact information
          without your permission.
        </Subheading>
      </div>
      <section
        style={{
          margin: "2rem auto 0",
          maxWidth: "var(--width-page-interior)",
        }}
      >
        <FormikForm />
      </section>
    </div>
  );
}

const Form = (props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = props;
  const router = useRouter();
  const { name, location, website, focus, suggestedFocus, title } =
    router.query;
  const { email } = values;
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(undefined);

  useEffect(() => {
    if (error) {
      scrollToTop();
    }
  }, [error]);

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
          email,
          focus,
          suggestedFocus,
          title,
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

  const onSubmit = async (e) => {
    handleSubmit();
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    if (!isValid) {
      setIsLoading(false);
      setError({
        headline: "An email address is required.",
        body: "Please try again below.",
      });
      return;
    }

    const res: Response | any = await createMember();
    if (res.ok) {
      router.push({ pathname: "thank-you" });
      return;
    } else if (res.status === 422) {
      setError({
        headline: "This email is associated with another member.",
        body: "We only allow one member per email address.",
      });
    } else {
      setError({
        headline: "Gonfunnit, looks like something went wrong!",
        body: "Please try again later.",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div style={{ marginBottom: "1rem" }}>
          <ErrorMessage headline={error.headline} body={error.body} />
        </div>
      )}
      <div style={{ marginBottom: "2rem" }}>
        <Input
          name="email"
          label="What’s your email?"
          labelTranslation="He aha kou wahi leka uila?"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.email && errors.email}
        />
      </div>
      <Button type="submit" loading={isLoading}>
        Submit
      </Button>
    </form>
  );
};

const FormikForm = withFormik({
  displayName: "email-form",
  validateOnMount: true,
  handleSubmit: () => {},
  mapPropsToValues: () => ({ email: "" }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("That email doesn't look right. Please try again.")
      .required("It's important that we can reach you. Email is required."),
  }),
})(Form);
