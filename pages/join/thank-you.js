import Head from "next/head";
import MetaTags from "../../components/Metatags.js";
import { HeaderHeading, HeaderDescription } from "../../components/Header.js";

export default function ThankYou() {
  return (
    <>
      <div className="container">
        <Head>
          <title>Hawaiians in Technology | Join</title>
          <link rel="icon" href="/favicon.ico" />
          <MetaTags />
        </Head>

        <HeaderHeading>Successful submission.</HeaderHeading>
        <HeaderDescription centered>
          We'll be in touch once your profile is live. Please be patient as we
          review all entries manually.
        </HeaderDescription>
      </div>
    </>
  );
}
