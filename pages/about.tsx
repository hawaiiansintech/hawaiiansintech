import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav";
import { Title } from "@/components/Title.js";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import theme from "styles/theme";

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

export const DISCORD_URL = "https://discord.gg/p7338Z5MJQ";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Hawaiians in Technology | About</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <Nav backUrl="/" />

      <div className="about-splash">
        <Title
          className="m0 p0"
          text="Hawaiians*in&nbsp;Technology"
          noAnimation
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <p className="f1 extend">
            <motion.span variants={item}>
              is a directory and community of <strong>Native Hawaiians</strong> in
              the
            </motion.span>{" "}
            <motion.span variants={item}>
              <strong>technology industry</strong>. The goal is to connect,
              inspire, provide
            </motion.span>{" "}
            <motion.span variants={item}>
              representation, and promote the presence of Native Hawaiians
            </motion.span>{" "}
            <motion.span variants={item}>
              who work in the technology industry.
            </motion.span>{" "}
          </p>
        </motion.div>
      </div>

      <div className="moreabout">
        <div className="col-left">
          <h3>How can I add myself?</h3>
          <p>
            If you are <strong>Native Hawaiian</strong>, work in{" "}
            <strong>the field / industry of technology</strong>, and want to be
            part of this directory and community, simply complete this{" "}
            <Link href="/join/01-you">
              <a>Join form</a>
            </Link>
            .
          </p>
          <p>
            Most could just stop there. But reach out to the community! Meet
            your fellow kanaka. No shame!
          </p>
          <h3>How did you build this?</h3>
          <p>
            You can learn more about how this project was built on our
            open-source{" "}
            <a
              target="_blank"
              href="https://github.com/hawaiians/hawaiiansintech"
            >
              Github
            </a>{" "}
            repo.
          </p>
          <h3>How did you come up with this idea?</h3>
          <p>This project is one of many like it with similar motivations.</p>
          <p>
            This website was originally a fork of{" "}
            <a href="https://brazilianswho.design/">Brazillians Who Design</a>'s
            repo. There are many more that continue to inspire us, including:
          </p>
          <p>
            <ul className="link-list">
              <li className="link-list__item">
                <a href="https://nativesintech.org/">Natives in Tech</a>
              </li>
              <li className="link-list__item">
                <a href="https://womenwho.design/">Women Who Design</a>
              </li>
              <li className="link-list__item">
                <a target="_blank" href="https://www.womenwhodraw.com/">
                  Women Who Draw
                </a>
              </li>
              <li className="link-list__item">
                <a target="_blank" href="http://www.28blacks.com/">
                  28 Black Designers
                </a>
              </li>
              <li className="link-list__item">
                <a target="_blank" href="https://www.latinxswhodesign.com/">
                  Latinx Who Design
                </a>
              </li>
              <li className="link-list__item">
                <a target="_blank" href="https://queerdesign.club/">
                  Queer Design Club
                </a>
              </li>
              <li className="link-list__item">
                <a
                  target="_blank"
                  href="https://filipinos-who-design.webflow.io/"
                >
                  Filipinos Who Design
                </a>
              </li>
              <li className="link-list__item">
                <a target="_blank" href="https://www.apiwho.design/">
                  Asian & Pacific Islanders Who Design
                </a>
              </li>
              <li className="link-list__item">
                <a
                  target="_blank"
                  href="https://filipinos-who-design.webflow.io/"
                >
                  People Of Craft
                </a>
              </li>
              <li className="link-list__item">
                <a target="_blank" href="https://indianswhodesign.in/">
                  Indians Who Design
                </a>
              </li>
            </ul>
          </p>
          <h3>Who’s behind this?</h3>
          <p>
            <a href="https://www.linkedin.com/in/emmit-parubrub/">
              Emmit Parubrub
            </a>
            <br></br>
            <a href="https://twitter.com/tellaho">Taylor Ho</a>
          </p>
        </div>
        <div className="col-right">
          <h3>How can I get more involved with the community?</h3>
          <p>
            You can join our{" "}
            <a href={`${DISCORD_URL}`} target="_blank">
              Discord
            </a>{" "}
            to connect with our community, get information on events, find new
            project opportunities, and more.
          </p>
          <p>
            You also can post new and discuss other's ideas on this board on{" "}
            <a
              href={`https://github.com/hawaiians/hawaiiansintech/discussions/categories/ideas`}
              target="_blank"
            >
              Github Discussions
            </a>
            , if that's more your speed.
          </p>
          <p>You should feel encouraged to come forward with new ideas.</p>
          <h3>How can I update my profile? Or remove myself altogether?</h3>
          <p>
            Changes, including removal from the list, can be{" "}
            <Link href="/edit">
              <a>requested here</a>
            </Link>
            .
          </p>
        </div>
      </div>

      <style jsx>{`
        .about-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .about-splash {
            margin: 0 2rem;
          }
        }

        .extend {
          margin: 0;
          max-width: 24ch;
        }

        .moreabout {
          font-weight: normal;
          font-size: 1.5rem;
          line-height: 140%;
          letter-spacing: 0.01em;
          display: flex;
          margin: 8rem 1rem 0;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .moreabout {
            margin: 0 2rem;
          }
        }

        .moreabout > div {
          width: 50%;
          max-width: 50ch;
        }
        .moreabout strong {
          font-weight: 600;
          color: ${theme.color.text.alt};
        }

        .col-right {
          padding-left: 3rem;
        }
        .col-left {
          padding-right: 3rem;
        }

        .moreabout p {
          margin: 0;
          padding: 0;
        }

        .moreabout p ~ p {
          margin-top: 1rem;
        }

        .moreabout h3 {
          padding: 0;
          margin: 0;
          font-size: 1.5rem;
        }

        .moreabout h3 {
          margin: 4rem 0 0.5rem 0;
        }
        a {
          font-weight: 600;
          text-decoration: underline;
        }
        a:hover {
          text-decoration: none;
        }

        .link-list,
        .link-list__item {
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .link-list {
          display: grid;
          grid-auto-flow: row;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
        }
        .link-list__item {
          text-align: center;
        }
        .link-list__item a {
          display: inline-block;
          padding: 0.5rem;
          line-height: 1.2;
          font-size: 1.125rem;
        }

        @media (max-width: 480px) {
          .moreabout {
            display: block;
          }

          .moreabout > div {
            width: 100%;
            max-width: 100%;
            display: block;
            padding: 0;
          }
        }
      `}</style>
    </>
  );
}
