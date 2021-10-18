import Head from "next/head";
import Link from "next/link";
import MetaTags from "../components/Metatags.js";
import Header from "../components/Header.js";

export default function Tbd({ technologists }) {
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

      <Header>
        <h2>Huuuui, Aloha e.</h2>
        <h3>
          Drop your in the hat to be added to the list. Or nominate someone
          else. We just ask that you / they are <strong>Native Hawaiian</strong>{" "}
          &amp; work or research in the <strong>technology sector</strong>.
        </h3>
      </Header>

      <style global jsx>{`
        .container {
          padding-top: 6rem;
        }
      `}</style>
    </div>
  );
}
