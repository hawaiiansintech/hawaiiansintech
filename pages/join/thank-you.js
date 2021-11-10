import Head from "next/head";
import MetaTags from "../../components/Metatags.js";
import Label from "../../components/form/Label.js";
import ButtonBox from "../../components/form/ButtonBox.js";
import Input from "../../components/form/Input.js";
import Header from "../../components/Header.js";
import ProgressBar from "../../components/form/ProgressBar.js";

export default function ThankYou({ focusesData }) {
  return (
    <>
      <div className="container">
        <Head>
          <title>Hawaiians in Technology | Join</title>
          <link rel="icon" href="/favicon.ico" />
          <MetaTags />
        </Head>
        <Header>
          <h2>Successful submission.</h2>
          <p>
            We'll be in touch once your profile is live. Please be patient as we
            moderate and vet all entries manually.
          </p>
        </Header>
        <div style={{ margin: "2rem auto 0", maxWidth: "42rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <Label
              label="How long have you worked in the tech industry? (optional)"
              labelTranslation="He aha kou wahi leka uila?"
            />
            <div
              style={{
                display: "flex",
                marginTop: "0.5rem",
              }}
            >
              <div style={{ marginRight: "0.5rem" }}>
                <ButtonBox label="0 - 2 years" onClick={(e) => {}} />
              </div>
              <div style={{ marginRight: "0.5rem" }}>
                <ButtonBox label="2 - 5 years" onClick={(e) => {}} />
              </div>
              <div style={{ marginRight: "0.5rem" }}>
                <ButtonBox label="5 - 10 years" onClick={(e) => {}} />
              </div>
              <ButtonBox label="Over 10 years" onClick={(e) => {}} />
            </div>
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <Label
              label="Are you looking for ways to help our community? (optional)"
              labelTranslation="He aha kou wahi leka uila?"
            />
            <div
              style={{
                display: "flex",
                marginTop: "0.5rem",
              }}
            >
              <div style={{ marginRight: "0.5rem" }}>
                <ButtonBox label="Yes" onClick={(e) => {}} />
              </div>
              <ButtonBox label="No" onClick={(e) => {}} />
            </div>
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <Input
              name="feedback"
              label="Anything you'd like to share with us? (optional)"
              labelTranslation="He aha kou wahi leka uila?"
              // onBlur={handleBlur}
              // onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <Label
              label="If you're at home, are you looking to move? (optional)"
              labelTranslation="He aha kou wahi leka uila?"
            />
            <div
              style={{
                display: "flex",
                marginTop: "0.5rem",
              }}
            >
              <div style={{ marginRight: "0.5rem" }}>
                <ButtonBox label="Yes" onClick={(e) => {}} />
              </div>
              <ButtonBox label="No" onClick={(e) => {}} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
