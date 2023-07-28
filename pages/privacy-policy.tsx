import { Heading, Subheading } from "@/components/Heading";
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
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex flex-col justify-center gap-4">
          <Heading>Privacy Policy</Heading>
          <Subheading>Papa Hana Pilikino</Subheading>
          <p className="flex gap-1 font-semibold">
            Last updated:{" "}
            <span className="inline-block">
              <Pill>August 1, 2023</Pill>
            </span>
          </p>
          <p>
            Your privacy is important to us. When you use our website, you’re
            trusting us with your information. We understand this is a big
            responsibility and work hard to protect your information and put you
            in control. It is Hawaiians in Technology's policy to respect your
            privacy regarding any information we may collect from you across our
            website,{" "}
            <Link href="https://hawaiiansintech.org">hawaiiansintech.org</Link>,
            and other sites we own and operate.
          </p>
          <ul
            className={`
              space-y-1
              border-y
              border-tan-300
              py-4
              font-medium
            `}
          >
            <li>
              <Link
                href="#information-we-collect"
                className="text-xl font-semibold"
              >
                Information we collect
              </Link>
            </li>
            <li className="pl-4">
              <Link href="#user-generated-content">User-Generated Content</Link>
            </li>
            <li className="pl-4">
              <Link href="#website-analytics">Website Analytics</Link>
            </li>
            <li className="pl-4">
              <Link href="#children-and-privacy">Children and Privacy</Link>
            </li>
            <li>
              <Link href="#security" className="text-xl font-semibold">
                Security
              </Link>
            </li>
            <li className="pl-4">
              <Link href="#data-retention">Data Retention</Link>
            </li>
            <li>
              <Link
                href="#your-rights-and-choices"
                className="text-xl font-semibold"
              >
                Your rights and choices
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
          </ul>
          <h2 className="text-4xl font-semibold" id="information-we-collect">
            Information we collect
          </h2>
          <p>
            Our collection and use of personal data varies depending on the
            context of your interactions with us. We collect information that
            you provide to us directly, such as when you join the directory or
            communicate with us.
          </p>
          <h3 className="text-xl font-bold" id="joining-the-directory">
            Joining the Directory
          </h3>
          <p>
            When you join the directory, we collect{" "}
            <strong>
              your name, location, aspects of your professional career, and
              other public information
            </strong>{" "}
            you choose to provide. This information may be displayed and be used
            to filter the directory.
          </p>
          <p>
            While public information is generally available on the website,{" "}
            <strong>we won’t mass distribute or sell this information</strong>{" "}
            without your consent.
          </p>
          <p>
            We take the stance that{" "}
            <strong>your email address is private information</strong>. We will
            not share it with anyone without your explicit consent. Only trusted
            members of our administrative hui will have access to your email
            address.
          </p>
          <p>
            On joining the directory, we assign you a <strong>unique ID</strong>
            . This ID helps us recognize you when you visit the site later.
          </p>
          <p>
            We also <strong>track metrics of visitor events</strong> related to
            the directory, like click counts of the link you provided us. Please{" "}
            <Link
              href="mailto:kekai@hawaiiansintech.org,kamakani@hawaiiansintech.org"
              target="_blank"
            >
              reach out directly
            </Link>{" "}
            if you'd like to access or opt out of this tracking.
          </p>
          <h3 className="text-xl font-bold" id="user-generated-content">
            User-Generated Content
          </h3>
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
            responsibility or liability for their respective privacy policies.
          </p>
          <h3 className="text-xl font-bold" id="website-analytics">
            Website Analytics
          </h3>
          <p>
            We use a{" "}
            <strong>cookie-less, privacy-focused tracking service</strong> to
            track and analyze activity on our website. This includes the URLs of
            any pages visited, the URL of the website from which you came to our
            sites, how long you spent on a page, access times, and other details
            during your visit. This is done{" "}
            <strong>
              without passing any personal data or personally identifiable
              information (PII)
            </strong>{" "}
            to the tracking service.
          </p>
          <h3 className="text-xl font-bold" id="children-and-privacy">
            Children and Privacy
          </h3>
          <p>
            We believe in the importance of protecting the privacy of children
            online and{" "}
            <strong>
              do not knowingly contact or collect personal information from
              children under 13
            </strong>
            .
          </p>
          <p>
            Unless otherwise stated, our websites are not intended to solicit
            information of any kind from children under 13.
          </p>
          <h2 className="text-4xl font-semibold" id="security">
            Security
          </h2>
          <p>
            We take reasonable precautions to provide a{" "}
            <strong>
              sufficient level of security in handling your personal data
            </strong>
            . We employ both technical and administrative measures to safeguard
            the personal data governed by this Policy, preventing unauthorized
            access, destruction, loss, alteration, or misuse. Nevertheless, it
            is important to note that no data transmission or storage system can
            be guaranteed to be 100% secure.
          </p>
          <h3 className="text-xl font-bold" id="data-retention">
            Data Retention
          </h3>
          <p>
            Your data will be retained while you have an active account with us,
            or until you delete it. You can also request data removal via email,
            and we will do our best to promptly comply. If you close your
            account, we will keep your data for a reasonable period to meet
            legal obligations, enforce our terms of service, or handle disputes.
          </p>
          <p>
            It's essential to keep your information accurate and up-to-date.
            Please review and update your data regularly for the best experience
            with our services.
          </p>
          <h2 className="text-4xl font-semibold" id="your-rights-and-choices">
            Your rights and choices
          </h2>
          <p>
            If you <strong>would like to be removed from the directory</strong>,
            you may opt-out by logging in or by{" "}
            <Link
              href="mailto:kekai@hawaiiansintech.org,kamakani@hawaiiansintech.org"
              target="_blank"
            >
              letting us know
            </Link>
            . We will try to comply with any request as soon as possible.
          </p>
          <h3 className="text-xl font-bold" id="updates-and-notifications">
            Updates and notifications
          </h3>
          <p>
            If you{" "}
            <strong>
              no longer want to receive feature and update emails from us
            </strong>
            , you may opt-out by letting us know in a reply. We will try to
            comply with any request as soon as possible. Please note that if you
            opt-out of receiving feature and update emails, we retain the right
            to communicate to you regarding the important notices around the
            service (e.g. support and important legal notices).
          </p>
          <p>
            We may change this Policy from time to time to reflect new services,
            changes in our privacy practices or relevant laws. The “Last
            updated” legend at the top of this Policy indicates when this Policy
            was last revised. Any changes are effective the latter of when we
            post the revised Policy on the Services or otherwise provide notice
            of the update as required by law.
          </p>
          <h3 className="text-xl font-bold" id="contact-us">
            Contact Us
          </h3>

          <p>
            Your continued use of our website will be regarded as acceptance of
            our practices around privacy and personal information. If you have
            any questions about how we handle user data and personal
            information, feel free to{" "}
            <Link
              href="mailto:kekai@hawaiiansintech.org,kamakani@hawaiiansintech.org"
              target="_blank"
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
