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
            & Purple Maiʻa
            </motion.span>{" "}
          </p>
          <p className="hackathon-title">
            <motion.span variants={item}>
            HACKATHON 2022
            </motion.span>{" "}
          </p>
        </motion.div>
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

        .hackathon-title {
          font-family: "Permanent Marker";
          font-size: 4rem;
          margin: .5rem 0 0 0;
          color: ${theme.color.brand.base}
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
