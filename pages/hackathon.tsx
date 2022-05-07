import DataList from "@/components/DataList";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav";
import { Title } from "@/components/Title.js";
import { motion } from "framer-motion";
import Head from "next/head";
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
      <div className="hackathon-splash">
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
          <h1 className="f1 extend">
            <motion.span variants={item}>& Purple Maiʻa</motion.span>
          </h1>
          <p className="hackathon-title">
            <motion.span variants={item}>HACKATHON 2022</motion.span>
          </p>
        </motion.div>
      </div>
      <div className="hackathon-data-list">
        <DataList heading="ʻEhia ka lā?" translation="Day">
          July 29 – 30, 2022
        </DataList>
        <DataList heading="Ma hea?" translation="Location">
          Puʻuhonua o Waimanalo &amp; Virtual
        </DataList>
        <DataList heading="He aha ka poʻomanaʻo?" translation="Theme">
          July 29 – 30, 2022
        </DataList>
      </div>
      ``
      <style jsx>{`
        .hackathon-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }

        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .hackathon-splash {
            margin: 0 2rem;
          }
        }

        .extend {
          margin: 0;
          max-width: 24ch;
        }

        .hackathon-title {
          font-family: "Permanent Marker";
          font-size: 2.4rem;
          margin: 0.5rem 0 0 0;
          color: ${theme.color.brand.base};
        }

        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .hackathon-title {
            font-size: 4rem;
          }
        }

        .hackathon-data-list {
          display: flex;
          flex-wrap: wrap;
          grid-auto-flow: column;
          grid-auto-rows: 1fr;
          gap: 1rem 6rem;
          margin: 3rem auto 0;
          padding: 0 1rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .hackathon-data-list {
            padding: 0 2rem;
          }
        }
      `}</style>
    </>
  );
}
