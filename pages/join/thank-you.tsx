import Code from "@/components/Code";
import Logo from "@/components/Logo";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import { Subtitle } from "@/components/Title";
import Head from "next/head";
import Link from "next/link";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Thank You · Hawaiians in Technology",
    },
  };
}

export default function ThankYou({ pageTitle }) {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <div className="column flex h-screen flex-col">
        <header className="relative flex w-full shrink-0 items-center p-4">
          <div className="ml-4 grow">
            <Link href="/">Back to home</Link>
          </div>
          <Logo />
        </header>
        <main className="flex max-w-3xl grow flex-col justify-center gap-4 px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Subtitle text="Submission&nbsp;successful" />
            <img
              src={"/images/shaka.gif"}
              alt="Animated shaka, rotating left to right, real loose"
              className="w-20"
            />
          </div>

          <h2 className="text-base">
            <strong>Expect one of us to reach out about your submission</strong>{" "}
            as soon as we can get to it. We review all changes manually for...
            quality assurance. 😆
          </h2>
          <h2 className="text-base">
            You should have <em>just</em> received a confirmation email from us.
            If you didn't, you may need to add{" "}
            <Code>no-reply@hawaiiansintech.org</Code> to your address book.
          </h2>
        </main>
      </div>
    </>
  );
}
