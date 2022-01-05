import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import MetaTags from "../../components/Metatags.js";
import { Heading, Subheading } from "../../components/Heading.tsx";
import Button from "../../components/Button.js";
import { fetchFocuses } from "../../lib/api";
import Input from "../../components/form/Input.js";
import ErrorMessage from "../../components/form/ErrorMessage.js";
import ProgressBar from "../../components/form/ProgressBar.js";

export async function getStaticProps() {
  let focuses = (await fetchFocuses()) ?? [];
  focuses = focuses.sort((a, b) => {
    return b.count - a.count;
  });
  return {
    props: {
      focusesData: focuses,
    },
    revalidate: 60,
  };
}

export default function JoinStep4({ focusesData }) {
  const router = useRouter();
  const { name, location, website, focus } = router.query;
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
        currentCount={3}
        totalCount={3}
      />
      <div style={{ marginTop: "4rem" }}>
        <Heading>Welcome to our little hui.</Heading>
        <Subheading>
          This email will be used to confirm any changes to your profile going
          forward. We <strong>will not</strong> share your contact information
          without your permission.
        </Subheading>
      </div>
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "var(--page-interior-width)",
        }}
      >
        <FormikForm />
      </div>
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
  const [error, setError] = useState(undefined);
  const errorPlaceholderRef = useRef();

  const onSubmit = (e) => {
    handleSubmit();
    e.preventDefault();
    if (isValid) {
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
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error({ status: res.status, statusText: res.statusText });
          }
        })
        .then((res) => {
          router.push({
            pathname: "thank-you",
            query: {
              id: res.id,
            },
          });
        })
        .catch(() =>
          setError({
            headline: "Gonfunnit, looks like something went wrong.",
            body: "Please try again later.",
          })
        );
    } else {
      setError({
        headline: "An email address is required.",
        body: "Please try again below.",
      });
      if (errorPlaceholderRef) {
        window.scrollTo({
          top: errorPlaceholderRef.current.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div ref={errorPlaceholderRef} />
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
      <Button type="submit">Submit</Button>
    </form>
  );
};

const FormikForm = withFormik({
  displayName: "email-form",
  validateOnMount: true,
  mapPropsToValues: () => ({ email: "" }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("That email doesn't look right. Please try again.")
      .required("It's important that we can reach you. Email is required."),
  }),
})(Form);
