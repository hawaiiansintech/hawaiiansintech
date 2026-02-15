import MetaTags from "@/components/Metatags";
import Nav, { generateNavUrl, NavAppearance } from "@/components/Nav";
import Plausible from "@/components/Plausible";
import { Title } from "@/components/Title";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";

const item = {
  hidden: { opacity: 0, y: "15%" },
  show: { opacity: 1, y: "0%" },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const DISCORD_URL = "https://hawaiiansintech.org/discord";
export const GITHUB_URL = "https://github.com/hawaiians/hawaiiansintech";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "About · Hawaiians in Technology",
    },
  };
}

export default function AboutPage({ pageTitle }) {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backLinkTo="/" variant="minimized" />

      <div
        className={`
          px-4
          pt-[26vh]
          lg:px-8
        `}
      >
        <Title text="Hawaiians*in&nbsp;Technology" noAnimation />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <p className="text-4xl font-medium tracking-tighter md:text-6xl xl:text-8xl">
            <motion.span
              className="inline text-stone-800 md:inline-block"
              variants={item}
            >
              is a directory and community of{" "}
              <strong className="font-semibold text-stone-900">
                Native Hawaiians
              </strong>{" "}
              in the{" "}
              <strong className="font-semibold text-stone-900">
                technology industry
              </strong>
              .
            </motion.span>{" "}
          </p>
          <div className="my-12 max-w-7xl space-y-4 text-3xl leading-relaxed text-stone-600">
            <motion.p variants={item}>
              Our platform strives to bring Native Hawaiians together; to
              provide a space to connect and collaborate with one another; to
              serve as a source of inspiration for those who want to pursue a
              career in technology.
            </motion.p>
            <motion.p variants={item}>
              Providing representation and promoting the presence of Native
              Hawaiians working in technology is our way of contributing to a
              more diverse and inclusive industry. Through various initiatives,
              we seek to uplift and empower Native Hawaiians in the tech
              industry, while also fostering a sense of community and belonging
              among our members.
            </motion.p>{" "}
          </div>
        </motion.div>
      </div>

      <div
        className={`
          my-12
          grid
          max-w-7xl
          grid-flow-row
          grid-cols-1
          gap-8
          px-4
          text-2xl
          leading-normal
          text-stone-600
          sm:grid-cols-2
          lg:px-8
        `}
      >
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-stone-800">
            How can I add myself?
          </h3>
          <p>
            If you are{" "}
            <strong className="font-semibold text-stone-800">
              Native Hawaiian
            </strong>{" "}
            and work in{" "}
            <strong className="font-semibold text-stone-800">
              the field / industry of technology,
            </strong>{" "}
            you can{" "}
            <Link href="/join/01-you" className="font-semibold">
              join here
            </Link>
            .
          </p>
          <p>
            Most could just stop there. But reach out to the community! Meet
            your fellow kanaka. No shame!
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-stone-800">
            How can I get more involved with the community?
          </h3>
          <p>
            You can join our{" "}
            <Link
              href={`${DISCORD_URL}`}
              target="_blank"
              className="font-semibold"
            >
              Discord
            </Link>{" "}
            to connect with our community, get information on events, find new
            project opportunities, and more.
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-stone-800">
            How did you come up with this idea?
          </h3>
          <p>This project is one of many like it with similar motivations.</p>
          <p>
            This website was originally a fork of{" "}
            <Link
              href="https://brazilianswho.design/"
              className="font-semibold"
              target="_blank"
            >
              Brazillians Who Design
            </Link>
            &rsquo;s repo. There are many more that continue to inspire us,
            including:{" "}
            <Link
              className="font-semibold"
              target="_blank"
              href="https://nativesintech.org/"
            >
              Natives in Tech
            </Link>
            ,{" "}
            <Link
              className="font-semibold"
              target="_blank"
              href="https://womenwho.design/"
            >
              Women Who Design
            </Link>
            ,{" "}
            <Link
              className="font-semibold"
              target="_blank"
              href="https://www.womenwhodraw.com/"
            >
              Women Who Draw
            </Link>
            ,{" "}
            <Link
              className="font-semibold"
              target="_blank"
              href="https://www.latinxswhodesign.com/"
            >
              Latinx Who Design
            </Link>
            ,{" "}
            <Link
              className="font-semibold"
              target="_blank"
              href="https://queerdesign.club/"
            >
              Queer Design Club
            </Link>
            ,{" "}
            <Link
              className="font-semibold"
              target="_blank"
              href="https://www.apiwho.design/"
            >
              Asian & Pacific Islanders Who Design
            </Link>
            , and{" "}
            <Link
              className="font-semibold"
              target="_blank"
              href="https://indianswhodesign.in/"
            >
              Indians Who Design
            </Link>
            .
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-stone-800">
            How did you build this?
          </h3>
          <p>
            You can learn more about how this project was built on our
            open-source{" "}
            <Link target="_blank" href={GITHUB_URL} className="font-semibold">
              Github
            </Link>{" "}
            repo.
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-stone-800">
            Who’s behind this?
          </h3>
          <p>
            <Link
              href="https://www.linkedin.com/in/emmit-parubrub/?source=about"
              target="_blank"
              className="font-semibold"
            >
              Emmit Parubrub
            </Link>
            <br />
            <Link
              href="https://linkedin.com/in/taylorho/?source=about"
              target="_blank"
              className="font-semibold"
            >
              Taylor Ho
            </Link>
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-stone-800">
            How can I update my profile? Or remove myself altogether?
          </h3>
          <p>
            Changes, including removal from the list, can be{" "}
            <Link href="/edit" className="font-semibold">
              requested here
            </Link>
            .
          </p>
        </section>
        <section className="flex gap-4 text-lg font-semibold">
          <Link
            className=""
            href={generateNavUrl(`/terms-of-use`, NavAppearance.ToMin)}
          >
            Terms of Use &amp; Privacy Policy
          </Link>
        </section>
      </div>
    </>
  );
}
