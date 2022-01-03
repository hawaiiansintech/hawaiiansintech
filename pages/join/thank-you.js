import Head from "next/head";
import MetaTags from "../../components/Metatags.js";
import { Heading, Subheading } from "../../components/Heading.tsx";

export default function ThankYou() {
  return (
    <>
      <div className="container">
        <Head>
          <title>Hawaiians in Technology | Join</title>
          <link rel="icon" href="/favicon.ico" />
          <MetaTags />
        </Head>

        <Heading>Successful submission.</Heading>
        <Subheading centered>
          We'll be in touch once your profile is live. Please be patient as we
          review all entries manually.
        </Subheading>
      </div>
    </>
  );
}
