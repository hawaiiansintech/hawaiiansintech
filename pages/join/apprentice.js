import { Heading, Subheading } from "@/components/Heading.tsx";
import MetaTags from "@/components/Metatags.js";
import Head from "next/head";

export default function Apprentice() {
  return (
    <>
      <div className="container">
        <Head>
          <title>Hawaiians in Technology | Join</title>
          <link rel="icon" href="/favicon.ico" />
          <MetaTags />
        </Head>

        <Heading>We are working on this program.</Heading>
        <Subheading centered>
          Let us know you're interested by clicking below.
        </Subheading>
      </div>

      <style jsx>{`
        .container {
          padding-top: 6rem;
        }
      `}</style>
    </>
  );
}
