import HitLogo from "@/components/HitLogo.js";
import MetaTags from "@/components/Metatags.js";
import Head from "next/head";

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <div className="thank-you">
        <header>
          <a href="/">Back to home</a>
          <HitLogo />
        </header>
        <main>
          <h1>Submission successful</h1>
          <h2>
            We'll be in touch once we review your profile and push it live. We
            review all entries manually.
          </h2>
        </main>
      </div>
      <style jsx>{`
        .thank-you {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        header,
        main {
          padding: 0 2rem;
        }
        header {
          padding-top: 3rem;
          padding-bottom: 2rem;
          flex-shrink: 0;
        }
        main {
          padding-top: 2rem;
          padding-bottom: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          text-align: left;
          flex-grow: 1;
          flex-shrink: 0;
        }
        h1 {
          font-size: 3.2rem;
          margin: 0;
        }
        h2 {
          font-size: 1.2rem;
          margin: 2rem 0 0;
          font-weight: 400;
          line-height: 150%;
          max-width: 28rem;
        }
      `}</style>
    </>
  );
}
