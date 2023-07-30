import { StaggerText } from "@/components/animation/StraggerText";
import { HashAnchorTarget } from "@/components/HashAnchorTarget";
import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Pill from "@/components/Pill";
import Plausible from "@/components/Plausible";
import Head from "next/head";
import Link from "next/link";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Privacy Policy · Hawaiians in Technology",
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
      <Nav backUrl="/" />
      <section className="mx-auto max-w-4xl space-y-8 px-4">
        <Heading>Privacy Policy</Heading>
        <StaggerText
          words={[
            "Your",
            "privacy",
            "is",
            "important",
            "to",
            "us.",
            "🤙🏼",
            "🤙🏽",
            "🤙🏾",
          ]}
          classNames="mx-auto max-w-2xl flex flex-wrap py-4 text-center gap-1.5 text-4xl sm:gap-4 sm:py-16 sm:text-left sm:text-8xl"
        />
        <p>
          When you use our website, you’re trusting us with your information. We
          understand this kuleana and work hard to protect your information and
          to put you in control. It is Hawaiians in Technology's policy to
          respect your privacy regarding any information we may collect from you
          across our website,{" "}
          <Link href="https://hawaiiansintech.org">hawaiiansintech.org</Link>,
          and other sites we own and operate.
        </p>
      </section>
      <section
        className={`
          mx-auto
          max-w-7xl
          px-4
          text-xl
          sm:my-12
          sm:flex
          sm:space-x-16
          sm:px-8
        `}
      >
        <aside
          className={`
            sm:sticky
            sm:top-8
            sm:shrink-0
            sm:self-start
          `}
        >
          <ul
            className={`
                  space-y-1
                  py-4
                  font-medium
                `}
          >
            <li>
              <Link
                href="#information-we-collect"
                className="text-xl font-bold"
              >
                Information we collect
              </Link>
            </li>
            <li className="pl-4">
              <Link href="#joining-the-directory">Joining the Directory</Link>
            </li>
            <li className="pl-4">
              <Link href="#website-analytics">Website Analytics</Link>
            </li>
            <li className="pl-4">
              <Link href="#user-generated-content">User-Generated Content</Link>
            </li>
            <li className="pl-4">
              <Link href="#children-and-privacy">Children and Privacy</Link>
            </li>
            <li>
              <Link href="#security" className="text-xl font-bold">
                Security
              </Link>
            </li>
            <li className="pl-4">
              <Link href="#data-retention">Data Retention</Link>
            </li>
            <li>
              <Link
                href="#your-rights-and-choices"
                className="text-xl font-bold"
              >
                Your rights and choices
              </Link>
            </li>
            <li className="pl-4">
              <Link href="#removal-from-the-directory">
                Removal from the Directory
              </Link>
            </li>
            <li className="pl-4">
              <Link href="#updates-and-notifications">
                Updates and notifications
              </Link>
            </li>
            <li className="pl-4">
              <Link href="#contact-us">Contact Us</Link>
            </li>
            <li>
              <p className="flex items-center gap-1 py-4 text-sm font-medium text-stone-800">
                Last updated{" "}
                <span className="inline-flex">
                  <Pill>August 1, 2023</Pill>
                </span>
              </p>
            </li>
          </ul>
        </aside>
        <main
          className={`
          space-y-8
        `}
        >
          <article
            className={`
              space-y-4
            `}
          >
            <HashAnchorTarget
              id="information-we-collect"
              classNames="space-y-2"
            >
              <h2
                className={`
                text-5xl
                font-semibold
              `}
              >
                Information we collect
              </h2>
            </HashAnchorTarget>
            <p>
              Our collection and use of personal data varies depending on the
              context of your interactions with us. We collect information that
              you provide to us directly, such as when you join the directory or
              communicate with us.
            </p>
            <p>
              While public information will be generally available on the
              website,{" "}
              <strong>we won’t mass distribute or sell this information</strong>{" "}
              without your consent.
            </p>
            <HashAnchorTarget id="joining-the-directory" classNames="space-y-2">
              <h3 className="text-3xl font-semibold">Joining the Directory</h3>
              <p>
                When you join the directory, we collect{" "}
                <strong>
                  your name, location, aspects of your professional career, and
                  other public information
                </strong>{" "}
                you choose to provide. This information may be displayed and be
                used to filter the directory.
              </p>
              <p>
                We take the stance that{" "}
                <strong>your email address is private information</strong>. We
                will not share (or sell) it without your explicit consent. Only
                trusted members of our administrative hui will have access to
                this contact information.
              </p>
              <p>
                On joining the directory, we assign you a{" "}
                <strong>unique ID</strong>. This ID helps us recognize you when
                you visit the site later.
              </p>
              <p>
                We also <strong>track metrics of visitor events</strong> related
                to the directory, like click counts of the link you provided us.
                Please{" "}
                <Link
                  href="mailto:kekai@hawaiiansintech.org,kamakani@hawaiiansintech.org"
                  target="_blank"
                >
                  reach out directly
                </Link>{" "}
                if you'd like to access or opt out of this tracking.
              </p>
            </HashAnchorTarget>
            <HashAnchorTarget id="website-analytics" classNames="space-y-2">
              <h3 className="text-3xl font-semibold" id="website-analytics">
                Website Analytics
              </h3>
              <p>
                We use a{" "}
                <strong>cookie-less, privacy-focused tracking service</strong>{" "}
                called{" "}
                <Link href="https://plausible.io/" target="_blank">
                  Plausible
                </Link>{" "}
                to track and analyze activity on our website. This includes the
                URLs of any pages visited, the URL of the website from which you
                came to our sites, how long you spent on a page, access times,
                and other details during your visit. This is done{" "}
                <strong>
                  without passing any personal data or personally identifiable
                  information (PII)
                </strong>{" "}
                to the tracking service.
              </p>
            </HashAnchorTarget>
            <HashAnchorTarget
              id="user-generated-content"
              classNames="space-y-2"
            >
              <h3 className="text-3xl font-semibold">User-Generated Content</h3>
              {/* <p>
            We may offer the{" "}
            <strong>
              ability to post content that other visitors can read
            </strong>{" "}
            (e.g., educational collections, or comments). Anyone can read,
            collect and use any personal information that accompanies your
            posts. If you choose to voluntarily disclose personal information in
            your posts, that information will be considered public information
            and the protections of this Privacy Policy will not apply.
          </p>
          <p>
            We don't have to publish your content. If we or our moderators deem
            it as innappropriate, or if the law requires us to take any content
            down, we reserve the right to remove or edit it.
          </p> */}
              <p>
                Our website may contain links to external sites that are not
                operated by us. Please be aware that we have no control over the
                content and practices of these sites, and cannot accept
                responsibility or liability for their respective privacy
                policies.
              </p>
            </HashAnchorTarget>
            <HashAnchorTarget id="children-and-privacy" classNames="space-y-2">
              <h3 className="text-3xl font-semibold">Children and Privacy</h3>
              <p>
                We believe in the importance of protecting the privacy of
                children online and{" "}
                <strong>
                  do not knowingly contact or collect personal information from
                  children under 13
                </strong>
                .
              </p>
              <p>
                Unless otherwise stated, our websites are not intended to
                solicit information of any kind from children under 13.
              </p>
            </HashAnchorTarget>
          </article>
          <article
            className={`
              space-y-4
            `}
          >
            <HashAnchorTarget id="security" classNames="space-y-2">
              <h2 className="text-5xl font-semibold">Security</h2>
            </HashAnchorTarget>

            <p>
              We take reasonable precautions to provide a{" "}
              <strong>
                sufficient level of security in handling your personal data
              </strong>
              . We employ both technical and administrative measures to
              safeguard the personal data governed by this Policy, preventing
              unauthorized access, destruction, loss, alteration, or misuse.
              Nevertheless, it is important to note that no data transmission or
              storage system can be guaranteed to be 100% secure.
            </p>
            <HashAnchorTarget id="data-retention" classNames="space-y-2">
              <h3 className="text-3xl font-semibold">Data Retention</h3>
              <p>
                Your data will be retained while you have an active account with
                us, or until you delete it. You can also request data removal
                via email, and we will do our best to promptly comply. If you
                close your account, we will keep your data for a reasonable
                period to meet legal obligations, enforce our terms of service,
                or handle disputes.
              </p>
              <p>
                It's essential to keep your information accurate and up-to-date.
                Please review and update your data regularly for the best
                experience with our services.
              </p>
            </HashAnchorTarget>
          </article>
          <article
            className={`
              space-y-4
            `}
          >
            <HashAnchorTarget
              id="your-rights-and-choices"
              classNames="space-y-2"
            >
              <h2 className="text-5xl font-semibold">
                Your rights and choices
              </h2>
            </HashAnchorTarget>
            <HashAnchorTarget
              id="removal-from-the-directory"
              classNames="space-y-2"
            >
              <h3 className="text-3xl font-semibold">
                Removal from the Directory
              </h3>
              <p>
                If you{" "}
                <strong>would like to be removed from the directory</strong>,
                you may opt-out by logging in or by{" "}
                <Link
                  href="mailto:kekai@hawaiiansintech.org,kamakani@hawaiiansintech.org"
                  target="_blank"
                >
                  letting us know
                </Link>
                . We will try to comply with any request as soon as possible.
              </p>
            </HashAnchorTarget>
            <HashAnchorTarget
              id="updates-and-notifications"
              classNames="space-y-2"
            >
              <h3 className="text-3xl font-semibold">
                Updates and notifications
              </h3>
              <p>
                If you{" "}
                <strong>
                  no longer want to receive feature and update emails from us
                </strong>
                , you may opt-out by letting us know in a reply. We will try to
                comply with any request as soon as possible. Please note that if
                you opt-out of receiving feature and update emails, we retain
                the right to communicate to you regarding the important notices
                around the service (e.g. support and important legal notices).
              </p>
              <p>
                We may change this Policy from time to time to reflect new
                services, changes in our privacy practices or relevant laws. The
                “Last updated” legend at the top of this Policy indicates when
                this Policy was last revised. Any changes are effective the
                latter of when we post the revised Policy on the Services or
                otherwise provide notice of the update as required by law.
              </p>
            </HashAnchorTarget>
            <HashAnchorTarget id="contact-us" classNames="space-y-2">
              <h3 className="text-3xl font-semibold" id="contact-us">
                Contact Us
              </h3>
              <p>
                Your continued use of our website will be regarded as acceptance
                of our practices around privacy and personal information. If you
                have any questions about how we handle user data and personal
                information, feel free to{" "}
                <Link
                  href="mailto:kekai@hawaiiansintech.org,kamakani@hawaiiansintech.org"
                  target="_blank"
                >
                  contact us
                </Link>
                .
              </p>
            </HashAnchorTarget>
          </article>
        </main>
      </section>
    </>
  );
}
