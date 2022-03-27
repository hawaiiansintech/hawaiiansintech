import FocusPicker, { FocusPickerFocus } from "@/components/FocusPicker";
import HitLogo from "@/components/HitLogo.js";
import MemberDirectory, { DirectoryMember } from "@/components/MemberDirectory";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav";
import Title from "@/components/Title.js";
import { Focus, getFocuses, getMembers, Member } from "@/lib/api";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import theme from "styles/theme";

export async function getStaticProps() {
  const members: Member[] = await getMembers();
  const focuses: Focus[] = await getFocuses();
  return {
    props: {
      allMembers: members.map((mem) => ({
        ...mem,
        // mutate & add active prop
        focus: mem.focus.map((foc) => ({ ...foc, active: false })),
      })),
      allFocuses: focuses
        .filter((focus) => focus.count > 0)
        .sort((a, b) => b.count - a.count),
    },
    revalidate: 60,
  };
}

export default function Home({ allMembers, allFocuses }) {
  const [members, setMembers] = useState<DirectoryMember[]>(allMembers);
  const [focuses, setFocuses] = useState<FocusPickerFocus[]>(allFocuses);

  const handleFilterByFocuses = (id?: string) => {
    setFocuses(
      focuses.map((foc) => ({
        ...foc,
        // add false active prop
        active: id ? (id === foc.id ? !foc.active : foc.active) : false,
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
    <>
      <div className="container">
        <Head>
          <title>Hawaiians in Technology</title>
          <link id="favicon" rel="alternate icon" href="/favicon.ico" />
          <MetaTags />
        </Head>

        <HitLogo />
        <Nav />
        <div style={{ paddingTop: "26vh" }}>
          <Title className="m0 p0" text="Hawaiians*in&nbsp;Technology" />
        </div>
      </div>
      <div>
        <aside>
          {focuses && (
            <FocusPicker
              focuses={focuses}
              onFilterClick={handleFilterByFocuses}
            />
          )}
        </aside>
        <main>{members && <MemberDirectory members={members} />}</main>
        <style jsx>{`
          main {
            padding: 0 1rem;
          }
          @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
            main {
              padding: 0 1rem;
            }
          }
          aside {
            margin: 8rem 0 2rem;
            padding: 0 1rem;
          }
          @media screen and (min-width: ${theme.layout.breakPoints.small}) {
            aside {
              padding: 0 2rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}
