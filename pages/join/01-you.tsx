import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import urlRegex from "url-regex";
import Head from "next/head";
import Link from "next/link";
import { withFormik } from "formik";
import * as Yup from "yup";
import MetaTags from "../../components/Metatags.js";
import { Heading, Subheading } from "../../components/Heading";
import Button from "../../components/Button";
import Input from "../../components/form/Input";
import ProgressBar from "../../components/form/ProgressBar";
import ErrorMessage, {
  ErrorMessageProps,
} from "../../components/form/ErrorMessage";
import { scrollToTop } from "../../helpers.js";
import { useLocalStorage } from "../../lib/hooks";
import UndoButton from "../../components/form/UndoButton";
import HorizontalRule from "../../components/HorizontalRule";

const NEXT_PAGE = "02-work";

export default function JoinStep2(props) {
  const [storedName, setStoredName] = useLocalStorage("jfName", "");
  const [storedLocation, setStoredLocation] = useLocalStorage("jfLocation", "");
  const [storedWebsite, setStoredWebsite] = useLocalStorage("jfWebsite", "");
  const clearStorage = () => {
    setStoredName("");
    setStoredLocation("");
    setStoredWebsite("");
  };
  const renderButton = () => {
    if (storedName || storedLocation || storedWebsite)
      return (
        <div
          style={{
            border: "0.125rem solid var(--color-border)",
            borderRadius: "var(--border-radius-small)",
            padding: "1rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center",
            color: "var(--color-text-alt-2)",
          }}
        >
          <UndoButton onClick={clearStorage}>Clear form</UndoButton>
        </div>
      );
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
        label="Who You Are"
        currentCount={1}
        totalCount={4}
      />
      <div style={{ marginTop: "4rem" }}>
        <Heading>Welcome to our little hui.</Heading>
      </div>
      <Subheading centered>
        Join our directory featuring talented kanaka working across the tech
        industry.
      </Subheading>
      <section
        style={{
          margin: "2rem auto 0",
          maxWidth: "var(--width-page-interior)",
        }}
      >
        {renderButton()}
        <Formik
          name={storedName}
          location={storedLocation}
          website={storedWebsite}
        />
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
  const [storedName, setStoredName] = useLocalStorage("jfName", "");
  const [storedLocation, setStoredLocation] = useLocalStorage("jfLocation", "");
  const [storedWebsite, setStoredWebsite] = useLocalStorage("jfWebsite", "");
  const [error, setError] = useState<ErrorMessageProps>(undefined);

  useEffect(() => {
    if (error) scrollToTop();
  }, [error]);

  const onChange = (e) => {
    handleChange(e);
    if (isValid) {
      setError(undefined);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();

    if (isValid) {
      setStoredName(values.name);
      setStoredLocation(values.location);
      setStoredWebsite(values.website);
      router.push({ pathname: NEXT_PAGE });
    } else {
      setError({
        headline: "Fields missing below.",
        body: "Please fill in the fields below.",
      });
    }
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
          name="name"
          label="What’s your name?"
          value={values.name}
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
          value={values.location}
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
        value={values.website}
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

const Formik = withFormik({
  displayName: "profile-form",
  handleSubmit: (values) => {
    console.log(values);
  },
  enableReinitialize: true,
  mapPropsToValues: (props: {
    name: string;
    location: string;
    website: string;
  }) => ({
    name: props.name || "",
    location: props.location || "",
    website: props.website || "",
  }),
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
