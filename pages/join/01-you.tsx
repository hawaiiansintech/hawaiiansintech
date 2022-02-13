import Button from "@/components/Button";
import Input from "@/components/form/Input";
import ProgressBar from "@/components/form/ProgressBar";
import UndoButton from "@/components/form/UndoButton";
import { Heading, Subheading } from "@/components/Heading";
import MetaTags from "@/components/Metatags.js";
import { useStorage } from "@/lib/hooks";
import { Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import urlRegex from "url-regex";
import * as Yup from "yup";

const ALL_STORED_FIELDS = [
  "jfName",
  "jfLocation",
  "jfWebsite",
  "jfFocuses",
  "jfFocusSuggested",
  "jfTitle",
  "jfYearsExperience",
  "jfIndustries",
  "jfIndustrySuggested",
  "jfCompanySize",
];

const NEXT_PAGE = "02-work";

export const clearAllStoredFields = () => {
  const { removeItem } = useStorage();
  ALL_STORED_FIELDS.map((item) => removeItem(item));
};

export default function JoinStep1(props) {
  const router = useRouter();
  const { r } = router.query;
  const { getItem, setItem } = useStorage();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);

  // clear fields if param `r` is present
  useEffect(() => {
    if (r) {
      clearAllStoredFields();
      setName("");
      setLocation("");
      setWebsite("");
      if (typeof window !== "undefined")
        window.history.replaceState(null, "", "/join/01-you");
    }
  }, [r]);

  useEffect(() => {
    let storedName = getItem("jfName");
    let storedLocation = getItem("jfLocation");
    let storedWebsite = getItem("jfWebsite");
    if (storedName) setName(storedName);
    if (storedLocation) setLocation(storedLocation);
    if (storedWebsite) setWebsite(storedWebsite);
  }, []);

  const renderButton = () => {
    if (name || location || website)
      return (
        // TODO remove this hardcoded css
        <div
          style={{
            border: `0.125rem solid ${theme.color.border.base}`,
            borderRadius: theme.borderRadius.sm,
            padding: "1rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center",
            color: theme.color.text.alt2,
          }}
        >
          <UndoButton
            onClick={() => {
              setName("");
              setLocation("");
              setWebsite("");
              clearAllStoredFields();
            }}
          >
            Clear form
          </UndoButton>
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
        To join the directory, we just ask that you are{" "}
        <strong>Native Hawaiian</strong> and work in the{" "}
        <strong>field / industry of technology</strong>.
      </Subheading>
      <section
        style={{
          margin: "2rem auto 0",
          maxWidth: theme.layout.width.interior,
        }}
      >
        {renderButton()}

        <Formik
          enableReinitialize
          initialValues={{ name: name, location: location, website: website }}
          validateOnBlur={validateAfterSubmit}
          validateOnChange={validateAfterSubmit}
          validate={() => setValidateAfterSubmit(true)}
          onSubmit={(values) => {
            setLoading(true);
            setItem("jfName", values.name);
            setItem("jfLocation", values.location);
            setItem("jfWebsite", values.website);
            router.push({ pathname: NEXT_PAGE });
          }}
          validationSchema={Yup.object().shape({
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
          })}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <div style={{ marginBottom: "2rem" }}>
                <Input
                  name="name"
                  label="What’s your name?"
                  value={props.values.name}
                  labelTranslation="ʻO wai kou inoa?"
                  placeholder="Full name"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  error={props.touched.name && props.errors.name}
                />
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <Input
                  name="location"
                  value={props.values.location}
                  label="Where you stay now days?"
                  labelTranslation="Ma hea ʻoe e noho ʻana?"
                  labelHint={
                    <>
                      <strong>
                        We've got technical kanaka all over the world.
                      </strong>{" "}
                      Share where you're at — so people know{" "}
                      <em>we out here</em>.
                    </>
                  }
                  placeholder="City, State"
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                  error={props.touched.location && props.errors.location}
                />
              </div>
              <Input
                name="website"
                value={props.values.website}
                label="What’s your LinkedIn / professional website?"
                labelTranslation="He aha kou wahi uila ’oihana?"
                labelHint={
                  <>
                    <strong>
                      People may be looking to learn more about you.
                    </strong>{" "}
                    Where should we send them? LinkedIn has seemed to work
                    particularly well so far! It's a great way to connect with
                    other kanaka.
                  </>
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                error={props.touched.website && props.errors.website}
              />

              <div style={{ margin: "2rem auto 0", maxWidth: "24rem" }}>
                <Button fullWidth loading={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </section>
    </div>
  );
}
