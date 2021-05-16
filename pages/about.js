import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Title from "../components/Title.js";
import MetaTags from "../components/Metatags.js";
import Analytics from "../components/Analytics.js";

const item = {
  hidden: { opacity: 0, y: "15%" },
  show: { opacity: 1, y: "0%" },
  transition: {
    easing: "easeInOut",
  },
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

export default function Home({ designers }) {
  return (
    <div className="container">
      <Head>
        <title>Hawaiians in Technology | About</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>

      <Link href="/" shallow={true}>
        <a className="auxNav arrowback">←</a>
      </Link>

      <Title
        className="title m0 p0"
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
          <motion.span variants={item}>directory and community of Native Hawaiians</motion.span>{" "}
          <motion.span variants={item}>in the technology industry. The goal</motion.span>{" "}
          <motion.span variants={item}>is to connect, inspire, provide representation, and</motion.span>{" "}
          <motion.span variants={item}>promote the precense of Native Hawaiians who work in the technology industry.</motion.span>{" "}
        </p>
      </motion.div>

      <div className="moreabout">
        <div className="col-left">
          <h3>How can I nominate someone?</h3>
          <p>
            If you or someone you know is a Native Hawaiian who works in the technology industry,
            and wants to be part of this directory and community, please{" "}
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
                </a>{", "}
            who have also credited inspiration from their sibling sites:
          </p>
          <ul>
            <li>
              <a className="link" href="https://womenwho.design/">
                Women Who Design
              </a>
            </li>
            <li>
              <a className="link" href="https://www.womenwhodraw.com/">
                Women Who Draw
              </a>
            </li>
            <li>
              <a className="link" href="http://www.28blacks.com/">
                28 Black Designers
              </a>
            </li>
            <li>
              <a className="link" href="https://www.latinxswhodesign.com/">
                Latinx Who Design
              </a>
            </li>
            <li>
              <a className="link" href="https://queerdesign.club/">
                Queer Design Club
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://filipinos-who-design.webflow.io/"
              >
                Filipinos Who Design
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://filipinos-who-design.webflow.io/"
              >
                People Of Craft
              </a>
            </li>
            <li>
              <a className="link" href="https://indianswhodesign.in/">
                Indians Who Design
              </a>
            </li>
            <li>
              <a className="link" href="https://www.apiwho.design/">
                Asian & Pacific Islanders Who Design
              </a>
            </li>
          </ul>
          <h3>How did you build this?</h3>
          <p>
            The site is a fork off of Brazilians Who Design, which is{" "}
              <a
                className="link"
                target="_blank"
                href="https://github.com/zehfernandes/brazilianswhodesign"
              >
              open source</a>. Please visit the {" "}
              <a className="link" href="https://brazilianswho.design/about">
                Brazillians Who Design
              </a>{" "}
              site for more information.
          </p>
          <h3>Who’s behind this?</h3>
          <ul>
            <li>
              <a className="link" href="https://www.linkedin.com/in/emmit-parubrub/">
                Emmit Parubrub
              </a>
            </li>
            <li>
              <a className="link" href="https://twitter.com/tellaho_">
                Taylor Ho
              </a>
            </li>
          </ul>
        </div>
        <div className="col-right">
          <h3>How can I get more involved with the community?</h3>
          <p>
            Currently, you can join our {" "}
            <a className="link" href="https://discord.gg/nx8rsFfW">Hawaiians in Tech Discord</a>
            to connect with our community, get information on events, find new project opporunities, and more.
          </p>
          <h3>How can I remove my name?</h3>
          <p>
            If you’ve been added to the directory and would like to opt-out or
              make an edit to your profile, please send either emmit.parubrub@gmail.com or 
              howzit@tellaho.com an email, or send us a message in our {" "}
              <a className="link" href="https://discord.gg/nx8rsFfW">Discord</a>.
          </p>
          
        </div>

        <Analytics />
      </div>

      <style jsx>{`
        .extend {
          margin: 0;
          max-width: 17ch;
        }

        .moreabout {
          font-weight: normal;
          font-size: 1.5rem;
          line-height: 140%;
          letter-spacing: 0.01em;
          display: flex;
          margin-top: 8rem;
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
    </div>
  );
}
