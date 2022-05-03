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

const DISCORD_URL = "https://discord.gg/p7338Z5MJQ";

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
          text="Hawaiians*in&nbsp;Technology&nbsp;is&nbsp;a"
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
              directory and community of <strong>Native Hawaiians</strong> in
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
          <h3>How can I nominate someone?</h3>
          <p>
            If you or someone you know is a Native Hawaiian who works in the
            technology industry, and wants to be part of this directory and
            community, please{" "}
            <Link href="/nominate">
              <a className="link">fill out this form</a>
            </Link>{" "}
            with your/their information and a link to your/their social profile.
            The link can be to a Github, a Linkedin, a website, etc...
          </p>

          <h3>How did you come up with this idea?</h3>
          <p>
            We didn’t. This website is a fork of
            <a className="link" href="https://brazilianswho.design/">
              Brazillians Who Design
            </a>
            {", "}
            who have also credited inspiration from their sibling sites:
          </p>
          <p>
            <a className="link" href="https://womenwho.design/">
              Women Who Design
            </a>
            <br></br>
            <a className="link" href="https://www.womenwhodraw.com/">
              Women Who Draw
            </a>
            <br></br>
            <a className="link" href="http://www.28blacks.com/">
              28 Black Designers
            </a>
            <br></br>
            <a className="link" href="https://www.latinxswhodesign.com/">
              Latinx Who Design
            </a>
            <br></br>
            <a className="link" href="https://queerdesign.club/">
              Queer Design Club
            </a>
            <br></br>
            <a className="link" href="https://filipinos-who-design.webflow.io/">
              Filipinos Who Design
            </a>
            <br></br>
            <a className="link" href="https://filipinos-who-design.webflow.io/">
              People Of Craft
            </a>
            <br></br>
            <a className="link" href="https://indianswhodesign.in/">
              Indians Who Design
            </a>
            <br></br>
            <a className="link" href="https://www.apiwho.design/">
              Asian & Pacific Islanders Who Design
            </a>
          </p>
          <h3>How did you build this?</h3>
          <p>
            The site is a fork off of Brazilians Who Design, which is{" "}
            <a
              className="link"
              target="_blank"
              href="https://github.com/zehfernandes/brazilianswhodesign"
            >
              open source
            </a>
            . Please visit the{" "}
            <a className="link" href="https://brazilianswho.design/about">
              Brazillians Who Design
            </a>{" "}
            site for more information.
          </p>
          <h3>Who’s behind this?</h3>
          <p>
            <a
              className="link"
              href="https://www.linkedin.com/in/emmit-parubrub/"
            >
              Emmit Parubrub
            </a>
            <br></br>
            <a className="link" href="https://twitter.com/tellaho">
              Taylor Ho
            </a>
          </p>
        </div>
        <div className="col-right">
          <h3>How can I get more involved with the community?</h3>
          <p>
            Currently, you can join our{" "}
            <a className="link" href={`${DISCORD_URL}`} target="_blank">
              Hawaiians in Tech Discord
            </a>
            to connect with our community, get information on events, find new
            project opportunities, and more.
          </p>
          <h3>How can I remove my name?</h3>
          <p>
            If you’ve been added to the directory and would like to opt-out or
            make an edit to your profile, please send an email to either
            emmit.parubrub@gmail.com or howzit@tellaho.com, or send us a message
            in our{" "}
            <a className="link" href={`${DISCORD_URL}`} target="_blank">
              Discord
            </a>
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

        .moreabout h3 {
          padding: 0;
          margin: 0;
          font-size: 1.5rem;
        }

        .moreabout h3 {
          margin: 4rem 0 0 0;
        }

        ul,
        li {
          padding: 0;
          margin: 0;
          list-style: none;
          margin-top: 0.3rem;
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
