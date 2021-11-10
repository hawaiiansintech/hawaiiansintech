import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import Disclaimer from "../../components/form/Disclaimer.js";
import { fetchFocuses } from "../../lib/api";
import { cssHelperButtonReset } from "../../styles/global.js";
import Input from "../../components/form/Input.js";
import ErrorMessage from "../../components/form/ErrorMessage.js";
import ProgressBar from "../../components/form/ProgressBar.js";
import Label from "../../components/form/Label.js";
import ButtonBox from "../../components/form/ButtonBox.js";

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
  let matchedFocus = focusesData.find((f) => f.id === focus)?.name;

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
      <Header>
        <h2>Welcome to our little hui.</h2>
        <ProgressBar
          headline="Private"
          label="Personal bits"
          currentCount={3}
          totalCount={3}
        />
        <div style={{ margin: "2rem auto 0", maxWidth: "42rem" }}>
          {name} {location} {website} {matchedFocus}
        </div>
      </Header>
      <div style={{ margin: "2rem auto 0", maxWidth: "42rem" }}>
        <FormikForm />
      </div>
      <style global jsx>{`
        .container {
          padding-top: 6rem;
        }
        .more-link {
          ${cssHelperButtonReset}
          background: transparent;
          color: var(--color-brand);
          font-weight: 500;
        }
        .more-link:hover {
          color: var(--color-brand-tone);
        }
      `}</style>
    </div>
  );
}

const Form = (props) => {
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    props;
  const router = useRouter();
  const { name, location, website, focus } = router.query;
  const { email } = values;
  const [showError, setShowError] = useState(false);

  const submitForm = () => {
    handleSubmit();
    fetch("/api/create-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, location, website, email, focus }),
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
            name: name,
            email: email,
          },
        });
      })
      .catch((err) => {
        setShowError(true);
      });
  };

  return (
    <>
      {showError && (
        <div style={{ marginBottom: "1rem" }}>
          <ErrorMessage
            headline={"Gonfunnit, looks like something went wrong."}
            body={"Please try again later."}
          />
        </div>
      )}
      <div style={{ marginBottom: "2rem" }}>
        <p>
          We <strong>will not</strong> share your contact information without
          your permission.
        </p>
      </div>
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
      <Button
        type="button"
        onClick={submitForm}
        disabled={!touched.email || errors.email}
      >
        Submit
      </Button>
    </>
  );
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("That email doesn't look right. Please try again.")
    .required("It's important that we can reach you. Email is required."),
});

const FormikForm = withFormik({
  mapPropsToValues: () => ({ email: "" }),
  validationSchema: validationSchema,
  displayName: "FormikForm",
})(Form);
