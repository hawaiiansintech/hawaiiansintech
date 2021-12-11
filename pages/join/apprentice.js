import Head from "next/head";
import MetaTags from "../../components/Metatags.js";
import { HeaderHeading, HeaderDescription } from "../../components/Header.js";

export default function Apprentice() {
  return (
    <>
      <div className="container">
        <Head>
          <title>Hawaiians in Technology | Join</title>
          <link rel="icon" href="/favicon.ico" />
          <MetaTags />
        </Head>

        <HeaderHeading>We are working on this program.</HeaderHeading>
        <HeaderDescription centered>
          Let us know you're interested by clicking below.
        </HeaderDescription>
      </div>
    </>
  );
}
