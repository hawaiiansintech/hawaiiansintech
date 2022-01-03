import { useRef, useState } from "react";
import { useRouter } from "next/router";
import urlRegex from "url-regex";
import Head from "next/head";
import Link from "next/link";
import { withFormik } from "formik";
import * as Yup from "yup";
import MetaTags from "../../components/Metatags.js";
import { Heading, Subheading } from "../../components/Heading.tsx";
import Button from "../../components/Button.js";
import Input from "../../components/form/Input.js";
import ProgressBar from "../../components/form/ProgressBar.js";
import ErrorMessage from "../../components/form/ErrorMessage.js";

export default function JoinStep2(props) {
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
        label="Profile"
        currentCount={1}
        totalCount={3}
      />
      <div style={{ marginTop: "4rem" }}>
        <Heading>Welcome to our little hui.</Heading>
      </div>
      <Subheading centered>
        Join our directory featuring talented kanaka working across the tech
        industry.
      </Subheading>
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "42rem",
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
  const errorPlaceholderRef = useRef();
  const [error, setError] = useState(undefined);

  const onChange = (e) => {
    handleChange(e);
    if (isValid) {
      setError(undefined);
    }
  };

  const onSubmit = (e) => {
    handleSubmit();
    e.preventDefault();

    if (isValid) {
      router.push({
        pathname: "step-03",
        query: {
          name: values.name,
          location: values.location,
          website: values.website,
        },
      });
    } else if (errorPlaceholderRef.current) {
      setError({
        headline: "Something went wrong.",
        body: "Please check the fields below and try again.",
      });
      window.scrollTo({
        top: errorPlaceholderRef.current.offsetTop,
        behavior: "smooth",
      });
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
          name="name"
          label="What’s your name?"
          labelTranslation="ʻO wai kou inoa?"
          placeholder="Full name"
          onBlur={handleBlur}
          onChange={onChange}
          error={touched.name && errors.name}
        />
      </div>
      <div style={{ marginBottom: "2rem" }}>
        <Input
          name="location"
          label="Where you stay now days?"
          labelTranslation="Ma hea ʻoe e noho ʻana?"
          placeholder="City, State"
          onBlur={handleBlur}
          onChange={onChange}
          error={touched.location && errors.location}
        />
      </div>
      <Input
        name="website"
        label="What’s your LinkedIn / professional website?"
        labelTranslation="He aha kou wahi uila ’oihana?"
        onBlur={handleBlur}
        onChange={onChange}
        error={touched.website && errors.website}
      />

      <div style={{ marginTop: "2rem" }}>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

const FormikForm = withFormik({
  displayName: "profile-form",
  validateOnMount: true,
  mapPropsToValues: () => ({ name: "", location: "", website: "" }),
  validationSchema: Yup.object().shape({
    name: Yup.string().required(
      "We need to know what to call you. Name is required."
    ),
    location: Yup.string().required(
      "A location, imprecise or not, is required."
    ),
    website: Yup.string()
      .matches(
        urlRegex({ strict: false }),
        "That URL looks funny. Please try again."
      )
      .required(
        "A website is required; think about a place where people can learn more about you."
      ),
  }),
})(Form);
