import Head from "next/head";
import Link from "next/link";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import Input from "../../components/form/Input.js";
import RadioBox from "../../components/form/RadioBox.js";
import Disclaimer from "../../components/form/Disclaimer.js";
import { fetchTechnologists } from "../../lib/api";

export async function getStaticProps() {
  const technologists = (await fetchTechnologists()) ?? [];

  let roles = technologists
    ?.map((technologist) => {
      return technologist.role;
    })
    .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
  return {
    props: {
      ...roles.entries(),
    },
    revalidate: 60,
  };
}

export default function JoinStep3({ roles }) {
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
        <h2>Us techie Hawaiians stay talented.</h2>
      </Header>
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "42rem",
        }}
      >
        <Input
          label="What’s your professional focus?"
          labelTranslation="He aha kou ʻoihana?"
          placeholder="Search"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridAutoRows: "1fr",
          columnGap: "0.5rem",
          rowGap: "0.5rem",
          maxWidth: "42rem",
          margin: "0 auto",
        }}
      >
        <RadioBox
          label="Software Engineer"
          seriesOf="professional-focus"
          small
          horizontal
          border
        />
        <RadioBox
          label="Go-To-Market / Partnerships / Strategy"
          seriesOf="professional-focus"
          small
          horizontal
          border
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Button>Submit</Button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Disclaimer>
          Sharing your professional focus will help the community understand the
          breadth of kanaka expertise in technology.
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
