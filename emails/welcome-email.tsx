import { DISCORD_URL, GITHUB_URL } from "@/pages/about";
import { Text, Link } from "@react-email/components";
import * as React from "react";
import Base from "./ui/base";
import List from "./ui/list";
import { CreateMemberFields } from "@/lib/firebase-helpers/members";
import Layout from "./ui/layout";
import Logo from "./ui/logo";

export default function WelcomeEmail({
  name = "[Name Inoa]",
  recordID = "[id-placeholder]",
  email = "[placeholder@hawaiiansintech.org]",
}: CreateMemberFields) {
  const VERIFICATION_LINK = "#";

  return (
    <Base
      preview="Our little hui grows by one (yeah, you)"
      title="Welcome to Hawaiians in Tech"
      align="left"
    >
      <Layout>
        <Logo align="left" />
        <Text>
          <span className="block text-2xl font-medium leading-loose">
            {name}, welcome to
          </span>
          <strong className="text-5xl font-semibold">Hawaiians in Tech</strong>
        </Text>
        {/* {VERIFICATION_LINK && (
        <CTABlock
          nodes={[
            <Text className="my-0 pr-4 text-center text-xs text-stone-500">
              You signed up with {email}
            </Text>,
            <CTABlock.Button href={VERIFICATION_LINK}>
              Verify Email
            </CTABlock.Button>,
          ]}
        />
      )} */}

        <Text className="mt-5">Aloha kāua e {name},</Text>
        <Text>
          Mahalo nui for joining Hawaiians In Tech! We&rsquo;re excited to
          welcome you into our hui of Native Hawaiians in technical fields and
          in the technology industry. Together we can inspire and support each
          other.
        </Text>
        <Text>
          A community manager should be reaching out once we review your
          submission and get you added to the directory. Beyond that, this is a
          pretty (intentionally) simple operation. 🤙🏼🤙🏽🤙🏾
        </Text>

        <List
          nodes={[
            {
              icon: "🖥️",
              label: (
                <>
                  <Link
                    className="font-bold text-inherit"
                    href="https://hawaiiansintech.org?utm_source=confirmation-email-body"
                  >
                    Connect with people who share an area of focus
                  </Link>
                  . Try searching for others via our Home directory, then shoot
                  an introductory DM on LinkedIn or otherwise. Mai hilahila.{" "}
                  <Link
                    className="text-brown-500 text-inherit"
                    href="https://hawaiiansintech.org?utm_source=confirmation-email-body"
                  >
                    → Home
                  </Link>
                </>
              ),
            },
            {
              icon: "💬",
              label: (
                <>
                  <Link
                    className="font-bold text-inherit"
                    href={`${DISCORD_URL}?utm_source=confirmation-email-body`}
                  >
                    Join the discussion on our Discord server
                  </Link>
                  . Even if you&rsquo;ve never heard of it, it&rsquo;s just like
                  Slack. Our busiest channels are{" "}
                  <strong className="font-semibold text-stone-500">
                    #opportunities
                  </strong>{" "}
                  and{" "}
                  <strong className="font-semibold text-stone-500">
                    #events
                  </strong>
                  .{" "}
                  <Link
                    className="font-medium text-brown-500 text-inherit"
                    href="https://hawaiiansintech.org/discord?utm_source=confirmation-email-body"
                  >
                    → Discord
                  </Link>
                </>
              ),
            },
            {
              icon: "⌨️",
              label: (
                <>
                  <Link className="font-bold text-inherit" href={GITHUB_URL}>
                    Contribute to our projects on GitHub
                  </Link>
                  . We welcome all ideas and moving hands on keyboards. Build
                  features; participate in code reviews; offer technical
                  mentorship and seek it out!{" "}
                  <Link
                    className="font-medium text-brown-500 text-inherit"
                    href={GITHUB_URL}
                  >
                    → Github
                  </Link>
                </>
              ),
            },
          ]}
        />

        <Text className="mb-0">E ola,</Text>
        <Text className="mt-0">The Hawaiians in Tech team</Text>
        <Text className="my-0 text-center text-stone-500">
          <Link
            href="https://hawaiiansintech.org/about?utm_source=confirmation-email-footer"
            className="text-xs text-inherit"
          >
            About
          </Link>
          <span className="mx-1">·</span>
          <Link
            href="https://hawaiiansintech.org/terms-of-use?utm_source=confirmation-email-footer"
            className="text-xs text-inherit"
          >
            Privacy Policy
          </Link>
        </Text>
        {recordID && (
          <Text className="mb-0 mt-2 text-center text-xs italic text-stone-300">
            {recordID}
          </Text>
        )}
      </Layout>
    </Base>
  );
}
