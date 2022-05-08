import { DataList, DataListItem } from "@/components/DataList";
import { ButtonList } from "@/components/ButtonList";
import Button from "@/components/Button";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav";
import SplitSection from "@/components/SplitSection";
import { Title } from "@/components/Title.js";
import { motion } from "framer-motion";
import Head from "next/head";
import theme from "styles/theme";
import { DISCORD_URL } from "@/pages/about";

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
      {/* <Button fullWidth type="submit">
          RSVP
      </Button>
      <Button linkTo={DISCORD_URL} type="submit">
          Join the Discord
      </Button>
      <Button type="submit">
          ...
      </Button> */}
      <h3>
        A <span className="bold">non-traditional hackathon;</span> expanding on <span className="bold">traditional kanaka 
        concepts</span> including <span className="bold">moʻokūʻauhau</span>, our <span className="bold">collective identity</span>, 
        and <span className="bold">honoring our ancestors</span>; using <span className="bold">modern technologies</span>; 
        bringing a foundation of <span className="bold">kanaka digital tooling</span> to the world.
        <br/><br/>
        Come join us as we collectively explore our kanaka identity/heritage—with moʻokūʻauhau as our project’s foundation—using 
        modern technology & tooling. Pretty cool, yeah?
        <br/><br/>
        We are starting with an idea around coming together to build a <span className="bold">genealogy tool</span>. 
        One that is rooted in kanaka concepts mai ka hiko (da’ olden times) and through a present-day lens.
        <br/><br/>
        So you! Yeah, you! <span className="bold">We need you!</span> Both those with technical and cultural expertise. Kanaka—and 
        technical allies interested in participating—should come with a good attitude, a learning mentality, and, most likely, extra extension cords.
        <br/><br/>
        Bump shoulders with others like you. As our Hawaiians in Tech community has realized, you should know we exist and are <i>tʻriving</i>.
      </h3>
      <SplitSection title="Tech spec" hint="Subject to change">
        {" "}
      </SplitSection>
      <SplitSection title="Cultural advisory" hint="Subject to change">
        {" "}
      </SplitSection>
      <SplitSection title="Schedule & Events" hint="Subject to change">
        {" "}
      </SplitSection>
      <SplitSection title="Frequently Asked Questions">
        {" "}
      </SplitSection>
      <SplitSection title="Organized by">
        {" "}
      </SplitSection>
      <SplitSection title="Special thanks to">
        {" "}
      </SplitSection>
      <SplitSection title="Sponsored by">
        {" "}
      </SplitSection>
      <style jsx>{`
        .hackathon-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }

        h3{
          margin: 2rem 0 0 1rem;
          max-width: 45rem;
          font-weight: 400;
          font-size: 1.25rem;
          color: ${theme.color.text.alt2};
        }

        .bold{
          color: ${theme.color.text.alt};
          font-weight: 600;
        }

        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .hackathon-splash {
            margin: 0 2rem;
          }
          h3{
            margin: 2rem 0 0 2rem;
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
