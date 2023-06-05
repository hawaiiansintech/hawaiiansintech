import HitLogo from "@/components/HitLogo";
import MetaTags from "@/components/Metatags";
import { Subtitle } from "@/components/Title";
import Head from "next/head";
import Link from "next/link";
import theme from "styles/theme";

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
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <div className="thank-you">
        <header>
          <Link href="/">Back to home</Link>
          <HitLogo />
        </header>
        <main>
          <div className="thank-you__heading">
            <Subtitle text="Submission&nbsp;successful" />
            <span>
              {" "}
              <img
                src={"/images/shaka.gif"}
                alt="Animated shaka, rotating left to right, real loose"
              />
            </span>
          </div>
          <div className="thank-you__body">
            <h2>
              <strong>
                Expect one of us to reach out about your submission
              </strong>{" "}
              as soon as we can get to it. We review all changes manually for...
              quality assurance. 😆
            </h2>
            <div className="thank-you__note">
              <h3>
                You should have <em>just</em> received a confirmation email from
                us. If you didn't, you may need to add{" "}
                <code>no-reply@hawaiiansintech.org</code> to your address book.
              </h3>
            </div>
          </div>
        </main>
      </div>
      <style jsx>{`
        .thank-you {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .thank-you__heading {
          display: inline-flex;
          align-items: center;
        }
        .thank-you__body {
          max-width: 32rem;
        }
        .thank-you__note {
          margin: 1rem 0 0;
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
        header a {
          padding: 0.5rem 0.75rem;
          background: ${theme.color.brand.alpha};
          color: ${theme.color.brand.base};
          border-radius: ${theme.borderRadius.sm};
          border: 0.2rem solid transparent;
          transition: border 150ms ease-out;
        }
        header a:hover,
        header a:focus {
          border-color: ${theme.color.brand.alpha};
        }
        header a:active {
          border-color: ${theme.color.brand.base};
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
        main h2 {
          font-size: 1.2rem;
          margin: 1rem 0 0;
          font-weight: 400;
          line-height: 150%;
        }
        main h3 {
          color: ${theme.color.text.alt2};
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
          line-height: 150%;
        }
        main img {
          width: 4.8rem;
          margin-left: 1rem;
        }
        code {
          white-space: nowrap;
          color: ${theme.color.text.alt};
          background: ${theme.color.background.alt};
          padding: 0.125rem 0.25rem;
          border-radius: ${theme.borderRadius.xs};
          font-size: 0.875rem;
        }
      `}</style>
    </>
  );
}
