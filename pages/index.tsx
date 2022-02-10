import Selectable from "@/components/form/Selectable";
import HitLogo from "@/components/HitLogo.js";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav.js";
import Pill from "@/components/Pill";
import Title from "@/components/Title.js";
import { Focus, getFocuses, getMembers, Member } from "@/lib/api";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export async function getStaticProps() {
  const members = await getMembers();
  const focuses = await getFocuses();
  return {
    props: {
      allMembers: members
        .map((mem) => ({
          ...mem,
          focus: mem.focus.map((foc) => ({ ...foc, active: false })),
        }))
        .sort(() => 0.5 - Math.random()),
      allFocuses: focuses.filter((focus) => {
        return focus;
        return focus.count > 0;
      }),
    },
    revalidate: 60,
  };
}

interface DirectoryMember extends Member {
  focus: { active?: boolean; id: string; name: string }[];
}

interface DirectoryFocus extends Focus {
  active?: boolean;
}

export default function Home({ allMembers, allFocuses }) {
  const [members, setMembers] = useState<DirectoryMember[]>(allMembers);
  const [focuses, setFocuses] = useState<DirectoryFocus[]>(allFocuses);

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
    const newMembers = members
      .map((mem) => ({
        ...mem,
        focus: mem.focus.map((foc) => ({
          ...foc,
          // update member focuses if filtered
          active: focuses
            .filter((foc) => foc.active)
            .map((foc) => foc.id)
            .includes(foc.id),
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
        {members && <MemberList members={members} />}
      </main>
      <style jsx>{`
        main {
          margin-top: 10rem;
        }
      `}</style>
    </div>
  );
}

interface DirectoryMemberListProps {
  members?: DirectoryMember[];
}

function MemberList({ members }: DirectoryMemberListProps) {
  return (
    <>
      {members.map((member, i) => (
        <motion.div layout="position" key={`member-${member.name}`}>
          <Link href={member.link}>
            <div className="member">
              <h2 className="member__name">{member.name}</h2>
              <div className="member__location">
                <h3>{member.location}</h3>
                <h4>{member.region}</h4>
              </div>
              <h3>{member.title}</h3>
              <dl>
                {member.focus.map((foc) => (
                  <dt key={`member-pill-${foc.id}`}>
                    <Pill active={foc.active}>{foc.name}</Pill>
                  </dt>
                ))}
              </dl>
            </div>
          </Link>
        </motion.div>
      ))}

      <style jsx>{`
        div.member {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          column-gap: 1rem;
          border-bottom: 0.1rem solid var(--color-border-alt);
          padding: 2rem 1rem;
        }
        dl {
          display: flex;
          flex-wrap: wrap;
          margin: 0;
        }
        dt {
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }
        h2,
        h3,
        h4 {
          margin: 0;
        }
        h2 {
          font-size: 2rem;
          margin: 0;
          font-weight: 500;
        }
        h3 {
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--color-text-alt);
        }
        h4 {
          margin-top: 0.25rem;
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--color-text-alt-2);
        }
      `}</style>
    </>
  );
}

interface FocusPickerProps {
  focuses: DirectoryFocus[];
  onFilterClick: (id: string) => any;
}

function FocusPicker({ focuses, onFilterClick }: FocusPickerProps) {
  const visibleCount = 6;
  return (
    <ul>
      {focuses.map((focus, i) => (
        <li key={`focus-filter-${i}`}>
          <Selectable
            fullWidth
            headline={focus.name}
            onClick={() => onFilterClick(focus.id)}
            selected={focus.active}
            disabled={i >= visibleCount || focus.count === 0}
          />
        </li>
      ))}
      <style jsx>{`
        ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          flex-shrink: 0;
          width: calc((100vw - 4rem) / ${visibleCount} - 1rem);
          margin: 0 0.5rem 0 0;
          padding: 0;
        }
      `}</style>
    </ul>
  );
}
