import Accordion, { AccordionProps } from "@/components/Accordion";
import HitLogo from "@/components/HitLogo";
import MetaTags from "@/components/Metatags";
import Tag from "@/components/Tag";
import { Subtitle } from "@/components/Title";
import { CONTACT_METHODS } from "@/lib/contact-methods";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import theme from "styles/theme";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Request Changes · Hawaiians in Technology",
    },
  };
}

export default function ThankYou({ pageTitle }) {
  const router = useRouter();
  const { email, id, removeRequest } = router.query;
  const emailNull = email === "null";
  return (
    <>
      <Head>
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
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
            {emailNull ? (
              <>
                <Subtitle text="We&nbsp;got&nbsp;the&nbsp;request" />
              </>
            ) : (
              <Subtitle text="Request&nbsp;sent&nbsp;successfully" />
            )}

            <span>
              {" "}
              <img
                src={"/images/shaka.gif"}
                alt="Animated shaka, rotating left to right, real loose"
              />
            </span>
          </div>
          <div className="thank-you__body">
            {emailNull ? (
              <EmailNullMessage />
            ) : (
              <>
                <h2>
                  <strong>
                    Expect one of us to reach out about this{" "}
                    {removeRequest ? "removal" : "change"}
                  </strong>{" "}
                  as soon as we can get to it. We review all changes manually
                  for... quality assurance. 😆
                </h2>
                <h2>
                  But <em>raj</em>, mahalo for{" "}
                  {removeRequest
                    ? "letting us youʻd like to be removed; "
                    : "keeping your profile up-to-date; "}
                  and now, for your patience.
                </h2>
              </>
            )}

            {id ? (
              <h6>
                <strong>Member ID</strong>: <code>{id}</code>
              </h6>
            ) : null}
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
          width: 100%;
        }
        main h2 {
          font-size: 1.2rem;
          margin: 1rem 0 0;
          font-weight: 400;
          line-height: 150%;
        }
        main img {
          width: 4.8rem;
          margin-left: 1rem;
        }
        h6 {
          margin: 1rem 0 0;
          font-size: 0.875rem;
          color: ${theme.color.text.alt};
        }
        code {
          color: ${theme.color.text.alt};
          background: ${theme.color.background.alt};
          padding: 0.125rem 0.25rem;
          border-radius: ${theme.borderRadius.xs};
        }
      `}</style>
    </>
  );
}

function EmailNullMessage() {
  const [contactMethods, setContactMethods] =
    useState<AccordionProps[]>(CONTACT_METHODS);
  const handleToggle = (i) => {
    const newFlows = contactMethods.map((flow, newI) => {
      if (i == newI) {
        return { ...flow, open: !flow.open };
      }
      return flow;
    });
    setContactMethods(newFlows);
  };

  return (
    <>
      <h3>But we want to make sure this is you.</h3>
      <div className="email-null-message">
        <div className="email-null-message__headline">
          <Tag>Verification needed</Tag>
          <p>
            We started using email to confirm changes are being made by the
            actual person. We never got yours. Verifying your identity should be
            as easy as shooting us a message, DM, etc.
          </p>
          <p>
            Be sure to include <strong>your email</strong> in the message. We'll
            use that to confirm changes bumbai.
          </p>
          <h4>Ways to verify</h4>
        </div>
        <div className="email-null-message__accordions">
          {contactMethods.map((flow, i) => (
            <Accordion
              label={flow.label}
              body={flow.body}
              open={flow.open}
              onToggle={() => {
                handleToggle(i);
              }}
              key={`flow-${i}`}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .email-null-message {
          margin: 1rem 0 0;
          border-radius: ${theme.borderRadius.xs};
          width: 100%;
          max-width: 24rem;
          border: 0.125rem solid ${theme.color.border.base};
        }
        .email-null-message__headline {
          padding: 1.5rem 1rem 1rem;
        }
        .email-null-message__accordions {
          margin: 0 0 1rem;
        }

        h4 {
          margin: 1rem 0 0;
          font-size: 0.875rem;
          color: ${theme.color.text.alt};
        }
        h3 {
          margin: 1rem 0 1rem;
          color: ${theme.color.text.alt};
        }
      `}</style>
    </>
  );
}
