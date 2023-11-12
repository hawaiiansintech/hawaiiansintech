import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import { DataList, DataListItem } from "@/components/DataList";
import Dropdown from "@/components/Dropdown";
import { Icon, IconAsset } from "@/components/icon/icon";
import ImageExpand from "@/components/ImageExpand";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import NihoShimmer from "@/components/NihoShimmer";
import Plausible from "@/components/Plausible";
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

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Hackathon 2022 · Hawaiians in Technology",
    },
  };
}

export default function HackathonPage({ pageTitle }) {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags
          image="https://hawaiiansintech.org/images/ogimage-hackathon.png"
          description="Our inaugural Hackathon event, in partnership with Purple Maiʻa. Hosted by Native Hawaiians in the technology industry."
          title={pageTitle}
        />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="/" />
      <div className="background pointer-events-none">
        <NihoShimmer animate />
      </div>
      <div className="hackathon-splash foreground">
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
          <p className="hackathon-title font-script">
            <motion.span variants={item}>HACKATHON 2022</motion.span>
          </p>
        </motion.div>
      </div>
      <div className="hackathon-images">
        <a href="/images/hackathon/halau-inana-group.jpg" target="_blank">
          <img src="/images/hackathon/halau-inana-group.jpg" />
        </a>
        <a href="/images/hackathon/stickers.jpg" target="_blank">
          <img src="/images/hackathon/stickers.jpg" />
        </a>
        <a href="/images/hackathon/halau-inana-kamakani.jpg" target="_blank">
          <img src="/images/hackathon/halau-inana-kamakani.jpg" />
        </a>
        <a href="/images/hackathon/halau-inana-nohea.jpg" target="_blank">
          <img src="/images/hackathon/halau-inana-nohea.jpg" />
        </a>
        <a href="/images/hackathon/waimanalo.jpg" target="_blank">
          <img src="/images/hackathon/waimanalo.jpg" />
        </a>
        <a href="/images/hackathon/waimanalo-laptop.jpg" target="_blank">
          <img src="/images/hackathon/waimanalo-laptop.jpg" />
        </a>
        <a href="/images/hackathon/waimanalo-loi.jpg" target="_blank">
          <img src="/images/hackathon/waimanalo-loi.jpg" />
        </a>

        <a href="/images/hackathon/waimanalo-table.jpg" target="_blank">
          <img src="/images/hackathon/waimanalo-table.jpg" />
        </a>
        <a href="/images/hackathon/waimanalo-group.jpg" target="_blank">
          <img src="/images/hackathon/waimanalo-group.jpg" />
        </a>
        <a href="/images/hackathon/closer.jpg" target="_blank">
          <img src="/images/hackathon/closer.jpg" />
        </a>
      </div>
      <div className="hackathon-alert-banner">
        <aside className="hackathon-alert-banner__aside">
          <Icon asset={IconAsset.Network} />
        </aside>
        <main className="hackathon-alert-banner__main">
          <h2>Well, the event was a blast.</h2>
          <blockquote>
            A three-day hackathon kicked off this afternoon, bringing together
            non-native and native Hawaiian technologists, researchers, coders,
            cultural practitioners and community members to lend their thoughts
            and talents to the field of native Hawaiian genealogy.
          </blockquote>
          <a
            className="hackathon-alert-banner__button"
            href="https://www.hawaiibulletin.com/p/hawaiians-in-tech"
            target="_blank"
          >
            Read about the first day
          </a>
        </main>
      </div>
      <div className="foreground">
        <DataList
          marginSmall="3rem auto 0"
          marginLarge="3rem 0 0 0"
          paddingSmall="0 1rem"
          paddingLarge="0 2rem"
          gap="1.5rem 4rem"
        >
          <DataListItem
            customWidth="20rem"
            heading="ʻĀhea?"
            headingSizeLarge="1.5rem"
            translation="When"
            textItem
          >
            <p className="eventLogisticsParagraph">July 29 – 31, 2022</p>
          </DataListItem>
          <DataListItem
            customWidth="20rem"
            heading="Ma hea?"
            headingSizeLarge="1.5rem"
            translation="Location"
            textItem
          >
            <p className="eventLogisticsParagraph">
              Oahu locations &amp; Virtual
            </p>
          </DataListItem>
          <DataListItem
            customWidth="20rem"
            heading="He aha ka poʻomanaʻo?"
            headingSizeLarge="1.5rem"
            translation="Theme"
            textItem
          >
            <p className="eventLogisticsParagraph">
              Moʻokūʻauhau &amp; Moʻōlelo
            </p>
          </DataListItem>
        </DataList>

        <DataList
          marginSmall="3rem auto 0"
          marginLarge="3rem 0 0 0"
          paddingSmall="0 1rem"
          paddingLarge="0 2rem"
          gap="1rem 1rem"
        >
          <a href={DISCORD_URL}>
            <Button size={ButtonSize.Small} variant={ButtonVariant.Secondary}>
              Join the Discord
            </Button>
          </a>
          <Dropdown
            links={{
              "purplemaia.org": "https://purplemaia.org/",
              "@purple_maia": "https://twitter.com/purple_maia/",
              purple_maia: "https://www.instagram.com/purple_maia/",
              "@hawaiiansintech": "https://twitter.com/hawaiiansintech/",
              hawaiiansintech: "https://www.instagram.com/hawaiiansintech/",
            }}
            button={
              <Button size={ButtonSize.Small} variant={ButtonVariant.Secondary}>
                ...
              </Button>
            }
          ></Dropdown>
        </DataList>
        <h3>
          <p>
            A <span className="bold">non-traditional hackathon;</span> expanding
            on <span className="bold">traditional kanaka concepts</span>{" "}
            including <span className="bold">moʻokūʻauhau</span>, our{" "}
            <span className="bold">collective identity</span>, and{" "}
            <span className="bold">honoring our ancestors</span>; using{" "}
            <span className="bold">modern technologies</span>; bringing a
            foundation of <span className="bold">kanaka digital tooling</span>{" "}
            to the world.
          </p>
          <p>
            Come join us as we collectively explore our kanaka
            identity/heritage—with moʻokūʻauhau as our project’s
            foundation—using modern technology & tooling. Pretty cool, yeah?
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
            allies interested in participating—should come with a good attitude,
            a learning mentality, and, most likely, extra extension cords.
          </p>
          <p>
            Bump shoulders with others like you. As our Hawaiians in Tech
            community has realized, you should know we exist and are{" "}
            <i>tʻriving</i>.
          </p>
        </h3>
        <SplitSection title="Keynote Speakers" hint="Subject to change">
          <DataList gap="1rem 6rem" grid>
            <DataListItem
              heading="Dr. Lilikalā Kameʻeleihiwaala"
              customWidth="50%"
              subHeading="Senior Professor, UH Kamakakuokalani Center for Hawaiian Studies; Founder, Mauliauhonua, Hawaiian Genealogies"
            />
          </DataList>
        </SplitSection>
        <SplitSection title="Schedule & Events" hint="Subject to change">
          <ImageExpand
            imagePath={"/images/hackathonSchedule.png"}
          ></ImageExpand>
        </SplitSection>
        <SplitSection title="Who We Need">
          <DataList gap="2rem 4rem">
            <DataListItem
              customWidth="100%"
              heading="Technical Help 🛠"
              textItem
            >
              Looking for individuals who can help us:
              <ul>
                <li>Parse, store, or manage data</li>
                <li>Shape data infrastructural / system design </li>
                <li>
                  Visualize hierarchical & interconnected data in a compelling
                  way
                </li>
                <li>
                  A degree of technical acumen or a strong will to pick one up
                  fast
                </li>
                <li>Smart, open-minded folks with a good attitude</li>
              </ul>
              Common technical roles we’re looking for (but not limited to):
              <ul>
                <li>Software engineers</li>
                <li>Testing engineers</li>
                <li>Data infrastructure / science / analysis</li>
                <li>Privacy & safety</li>
                <li>User-generated content & moderation</li>
                <li>UX / Product / UI designers</li>
              </ul>
            </DataListItem>
            <DataListItem
              customWidth="100%"
              heading="Non Technical Help 💡"
              textItem
            >
              Looking for individuals who can help:
              <ul>
                <li>
                  Engage in thoughtful discussions exploring our modern
                  relationship to mo'oku'auhau and connect with like minded
                  individuals
                </li>
                <li>
                  Co-develop a framework to digitize, organize, and share
                  genealogy with the rest of their 'ohana
                </li>
                <li>
                  Test out and provide thoughtful feedback on existing
                  functionalities
                </li>
                <li>
                  Provide thoughts and ideas on future development of the
                  project
                </li>
                <li>
                  Give opinions on the best visualizations for the genealogy
                  data
                </li>
              </ul>
              The weekend will include:
              <ul>
                <li>Keynote speakers</li>
                <li>Mo'olelo talk stories</li>
                <li>Art workshops</li>
                <li>Lo'i kalo</li>
              </ul>
            </DataListItem>
          </DataList>
        </SplitSection>
        <SplitSection title="Frequently Asked Questions">
          <DataList gap="2rem 4rem" grid>
            <DataListItem
              customWidth="100%"
              heading="Do I need to work in tech to participate? Or be Native Hawaiian?"
              textItem
            >
              <p>
                <span className="bold">No, you don’t</span>. We are simply
                looking for passionate folks who can contribute to the
                aforementioned goals.
              </p>
              <p>
                <span className="bold">Allies are welcome</span>. As well as
                kanaka still learning their way around technical spaces.
              </p>
            </DataListItem>
            <DataListItem
              customWidth="100%"
              heading="I cannot make the event! Will there be future events?"
              textItem
            >
              <p>
                {" "}
                <span className="bold">We sure hope so.</span> If this event
                goes well, this should probably be the first of many.
              </p>
              <p>
                If you cannot make it, please reach out and we’ll give you
                head’s up for the next! Even if you have ideas for future
                events, let us know!
              </p>
            </DataListItem>
            <DataListItem
              customWidth="100%"
              heading="Will I be able to participate virtually?"
              textItem
            >
              <p>
                <span className="bold">Absolutely.</span> The more, the better
                we’re able to facilitate a more thorough experience for those
                attending virtually. Please RSVP when it's available!
              </p>
            </DataListItem>
            <DataListItem
              customWidth="100%"
              heading="Can I bring my own hackathon project ideas?"
              textItem
            >
              <p>
                <span className="bold">Can.</span> If you can intuit
                interesting, adjacent projects then, of course, you are more
                than welcome to build with us.
              </p>
            </DataListItem>
            <DataListItem
              customWidth="100%"
              heading="Can I come just to hang & talk story?"
              textItem
            >
              <p>
                <span className="bold">Yessah.</span> The more minds we have
                discussing and exploring these concepts, the better. It takes a
                village.
              </p>
            </DataListItem>
            <DataListItem
              customWidth="100%"
              heading="Will there be transportation?"
              textItem
            >
              <p>
                <span className="bold">We going try.</span> Come join the
                Discord; there should be plenty others looking to help!
              </p>
            </DataListItem>
          </DataList>
        </SplitSection>
        <SplitSection title="Partnered with">
          <DataList gap="1rem 4rem">
            <DataListItem subHeading="Purple Maiʻa" subHeadingLight>
              <a href={"https://purplemaia.org/"}>
                <img src="/images/purpleMaia.png" className="imgLink" />
              </a>
            </DataListItem>
            <DataListItem
              subHeading="Hawaiian Ancestry Kūkāmoʻo"
              subHeadingLight
            >
              <a href={"https://hawaiianancestry.org/"}>
                <img
                  src="/images/hawaiianAncestryLogo.png"
                  className="imgLink"
                />
              </a>
            </DataListItem>
            <DataListItem subHeading="Native Books" subHeadingLight>
              <a href={"https://www.nativebookshawaii.org/"}>
                <img src="/images/nativeBooks.png" className="imgLink" />
              </a>
            </DataListItem>
          </DataList>
        </SplitSection>
        <SplitSection title="Sponsored By">
          <DataList gap="1rem 4rem">
            <DataListItem subHeading="Kamehameha Schools" subHeadingLight>
              <a href={"https://www.ksbe.edu/"}>
                <img src="/images/kamehameha.jpeg" className="imgLink" />
              </a>
            </DataListItem>
            <DataListItem subHeading="Google Empathy Lab" subHeadingLight>
              <a href={"https://medium.com/google-empathy-lab"}>
                <img src="/images/googleEmpathyLab.png" className="imgLink" />
              </a>
            </DataListItem>
            <DataListItem subHeading="Waiākea Volcanic Water" subHeadingLight>
              <a href={"https://waiakea.com/"}>
                <img src="/images/waiakea.png" className="imgLink" />
              </a>
            </DataListItem>
            <DataListItem subHeading="Shaka Tea Hawaiʻi" subHeadingLight>
              <a href={"https://www.shakatea.com/"}>
                <img src="/images/shakatea.png" className="imgLink" />
              </a>
            </DataListItem>
          </DataList>
        </SplitSection>
        <SplitSection title="Special thanks to">
          <DataList gap="1rem 4rem">
            <DataListItem subHeading="Uncle Dean Keko'olani" subHeadingLight>
              <a href={"https://kekoolani.org/"}>
                <img src="/images/kekoolani.png" className="imgLink" />
              </a>
            </DataListItem>
            <DataListItem subHeading="Wai Wai Collective" subHeadingLight>
              <a href={"https://waiwaicollective.com/"}>
                <img src="/images/waiwai.png" className="imgLink" />
              </a>
            </DataListItem>
            <DataListItem subHeading="HTDC" subHeadingLight>
              <a href={"https://www.htdc.org/"}>
                <img src="/images/htdc.png" className="imgLink" />
              </a>
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
      </div>
      <style jsx>{`
        .imgLink {
          max-height: 7.5rem;
          max-width: 100%;
        }

        .hackathon-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }

        .hackathon-images {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          align-items: center;
          gap: 0.5rem;
          margin: 1rem 0.5rem;
        }
        .hackathon-images img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: var(--border-radius-small);
        }
        .hackathon-alert-banner {
          display: flex;
          gap: 1rem;
          margin: 2rem 2rem 0;
          padding: 1rem;
          background: var(--color-background-alt);
          max-width: 48rem;
          border-radius: var(--border-radius-small);
        }
        .hackathon-alert-banner__aside {
        }
        .hackathon-alert-banner__main h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }

        .hackathon-alert-banner__main blockquote {
          margin: 0 0 1rem 0.5rem;
          padding-left: 0.5rem;
          font-weight: 400;
          line-height: 1.5;
          line-clamp: 2;
          color: var(--color-text-alt-2);
          border-left: 0.2rem solid var(--color-border-alt);

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hackathon-alert-banner__button {
          display: inline-block;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius-rounded);
          color: var(--color-text-overlay);
          background: var(--color-brand);
        }

        .foreground {
          position: relative;
          z-index: ${theme.layout.zIndex.center};
        }

        .background {
          position: absolute;
          top: 4rem;
          right: 0;
          padding: 0 1rem;
          opacity: 0.5;
          pointer-events: none;
          z-index: ${theme.layout.zIndex.below};
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

        .extend {
          margin: 0;
          max-width: 24ch;
        }

        .hackathon-title {
          font-size: 2.4rem;
          margin: 0.5rem 0 0 0;
          color: ${theme.color.brand.base};
        }

        .eventLogisticsParagraph {
          margin: 0;
          color: ${theme.color.brand.base};
          font-weight: 700;
          font-size: 1.8rem;
        }

        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          h3 {
            margin: 3rem 0 0 2rem;
          }
          .background {
            padding: 0 2rem;
          }
          .hackathon-splash {
            margin: 0 2rem;
          }
          .hackathon-title {
            font-size: 4rem;
          }
        }

        @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
          .background {
            opacity: 1;
            top: 14rem;
          }
          .hackathon-title {
            font-size: 4rem;
          }
        }
      `}</style>
    </>
  );
}
