import { StaggerText } from "@/components/animation/StraggerText";
import { HashAnchorTarget } from "@/components/HashAnchorTarget";
import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import Head from "next/head";
import Link from "next/link";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Terms of Service · Hawaiians in Technology",
    },
  };
}

export default function PrivacyPolicy({ pageTitle }) {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backLinkTo="/" variant="minimized" />
      <section className="mx-auto max-w-4xl px-4">
        <Heading>Terms of Use &amp; Privacy Policy</Heading>
        <StaggerText
          words={[
            "We",
            "appreciate",
            "you",
            "being",
            "here.",
            "🤙🏼",
            "🤙🏽",
            "🤙🏾",
          ]}
          classNames="mx-auto max-w-2xl flex flex-wrap py-4 text-center gap-1.5 text-3xl sm:gap-4 sm:pt-8 sm:pb-16 sm:text-left sm:text-8xl"
        />
        <p className="text-xl">
          This document outlines the terms of service and privacy policy for
          Hawaiians in Tech. By using our services, you agree to these terms and
          the collection and use of information as described herein.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-4 text-xl sm:my-12 sm:flex sm:space-x-16 sm:px-8">
        <aside className="sm:sticky sm:top-8 sm:shrink-0 sm:self-start">
          <ul className="space-y-1 py-4 font-medium">
            <li>
              <Link href="#information-collection-and-use">
                Information Collection and Use
              </Link>
            </li>
            <li>
              <Link href="#membership-eligibility">Membership Eligibility</Link>
            </li>
            <li>
              <Link href="#community-conduct">Community Conduct</Link>
            </li>
            <li>
              <Link href="#data-privacy-and-security">
                Data Privacy and Security
              </Link>
            </li>
            <li>
              <Link href="#termination-of-membership">
                Termination of Membership
              </Link>
            </li>
            <li>
              <Link href="#changes-to-terms">Changes to Terms</Link>
            </li>
            <li>
              <Link href="#contact-us">Contact Us</Link>
            </li>
          </ul>
        </aside>
        <main className="space-y-8">
          <article className="space-y-4">
            <HashAnchorTarget
              id="information-collection-and-use"
              classNames="space-y-4"
            >
              <h2 className="text-3xl font-semibold">
                Information Collection and Use
              </h2>
              <p>
                We collect minimal personal information necessary to provide our
                services. This includes name, location, and professional
                details.
              </p>
              <p>
                Your contact information is considered private and may only be
                accessed by our internal team. We may use your email to send you
                updates, newsletters, or other communications related to our
                community.
              </p>
              <p>
                We will not share non-public information with outside parties
                without your express permission.
              </p>
            </HashAnchorTarget>

            <HashAnchorTarget
              id="membership-eligibility"
              classNames="space-y-4"
            >
              <h2 className="text-3xl font-semibold">Membership Eligibility</h2>
              <p>
                Representation on the Hawaiians in Tech directory is open to
                individuals who:
              </p>
              <ul className="list-inside list-disc">
                <li>Identify as Native Hawaiian</li>
                <li>
                  Work in or are pursuing a career in technology or related
                  fields
                </li>
                <li>Are at least 13 years of age</li>
              </ul>
              <p>
                When joining our community, we invite you to reflect on your{" "}
                mo&lsquo;okūauhau (genealogy) and your personal connection to
                Hawaiian heritage. This connection might be expressed through
                family histories, cultural practices, and/or your relationship
                with Hawaiian lands and communities.
              </p>
              <p>
                <strong>
                  We will not question or validate anyone&rsquo;s claim to
                  Native Hawaiian identity.
                </strong>{" "}
                We recognize the complexity and sensitivity of indigeneity and
                trust in the sincerity of our community members.
              </p>
              <p>
                We truly appreciate our allies and the support they provide to
                our community. While our primary mission is to nurture and
                empower Native Hawaiians in tech, we welcome allies in many of
                our community spaces.
              </p>
            </HashAnchorTarget>

            <HashAnchorTarget id="community-conduct" classNames="space-y-4">
              <h2 className="text-3xl font-semibold">Community Conduct</h2>
              <p>
                Members are expected to maintain respectful and professional
                behavior in all community interactions. We encourage members to
                participate in community functions and keep their profiles
                up-to-date. If you can&rsquo;t access your account or need help,{" "}
                <Link href={"#contact-us"}>contact us</Link>.
              </p>
              <p>
                We reserve the right to remove content or revoke access for
                violations of community standards.
              </p>
            </HashAnchorTarget>

            <HashAnchorTarget
              id="data-privacy-and-security"
              classNames="space-y-4"
            >
              <h2 className="text-3xl font-semibold">
                Data Privacy and Security
              </h2>
              <p>
                We use a cookie-less, privacy-focused tracking service
                (Plausible) to analyze website activity without collecting
                personally identifiable information.
              </p>
              <p>
                We implement reasonable security measures to protect your
                information. However, no method of transmission over the
                Internet is 100% secure. By using our service, you acknowledge
                this and accept the inherent risks.
              </p>
            </HashAnchorTarget>

            <HashAnchorTarget
              id="termination-of-membership"
              classNames="space-y-4"
            >
              <h2 className="text-3xl font-semibold">
                Termination of Membership
              </h2>
              <p>
                Members may terminate their accounts at any time by contacting
                us. We also reserve the right to ban, terminate, or suspend
                individuals from our services and community spaces for any
                reason.
              </p>
            </HashAnchorTarget>

            <HashAnchorTarget id="changes-to-terms" classNames="space-y-4">
              <h2 className="text-3xl font-semibold">Changes to Terms</h2>
              <p>
                We may update these terms periodically. We will notify users of
                any changes by posting the new terms on this page. Continued use
                of our services after changes constitutes acceptance of the new
                terms.
              </p>
            </HashAnchorTarget>

            <HashAnchorTarget id="contact-us" classNames="space-y-4">
              <h2 className="text-3xl font-semibold">Contact Us</h2>
              <p>
                Please feel free to reach out to{" "}
                <Link href={"mailto:kekai@hawaiiansintech.org"}>Kekai</Link> or{" "}
                <Link href={"mailto:kamakani@hawaiiansintech.org"}>
                  Kamakani
                </Link>{" "}
                for any questions or concerns.
              </p>
            </HashAnchorTarget>
          </article>
        </main>
      </section>
    </>
  );
}
