import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import MetaTags from "../../components/Metatags.js";
import { Heading, Subheading } from "../../components/Heading";
import Button from "../../components/Button";
import Pill from "../../components/Pill.js";
import RadioBox from "../../components/form/RadioBox";
import { Icon, IconAsset, IconColor } from "../../components/icons/icon";
import StartOption from "../../components/StartOption";

export default function Join() {
  return (
    <div className="container">
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>

      <Link href="/" shallow={true}>
        <a className="auxNav arrowback">←</a>
      </Link>

      <img src="/images/shaka.gif" className="shaka" />
      <Heading>Huuuui, Aloha e.</Heading>
      <Subheading centered>
        Drop your in the hat to be added to the list. We just ask that you /
        they are <strong>Native Hawaiian</strong> &amp; work or research in the{" "}
        <strong>technology sector</strong>. Or if you’re not yet working in the
        space, and curious to get started, let us know who you are.
      </Subheading>
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "var(--width-page-interior)",
        }}
      >
        <StartOption
          icon={IconAsset.Network}
          headline="I currently work in tech"
          description="I want to join the network of kanaka “techies” and contribute my expertise to the hui"
          href="join/step-02"
        />
        <StartOption
          icon={IconAsset.Cap}
          headline="I’m just getting started"
          description="I want to learn about how to get involved and explore the possibilities of a career as an ʻōiwi in tech"
          href="join/apprentice"
        />
      </div>

      <style jsx>{`
        .shaka {
          display: block;
          height: 5.2rem;
          width: auto;
          margin: 0 auto 2rem;
        }
      `}</style>
    </div>
  );
}
