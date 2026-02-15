import { Formik } from "formik";
import React, { useState } from "react";
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
        <div className="mb-4 flex items-center rounded-lg border-2 border-tan-400 bg-tan-300 py-2 pl-3 pr-2 text-xs text-tan-800">
          <h4 className="grow-1 w-full">
            <strong className="font-semibold">Start over?</strong> It looks like
            you might&rsquo;ve gotten started already.
          </h4>
          <div className="shrink-0">
            <UndoButton onClick={onReset}>Clear all fields</UndoButton>
          </div>
        </div>
      );
  };

  return (
    <>
      <section className="mx-auto mt-8 max-w-3xl px-8">
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
              "We need to know what to call you. Name is required.",
            ),
            location: Yup.string().required(
              "A location, imprecise or not, is required.",
            ),
            website: Yup.string()
              .matches(
                urlRegex({ strict: false }),
                "That URL looks funny. Please try again.",
              )
              .required(
                "A website is required; think about a place where people can learn more about you.",
              ),
          })}
        >
          {(props) => (
            <form className="space-y-6" onSubmit={props.handleSubmit}>
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
              <Input
                name="website"
                value={props.values.website}
                label="What’s your LinkedIn / professional website?"
                labelTranslation="He aha kou wahi uila ’oihana?"
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                error={props.touched.website && props.errors.website}
              />

              <section className="mx-auto w-full max-w-md px-4">
                <Button fullWidth loading={loading} type="submit">
                  Continue
                </Button>
              </section>
            </form>
          )}
        </Formik>
      </section>
    </>
  );
}
