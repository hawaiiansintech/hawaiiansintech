import HitLogo from "@/components/HitLogo";
import MetaTags from "@/components/Metatags";
import { Subtitle } from "@/components/Title";
import Head from "next/head";
import Link from "next/link";
import theme from "styles/theme";

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
          <Link href="/" passHref>
            <a>Back to home</a>
          </Link>
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
          <h2>
            Mahalo for your interest! We'll follow up with the provided email
            address once we review your profile.
          </h2>
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
          margin: 2rem 0 0;
          font-weight: 400;
          line-height: 150%;
          max-width: 28rem;
        }
        main img {
          width: 4.8rem;
          margin-left: 1rem;
        }
      `}</style>
    </>
  );
}
