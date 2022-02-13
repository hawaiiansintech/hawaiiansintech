import { Heading, Subheading } from "@/components/Heading";
import { IconAsset } from "@/components/icon/icon";
import MetaTags from "@/components/Metatags.js";
import StartOption from "@/components/StartOption";
import Head from "next/head";
import Link from "next/link";
import theme from "styles/theme";

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
        To join the list, we just ask that you are{" "}
        <strong>Native Hawaiian</strong> and work in the field/industry of{" "}
        <strong>technology</strong>.
      </Subheading>
      <section
        style={{
          margin: "0 auto 1rem",
          maxWidth: theme.layout.width.interior,
        }}
      >
        <div style={{ margin: "2rem auto 0", textAlign: "center" }}>
          <h4>Choose your path:</h4>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridAutoRows: "1fr",
            gridColumnGap: "1rem",
            gridRowGap: "1rem",
            margin: "1rem 0",
            maxWidth: theme.layout.width.interior,
          }}
        >
          <StartOption
            icon={IconAsset.Network}
            headline="I work in (or am in school to) work in tech"
            description="Join our list of kanaka “techie” professionals and academics"
            href="join/01-you"
          />

          <StartOption
            icon={IconAsset.Cap}
            headline="I’m just getting started"
            description="Explore the possibilities of a career as an ʻōiwi in tech"
            href="join/apprentice"
          />
        </div>
      </section>

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
