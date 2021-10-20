import Head from "next/head";
import Link from "next/link";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import Input from "../../components/form/Input.js";
import Disclaimer from "../../components/form/Disclaimer.js";

export default function JoinStep2() {
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
        <h2>K, real quick...</h2>
      </Header>
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "42rem",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <Input
            label="What’s your name?"
            labelTranslation="ʻO wai kou inoa?"
            placeholder="Full name"
          />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <Input
            label="Where you stay now days?"
            labelTranslation="Ma hea ʻoe?"
            placeholder="City, State"
          />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <Input
            label="What’s your email?"
            labelTranslation="He aha kou wahi leka uila?"
          />
        </div>
        <Input
          label="What’s your LinkedIn / professional website?"
          labelTranslation="He aha kou wahi uila ’oihana?"
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Button linkTo="/join/step-03">Continue</Button>
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
