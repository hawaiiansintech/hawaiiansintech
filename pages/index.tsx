import FocusPicker, { FocusPickerFocus } from "@/components/FocusPicker";
import HitLogo from "@/components/HitLogo.js";
import MemberDirectory, { DirectoryMember } from "@/components/MemberDirectory";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav.js";
import Title from "@/components/Title.js";
import { getFocuses, getMembers } from "@/lib/api";
import Head from "next/head";
import React, { useEffect, useState } from "react";

export async function getStaticProps() {
  const members = await getMembers();
  const focuses = await getFocuses();
  return {
    props: {
      allMembers: members.map((mem) => ({
        ...mem,
        focus: mem.focus.map((foc) => ({ ...foc, active: false })),
      })),
      allFocuses: focuses.filter((focus) => focus.count > 0),
    },
    revalidate: 60,
  };
}

export default function Home({ allMembers, allFocuses }) {
  const [members, setMembers] = useState<DirectoryMember[]>(allMembers);
  const [focuses, setFocuses] = useState<FocusPickerFocus[]>(allFocuses);

  const handleFilterByFocuses = (id: string) => {
    setFocuses(
      focuses.map((foc) => ({
        ...foc,
        // add false active prop
        active: foc.id === id ? !foc.active : foc.active,
      }))
    );
  };

  useEffect(() => {
    const activeFocuses = focuses.filter((foc) => foc.active);
    const newMembers = members
      .map((mem) => ({
        ...mem,
        focus: mem.focus.map((foc) => ({
          ...foc,
          // update member focuses if filtered
          active: activeFocuses.map((foc) => foc.id).includes(foc.id),
        })),
      }))
      // sort by number of focuses set
      .sort((a, b) => {
        const firstActive = a.focus
          .map((foc) => foc.active)
          .filter((foc) => foc).length;
        const nextActive = b.focus
          .map((foc) => foc.active)
          .filter((foc) => foc).length;
        // if same count, randomize
        if (nextActive === firstActive) return 0.5 - Math.random();
        // or sort by
        return nextActive > firstActive ? 1 : -1;
      });

    setMembers(newMembers);
  }, [focuses]);

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
      <main>
        {focuses && (
          <FocusPicker
            focuses={focuses}
            onFilterClick={handleFilterByFocuses}
          />
        )}
        {members && <MemberDirectory members={members} />}
      </main>
      <style jsx>{`
        main {
          margin-top: 10rem;
        }
      `}</style>
    </div>
  );
}
