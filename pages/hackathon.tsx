import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
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
      <div className="background"></div>
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
      <DataList mainEventLogistics gap="1.5rem 4rem">
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
      <DataList mainEventLogistics gap="1rem 1rem">
        <Button
          size={ButtonSize.Small}
          customWidth="18rem"
          customFontSize="1.5rem"
        >
          RSVP
        </Button>
        <a href={DISCORD_URL}>
          <Button
            customWidth="18rem"
            customFontSize="1.5rem"
            size={ButtonSize.Small}
            variant={ButtonVariant.Secondary}
          >
            Join the Discord
          </Button>
        </a>
        <Button
          customWidth="5rem"
          customFontSize="1.5rem"
          size={ButtonSize.Small}
          variant={ButtonVariant.Secondary}
        >
          ...
        </Button>
      </DataList>
      <h3>
        <p>
          A <span className="bold">non-traditional hackathon;</span> expanding
          on <span className="bold">traditional kanaka concepts</span> including{" "}
          <span className="bold">moʻokūʻauhau</span>, our{" "}
          <span className="bold">collective identity</span>, and{" "}
          <span className="bold">honoring our ancestors</span>; using{" "}
          <span className="bold">modern technologies</span>; bringing a
          foundation of <span className="bold">kanaka digital tooling</span> to
          the world.
        </p>
        <p>
          Come join us as we collectively explore our kanaka
          identity/heritage—with moʻokūʻauhau as our project’s foundation—using
          modern technology & tooling. Pretty cool, yeah?
        </p>
        <p>
          We are starting with an idea around coming together to build a{" "}
          <span className="bold">genealogy tool</span>. One that is rooted in
          kanaka concepts mai ka hiko (da’ olden times) and through a
          present-day lens.
        </p>
        <p>
          So you! Yeah, you! <span className="bold">We need you!</span> Both
          those with technical and cultural expertise. Kanaka—and technical
          allies interested in participating—should come with a good attitude, a
          learning mentality, and, most likely, extra extension cords.
        </p>
        <p>
          Bump shoulders with others like you. As our Hawaiians in Tech
          community has realized, you should know we exist and are{" "}
          <i>tʻriving</i>.
        </p>
      </h3>
      <SplitSection title="Tech spec" hint="Subject to change">
        <div className="empty-placeholder"></div>
      </SplitSection>
      <SplitSection title="Cultural advisory" hint="Subject to change">
        <DataList gap="1rem 6rem">
          <DataListItem
            heading="Dr. Lilikalā Kameʻeleihiwaala"
            extendedHeading
            subHeading="Professor, Hawaiian Culture & Genealogies"
          />
          <DataListItem
            heading="Dr. Manulani Aluli Meyer"
            extendedHeading
            subHeading="Indigenous Scholar and Cultural Practitioner"
          />
          <DataListItem
            heading="Dr. Pualani Kanakaʻole Kanahele"
            extendedHeading
            subHeading="Cultural Practitioner"
          />
          <DataListItem
            heading="Kamaliʻikupono Hanohano"
            extendedHeading
            subHeading="Kahuna, Pā ʻUhi"
          />
        </DataList>
      </SplitSection>
      <SplitSection title="Schedule & Events" hint="Subject to change">
        <div className="empty-placeholder"></div>
      </SplitSection>
      <SplitSection title="Who We Need">
        <DataList gap="2rem 4rem">
          <DataListItem customWidth="100%" heading="Technical help 🛠">
            Looking for individuals who can help us:
            <ul>
              <li>parse, store, or manage data</li>
              <li>shape data infrastructural / system design </li>
              <li>
                visualize hierarchical & interconnected data in a compelling way
              </li>
              <li>
                a degree of technical acumen or a strong will to pick one up
                fast
              </li>
            </ul>
            Common technical roles we’re looking for (but not limited to):
            <ul>
              <li>Software engineers</li>
              <li>Testing engineers</li>
              <li>Data infra / science / analysis</li>
              <li>Privacy & safety</li>
              <li>User-generated content & moderation</li>
              <li>UX / Product / UI designers</li>
              <li>Smart, open-minded folks with a good attitude</li>
            </ul>
          </DataListItem>
          <DataListItem customWidth="100%" heading="User feedback help 💡">
            Looking for individuals who can help:
            <ul>
              <li>
                test out and provide thoughtful feedback on existing
                functionalities
              </li>
              <li>
                provide thoughts and ideas on future development of the project
              </li>
              <li>
                give opinions on the best visualizations for the genealogy data
              </li>
            </ul>
          </DataListItem>
        </DataList>
      </SplitSection>
      <SplitSection title="Frequently Asked Questions">
        <DataList gap="2rem 4rem">
          <DataListItem heading="Do I need to work in tech to participate? Or be Native Hawaiian?">
            <p>
              <span className="bold">No, you don’t</span>. We are simply looking
              for passionate folks who can contribute to the aforementioned
              goals.
            </p>
            <p>
              <span className="bold">Allies are welcome</span>. As well as
              kanaka still learning their way around technical spaces.
            </p>
          </DataListItem>
          <DataListItem heading="I cannot make the event! Will there be future events?">
            <p>
              {" "}
              <span className="bold">We sure hope so.</span> If this event goes
              well, this should probably be the first of many.
            </p>
            <p>
              If you cannot make it, please reach out and we’ll give you head’s
              up for the next! Even if you have ideas for future events, let us
              know!
            </p>
          </DataListItem>
          <DataListItem heading="Will I be able to participate virtually?">
            <p>
              <span className="bold">Absolutely.</span> The more, the better
              we’re able to facilitate a more thorough experience for those
              attending virtually. Please RSVP!
            </p>
          </DataListItem>
          <DataListItem heading="Can I bring my own hackathon project ideas?">
            <p>
              <span className="bold">Can.</span> If you can intuit interesting,
              adjacent projects then, of course, you are more than welcome to
              build with us.
            </p>
          </DataListItem>
          <DataListItem heading="Can I come just to hang & talk story?">
            <p>
              <span className="bold">Yessah.</span> The more minds we have
              discussing and exploring these concepts, the better. It takes a
              village.
            </p>
          </DataListItem>
          <DataListItem heading="Will there be transportation?">
            <p>
              <span className="bold">We going try.</span> Come join the Discord;
              there should be plenty others looking to help!
            </p>
          </DataListItem>
        </DataList>
      </SplitSection>
      <SplitSection title="Organized by">
        <DataList gap="1rem 4rem">
          <DataListItem
            heading="Andrew Taeoaliʻi"
            subHeading="Hawaiians in Tech"
          />
          <DataListItem heading="Keaʻa Davis" subHeading="Purple Maiʻa" />
          <DataListItem heading="Keoni DeFranco" subHeading="Purple Maiʻa" />
          <DataListItem
            heading="Taylor Kekai Ho"
            subHeading="Hawaiians in Tech"
          />
          <DataListItem
            heading="Emmit Kamakani Parubrub"
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
        <div>
          <h4>In progress. Things are moving fast. Still interested?</h4>
          <a href="mailto:kekai@hawaiiansintech.org,kamakani@hawaiiansintech.org,andrewtaylor@hawaiiansintech.org">
            <Button
              customWidth="13rem"
              customFontSize="1.5rem"
              size={ButtonSize.Small}
              variant={ButtonVariant.Secondary}
            >
              Contact Us
            </Button>
          </a>
        </div>
      </SplitSection>
      <style jsx>{`
        .hackathon-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }

        .background {
          background-image: url("/images/triangles.svg");
          background-repeat: no-repeat;
          background-position: 50% 50%;
          background-size: contain;
          width: 100%;
          height: 65rem;
          position: absolute;
          z-index: -100;
        }

        h3 {
          margin: 2rem 1rem 0 1rem;
          max-width: 40rem;
          font-weight: 400;
          font-size: 1.7rem;
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
          .background {
            background-position: top right;
            height: 90rem;
            top: 10rem;
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
