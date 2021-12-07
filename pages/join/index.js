import Head from "next/head";
import Link from "next/link";
import MetaTags from "../../components/Metatags.js";
import { HeaderHeading, HeaderDescription } from "../../components/Header.js";
import Button from "../../components/Button.js";
import RadioBox from "../../components/form/RadioBox.js";

export default function Join() {
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

      <HeaderHeading>Huuuui, Aloha e.</HeaderHeading>
      <HeaderDescription centered>
        Drop your in the hat to be added to the list. We just ask that you /
        they are <strong>Native Hawaiian</strong> &amp; work or research in the{" "}
        <strong>technology sector</strong>. Or if you’re not yet working in the
        space, and curious to get started, let us know who you are.
      </HeaderDescription>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <div style={{ maxWidth: "20rem" }}>
          <RadioBox
            defaultChecked
            label="Join the list on the homepage"
            description="Current professional or researcher in the technology sector"
            seriesOf="add-or-nominate"
          />
        </div>
        {/* <div style={{ maxWidth: "20rem" }}>
          <RadioBox
            label="Students of all ages"
            description="Student or someone transitioning careers"
            seriesOf="add-or-nominate"
          />
        </div> */}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Button linkTo="/join/step-02">Continue</Button>
      </div>

      <style global jsx>{`
        .container {
          padding-top: 6rem;
        }
      `}</style>
    </div>
  );
}
