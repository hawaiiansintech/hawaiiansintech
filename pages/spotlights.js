import Head from "next/head";
import Link from "next/link";
import MetaTags from "../components/Metatags.js";
import HitLogo from "../components/HitLogo.js";
import Spotlight from "../components/Spotlight/Spotlight.js"
import React from "react"; 


export default function Home() {
  return (
      <div className="container">
        <Head>
          <title>Hawaiians in Technology | About</title>
          <link rel="icon" href="/favicon.ico" />
          <MetaTags />
        </Head>

        <Link href="/" shallow={true}>
          <a className="auxNav arrowback">←</a>
        </Link>

        <HitLogo/>
        <Spotlight/>
      </div>
  );
}
