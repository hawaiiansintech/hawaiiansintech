import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useFormik, withFormik } from "formik";
import * as Yup from "yup";
import { useSessionStorage } from "../../helpers.js";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import Input from "../../components/form/Input.js";
import Disclaimer from "../../components/form/Disclaimer.js";

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

      <Header>
        <h2>Welcome to our little hui.</h2>
        <p>
          Our directory features kanaka from all over -- both geographically and
          across the tech industry. Create your profile by telling us a little
          bit about yourself.
        </p>
        <p>
          This information will appear in your listing in our directory of
          kanaka in tech.
        </p>
      </Header>
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "42rem",
        }}
      >
        <FormikForm />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Disclaimer>
          We may reach out to connect and talk story. Please feel welcome to do
          the same. We won’t share your contact information without your
          permission.
        </Disclaimer>
      </div>

      <style global jsx>{`
        .container {
          padding-top: 6rem;
        }
      `}</style>
    </div>
  );
}

const Form = (props) => {
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    props;
  const router = useRouter();

  const onSubmit = () => {
    handleSubmit();
    router.push({
      pathname: "step-03",
      query: {
        name: values.name,
        location: values.location,
        email: values.email,
        website: values.website,
      },
    });
  };

  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <Input
          name="name"
          label="What’s your name?"
          labelTranslation="ʻO wai kou inoa?"
          placeholder="Full name"
          onBlur={handleBlur}
          onChange={handleChange}
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
          onChange={handleChange}
          error={touched.location && errors.location}
        />
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
      <Input
        name="website"
        label="What’s your LinkedIn / professional website?"
        labelTranslation="He aha kou wahi uila ’oihana?"
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.website && errors.website}
      />

      <div style={{ marginTop: "2rem" }}>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={
            !touched.name ||
            errors.name ||
            !touched.location ||
            errors.location ||
            !touched.email ||
            errors.email ||
            !touched.website ||
            errors.website
          }
        >
          Continue
        </Button>
      </div>
    </>
  );
};

export const validationSchema = Yup.object().shape({
  name: Yup.string().required(
    "We need to know what to call you. Name is required."
  ),
  location: Yup.string().required("A location, imprecise or not, is required."),
  email: Yup.string()
    .email("That email doesn't look right. Please try again.")
    .required("It's important that we can reach you. Email is required."),
  website: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "That URL looks funny. Please try again."
    )
    .required("A link goes a long way. A website is required."),
});

const FormikForm = withFormik({
  mapPropsToValues: () => ({ name: "", location: "", email: "", website: "" }),
  validationSchema: validationSchema,
  displayName: "FormikForm",
})(Form);
