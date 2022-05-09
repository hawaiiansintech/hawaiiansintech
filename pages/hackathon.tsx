import Button, { ButtonVariant } from "@/components/Button";
import { DataList, DataListItem } from "@/components/DataList";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav";
import SplitSection from "@/components/SplitSection";
import { Title } from "@/components/Title.js";
import { motion } from "framer-motion";
import Head from "next/head";
import theme from "styles/theme";
import { DISCORD_URL } from "./about";

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
      <DataList mainEventLogistics gap="1rem 6rem">
        <DataListItem
          mainEventLogistics
          heading="ʻEhia ka lā?"
          translation="Day"
        >
          July 29 – 31, 2022
        </DataListItem>
        <DataListItem
          mainEventLogistics
          heading="Ma hea?"
          translation="Location"
        >
          Puʻuhonua o Waimanalo &amp; Virtual
        </DataListItem>
        <DataListItem
          mainEventLogistics
          heading="He aha ka poʻomanaʻo?"
          translation="Theme"
        >
          Moʻokūʻauhau &amp; Moʻōlelo
        </DataListItem>
      </DataList>
      <DataList mainEventLogistics gap="1rem 6rem">
        <Button fullWidth>RSVP</Button>
        <Button linkTo={DISCORD_URL}>Join the Discord</Button>
        <Button>...</Button>
      </DataList>
      <h3>
        A <span className="bold">non-traditional hackathon;</span> expanding on{" "}
        <span className="bold">traditional kanaka concepts</span> including{" "}
        <span className="bold">moʻokūʻauhau</span>, our{" "}
        <span className="bold">collective identity</span>, and{" "}
        <span className="bold">honoring our ancestors</span>; using{" "}
        <span className="bold">modern technologies</span>; bringing a foundation
        of <span className="bold">kanaka digital tooling</span> to the world.
        <br />
        <br />
        Come join us as we collectively explore our kanaka
        identity/heritage—with moʻokūʻauhau as our project’s foundation—using
        modern technology & tooling. Pretty cool, yeah?
        <br />
        <br />
        We are starting with an idea around coming together to build a{" "}
        <span className="bold">genealogy tool</span>. One that is rooted in
        kanaka concepts mai ka hiko (da’ olden times) and through a present-day
        lens.
        <br />
        <br />
        So you! Yeah, you! <span className="bold">We need you!</span> Both those
        with technical and cultural expertise. Kanaka—and technical allies
        interested in participating—should come with a good attitude, a learning
        mentality, and, most likely, extra extension cords.
        <br />
        <br />
        Bump shoulders with others like you. As our Hawaiians in Tech community
        has realized, you should know we exist and are <i>tʻriving</i>.
      </h3>
      <SplitSection title="Tech spec" hint="Subject to change">
        <div className="empty-placeholder"></div>
      </SplitSection>
      <SplitSection title="Cultural advisory" hint="Subject to change">
        <DataList gap="1rem 6rem">
          <DataListItem
            heading="Dr. Lilikalā Kameʻeleihiwaala"
            subHeading="Professor, Hawaiian Culture & Genealogies"
          />
          <DataListItem
            heading="Dr. Manulani Aluli Meyer"
            subHeading="Indigenous Scholar and Cultural Practitioner"
          />
          <DataListItem
            heading="Dr. Pualani Kanakaʻole Kanahele"
            subHeading="Cultural Practitioner"
          />
          <DataListItem
            heading="Kamaliʻikupono Hanohano"
            subHeading="Kahuna, Pā ʻUhi"
          />
        </DataList>
      </SplitSection>
      <SplitSection title="Schedule & Events" hint="Subject to change">
        <div className="empty-placeholder"></div>
      </SplitSection>
      <SplitSection title="Frequently Asked Questions">
        <DataList gap="1rem 4rem">
          <DataListItem heading="Do I need to work in tech to participate? Or be Native Hawaiian?">
            <span className="bold">No, you don’t</span>. We are simply looking
            for passionate folks who can contribute to the aforementioned goals.
            <br />
            <br />
            <span className="bold">Allies are welcome</span>. As well as kanaka
            still learning their way around technical spaces.
          </DataListItem>
          <DataListItem heading="I cannot make the event! Will there be future events?">
            <span className="bold">We sure hope so.</span> If this event goes
            well, this should probably be the first of many.
            <br />
            <br />
            If you cannot make it, please reach out and we’ll give you head’s up
            for the next! Even if you have ideas for future events, let us know!
          </DataListItem>
          <DataListItem heading="Will I be able to participate virtually?">
            <span className="bold">Absolutely.</span> The more, the better we’re
            able to facilitate a more thorough experience for those attending
            virtually. Please RSVP!
          </DataListItem>
          <DataListItem heading="Can I bring my own hackathon project ideas?">
            <span className="bold">Can.</span> If you can intuit interesting,
            adjacent projects then, of course, you are more than welcome to
            build with us.
          </DataListItem>
          <DataListItem heading="Can I come just to hang & talk story?">
            <span className="bold">Yessah.</span> The more minds we have
            discussing and exploring these concepts, the better. It takes a
            village.
          </DataListItem>
          <DataListItem heading="Will there be transportation?">
            <span className="bold">We going try.</span> Come join the Discord;
            there should be plenty others looking to help!
          </DataListItem>
        </DataList>
      </SplitSection>
      <SplitSection title="Organized by">
        <DataList gap="1rem 4rem">
          <DataListItem
            heading="Andrew Taeoaliʻi"
            subHeading="Hawaiians in Tech"
          />
          <DataListItem
            heading="Emmit Kamakani Parubrub"
            subHeading="Hawaiians in Tech"
          />
          <DataListItem heading="Keaʻa Davis" subHeading="Purple Maiʻa" />
          <DataListItem heading="Keoni DeFranco" subHeading="Purple Maiʻa" />
          <DataListItem
            heading="Taylor Kekai Ho"
            subHeading="Hawaiians in Tech"
          />
        </DataList>
      </SplitSection>
      <SplitSection title="Special thanks to">
        <DataList gap="1rem 4rem">
          <DataListItem
            heading="Native Books Hawaiʻi"
            subHeading="Auntie Maile Meyer"
            subHeadingLight
          />
        </DataList>
      </SplitSection>
      <SplitSection title="Sponsored by">
        <h4 style={{ padding: "0 2rem" }}>
          In progress. Things are moving fast. Still interested?
        </h4>
        <Button variant={ButtonVariant.Secondary} type="submit">
          Contact Us
        </Button>
      </SplitSection>
      <style jsx>{`
        .hackathon-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }

        h3 {
          margin: 2rem 1rem 0 1rem;
          max-width: 45rem;
          font-weight: 400;
          font-size: 1.25rem;
          color: ${theme.color.text.alt2};
        }

        .bold {
          color: ${theme.color.text.alt};
          font-weight: 600;
        }

        .empty-placeholder {
          height: 400px;
          background-color: ${theme.color.background.alt3};
          border-radius: 1rem;
        }

        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .hackathon-splash {
            margin: 0 2rem;
          }
          h3 {
            margin: 3rem 0 0 2rem;
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
