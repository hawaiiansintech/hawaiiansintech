import Accordion, {
  AccordionLink,
  AccordionProps,
} from "@/components/Accordion";
import HitLogo from "@/components/HitLogo";
import MetaTags from "@/components/Metatags";
import Tag from "@/components/Tag";
import { Subtitle } from "@/components/Title";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import theme from "styles/theme";
import { DISCORD_URL } from "../about";

export default function ThankYou() {
  const router = useRouter();
  const { emailNull } = router.query;
  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Request Changes</title>
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
            {emailNull ? (
              <Subtitle text="Shoot,&nbsp;almost&nbsp;there" />
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
          {emailNull ? (
            <EmailNullMessage />
          ) : (
            <h2>
              Mahalo for keeping your profile up to date. We'll reach out once
              we review your request.
            </h2>
          )}
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

function EmailNullMessage() {
  const SUPPORT_FLOWS: AccordionProps[] = [
    {
      label: "Connect on LinkedIn",
      body: (
        <>
          <p>
            Who doesn't have a Linkedin, right? Connect and mention it in the
            message!
          </p>
          <AccordionLink href="https://www.linkedin.com/in/emmit-parubrub/">
            Emmit Parubrub
          </AccordionLink>
          <AccordionLink href="https://www.linkedin.com/in/taylorho/">
            Taylor Ho
          </AccordionLink>
          <AccordionLink href="https://www.linkedin.com/in/andrewtaeoalii/">
            Andrew Taeoalii
          </AccordionLink>
        </>
      ),
    },
    {
      label: "Shoot a DM on Twitter",
      body: (
        <>
          <p>
            This works better when your avatar isn't an anime character; but
            we'll work it out.
          </p>
          <AccordionLink href="https://twitter.com/tellaho">
            @tellaho
          </AccordionLink>
          <AccordionLink href="https://twitter.com/AndrewT808">
            @AndrewT808
          </AccordionLink>
          {/* <AccordionLink href="https://twitter.com/HawaiiansInTech">
            @HawaiiansInTech
          </AccordionLink> */}
        </>
      ),
    },
    {
      label: "Github Discussions",
      body: (
        <>
          <p>
            Drop a message in our <strong>Support and Requests</strong>{" "}
            category:
          </p>
          <AccordionLink href="https://github.com/hawaiians/hawaiiansintech/discussions/categories/support-and-requests">
            👀 Support and Requests
          </AccordionLink>
        </>
      ),
    },
    {
      label: "Connect to our Discord Server",
      body: (
        <>
          <AccordionLink href={DISCORD_URL}>
            Hawaiians In Tech Discord
          </AccordionLink>
        </>
      ),
    },
    {
      label: "Send us an email",
      body: (
        <>
          <AccordionLink href="mailto:emmit.parubrub@gmail.com">
            emmit.parubrub@gmail.com
          </AccordionLink>
          <AccordionLink href="mailto:howzit@tellaho.com">
            howzit@tellaho.com
          </AccordionLink>
        </>
      ),
    },
  ];
  const [supportFlows, setSupportFlows] =
    useState<AccordionProps[]>(SUPPORT_FLOWS);
  const handleToggle = (i) => {
    const newFlows = supportFlows.map((flow, newI) => {
      if (i == newI) {
        return { ...flow, open: !flow.open };
      }
      return flow;
    });
    setSupportFlows(newFlows);
  };

  return (
    <div className="email-null-message">
      <div className="email-null-message__headline">
        <Tag>Verification needed</Tag>
        <p>
          <strong>Not quite pau yet!</strong> We want to make sure this is you.
          Should be as easy as shooting us an email, DM, etc.
        </p>
        <p>
          Be sure to include <strong>your email</strong> in the message. We'll
          use that to confirm changes bumbai.
        </p>
        <h4>Ways to verify</h4>
      </div>
      <div className="email-null-message__accordions">
        {supportFlows.map((flow, i) => (
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
      <style jsx>{`
        .email-null-message {
          margin: 2rem 0 0;
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
      `}</style>
    </div>
  );
}
