import Accordion, { AccordionProps } from "@/components/Accordion";
import Code from "@/components/Code";
import Logo from "@/components/Logo";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import Tag from "@/components/Tag";
import { Subtitle } from "@/components/Title";
import { CONTACT_METHODS } from "@/lib/contact-methods";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

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
            {emailNull ? (
              <>
                <Subtitle text="We&nbsp;got&nbsp;the&nbsp;request" />
              </>
            ) : (
              <Subtitle text="Request&nbsp;sent&nbsp;successfully" />
            )}
            <img
              src={"/images/shaka.gif"}
              alt="Animated shaka, rotating left to right, real loose"
              className="w-20"
            />
          </div>

          {emailNull ? (
            <EmailNullMessage />
          ) : (
            <>
              <h2 className="text-base">
                <strong>
                  Expect one of us to reach out about this{" "}
                  {removeRequest ? "removal" : "change"}
                </strong>{" "}
                as soon as we can get to it. We review all changes manually
                for... quality assurance. 😆
              </h2>
              <h2 className="text-base">
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
              <strong>Member ID</strong>: <Code noWrap>{id}</Code>
            </h6>
          ) : null}
        </main>
      </div>
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
      <div className="mb-4 mt-4 w-full max-w-lg rounded-lg border border-tan-300">
        <div className="flex flex-col gap-2 p-4">
          <div>
            <Tag>Verification needed</Tag>
          </div>
          <p>
            In 2022, we started using email to confirm changes being made. We
            never got yours. Verifying your identity should be as easy as
            shooting us a message, DM, etc.
          </p>
          <p>
            Be sure to include <strong>your email</strong> in the message.
            We&rsquo;ll use that to confirm changes bumbai.
          </p>
          <h4 className="text-sm font-semibold">Ways to verify</h4>
        </div>
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
    </>
  );
}
