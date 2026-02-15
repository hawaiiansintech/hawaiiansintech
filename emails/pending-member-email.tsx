import { DISCORD_URL } from "@/pages/about";
import { Text, Link } from "@react-email/components";
import * as React from "react";
import CTABlock from "./ui/cta-block";
import Base from "./ui/base";
import List from "./ui/list";
import { CreateMemberFields } from "@/lib/firebase-helpers/members";
import Layout from "./ui/layout";
import Logo from "./ui/logo";

export default function PendingMemberEmail({
  name = "[Name Inoa]",
  location = "[SF, CA]",
  recordID = "[id-placeholder]",
  email = "[placeholder@hawaiiansintech.org]",
  title = "[Software Engineer]",
  focusSuggested,
  industrySuggested,
  link = "[https://hawaiiansintech.org]",
}: CreateMemberFields) {
  const FIREBASE_URL = `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/data/~2Fmembers~2F${recordID}`;
  const suggestions = [focusSuggested, industrySuggested].filter(Boolean); // filters out empty strings

  return (
    <Base
      preview={`New Member Submission from ${name}`}
      title={`New Member Submission from ${name}`}
    >
      <Layout>
        <Logo />
        <Text className="px-4 text-center text-3xl">
          Pending Submission
          <br />
          <strong>{name}</strong>
        </Text>
        <Text>
          A new member <strong className="font-semibold">{name}</strong> (
          <Link href={`mailto:${email}`} className="text-stone-500 underline">
            {email}
          </Link>
          ) submitted their information.
        </Text>
        <List
          nodes={[
            {
              icon: "💬",
              label: (
                <>
                  Check freeform fields
                  {title && (
                    <>
                      , including their title &ldquo;
                      <strong className="font-semibold">{title}</strong>
                      &rdquo;,
                    </>
                  )}{" "}
                  for misspelling and/or appropriateness.
                  {suggestions.length > 0 && (
                    <>
                      {" "}
                      They also suggested{" "}
                      {suggestions.map((s, i) => (
                        <span key={`suggestion-${i}`}>
                          &ldquo;<strong className="font-semibold">{s}</strong>
                          &rdquo;
                          {(i < suggestions.length - 2 && ", ") ||
                            (i === suggestions.length - 2 && " and ")}
                        </span>
                      ))}
                      .
                    </>
                  )}
                </>
              ),
            },
            {
              icon: "🔗",
              label: (
                <>
                  Check that their URL works.{" "}
                  <Link
                    href={link}
                    className="font-semibold text-inherit underline"
                  >
                    {link}
                  </Link>
                </>
              ),
            },
            {
              icon: "🌏",
              label: (
                <>
                  Parse &ldquo;
                  <strong className="font-semibold">{location}</strong>&rdquo;
                  for the Location and indexed/searchable Region. Always try to
                  merge, when appropriate. Seek the use of proper diacriticals,
                  where{" "}
                  <Link
                    href="https://wehewehe.org"
                    className="text-stone-500 underline"
                  >
                    wehewehe.org
                  </Link>{" "}
                  is your friend!
                </>
              ),
            },
          ]}
        />
        <Text>
          Move their Status to
          <span className="mx-1 my-0 inline-block rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-medium tracking-wide text-emerald-700">
            APPROVED
          </span>
          when all looks well. Then, send a welcome email to let them know
          they&rsquo;re in!
        </Text>
        <Text>
          Move their status to
          <span className="mx-1 my-0 inline-block rounded-full bg-violet-200 px-2 py-0.5 text-xs font-medium tracking-wide text-violet-700">
            IN PROGRESS
          </span>{" "}
          if you have any questions or suggestions. Be concise/clear about the
          intention of suggestions. Share progress in a leads room on{" "}
          <Link href={DISCORD_URL} className="text-stone-500 underline">
            Discord
          </Link>
          !
        </Text>
        <Text>
          Move their status to
          <span className="mx-1 my-0 inline-block rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium tracking-wide text-red-700">
            ARCHIVED
          </span>{" "}
          if it was made in error or any ill intent.
        </Text>
        <CTABlock
          className="mt-4"
          nodes={[
            <>You are receiving this because you are a community manager</>,
            <CTABlock.Button href={FIREBASE_URL}>
              Review {name}
            </CTABlock.Button>,
          ]}
        />
        {recordID && (
          <Text className="mb-0 mt-2 text-center text-xs italic text-stone-300">
            {recordID}
          </Text>
        )}
      </Layout>
    </Base>
  );
}
