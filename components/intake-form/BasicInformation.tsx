import { Formik } from "formik";
import React, { useState } from "react";
import theme from "styles/theme";
import urlRegex from "url-regex";
import * as Yup from "yup";
import Button from "../Button";
import Input from "../form/Input";
import UndoButton from "../form/UndoButton";

interface BasicInformationFormProps {
  initial?: { name?: string; location?: string; website?: string };
  onReset?: (any?) => void;
  onSubmit: (any?) => void;
}

export default function BasicInformationForm({
  initial,
  onReset,
  onSubmit,
}: BasicInformationFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);

  const renderButton = () => {
    if (!onReset) return <></>;
    if (initial.name || initial.location || initial.website)
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
            gap: "0.5rem",
            color: theme.color.text.alt2,
          }}
        >
          It looks like you might've gotten started already. Continue below or{" "}
          <div>
            <UndoButton onClick={onReset}>Clear all fields</UndoButton>
          </div>
        </div>
      );
  };

  return (
    <div className="container">
      <>
        <section
          style={{
            margin: "2rem auto 0",
            maxWidth: theme.layout.width.interior,
          }}
        >
          {renderButton()}

          <Formik
            enableReinitialize
            initialValues={{
              name: initial.name,
              location: initial.location,
              website: initial.website,
            }}
            validateOnBlur={validateAfterSubmit}
            validateOnChange={validateAfterSubmit}
            validate={() => setValidateAfterSubmit(true)}
            onSubmit={(values) => {
              setLoading(true);
              onSubmit(values);
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
                    placeholder="Island/City, State"
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
      </>
    </div>
  );
}
