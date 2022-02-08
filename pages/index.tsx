import HitLogo from "@/components/HitLogo.js";
import LoadingSpinner from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav.js";
import Title from "@/components/Title.js";
import { getMembers } from "@/lib/api";
import Head from "next/head";

export async function getStaticProps() {
  const members = await getMembers();
  console.log(members);
  return {
    props: {
      members,
    },
    revalidate: 60,
  };
}

export default function Home({ members }) {
  console.log(members);
  return (
    <div className="container">
      <Head>
        <title>Hawaiians in Technology</title>
        <link id="favicon" rel="alternate icon" href="/favicon.ico" />
        <MetaTags />
      </Head>

      <HitLogo />
      <Nav />
      <Title className="title m0 p0" text="Hawaiians*in&nbsp;Technology" />
      {!members && <LoadingSpinner />}
      {members
        ? members.map((member, i) => {
            return (
              <div key={`member-${i}`}>
                <p>{member.name}</p>
              </div>
            );
          })
        : null}

      <style jsx>{``}</style>
    </div>
  );
}
