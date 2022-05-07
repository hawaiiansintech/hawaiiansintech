import { DataList, DataListItem } from "@/components/DataList";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav";
import SplitSection from "@/components/SplitSection";
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

export default function HackathonPage() {
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
      <DataList>
        <DataListItem heading="ʻEhia ka lā?" translation="Day">
          July 29 – 31, 2022
        </DataListItem>
        <DataListItem heading="Ma hea?" translation="Location">
          Puʻuhonua o Waimanalo &amp; Virtual
        </DataListItem>
        <DataListItem heading="He aha ka poʻomanaʻo?" translation="Theme">
          Moʻokūʻauhau &amp; Moʻōlelo
        </DataListItem>
      </DataList>
      <SplitSection title="Tech spec" hint="Subject to change">
        {" "}
      </SplitSection>
      <SplitSection title="Cultural advisory" hint="Subject to change">
        {" "}
      </SplitSection>
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
      `}</style>
    </>
  );
}
