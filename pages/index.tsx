import FocusPicker, { FocusPickerFocus } from "@/components/FocusPickerNew";
import MemberDirectory, { DirectoryMember } from "@/components/MemberDirectory";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import { Title } from "@/components/Title.js";
// Change to "@/lib/stubApi" if no access to airtable vars!
import {
  Focus,
  getFocuses,
  getIndustries,
  getMembers,
  Industry,
  MemberPublic,
} from "@/lib/api";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import theme from "styles/theme";

export async function getStaticProps() {
  const members: MemberPublic[] = await getMembers();
  const focuses: Focus[] = await getFocuses(true);
  const industries: Industry[] = await getIndustries();
  return {
    props: {
      fetchedMembers: members,
      fetchedFocuses: focuses,
      fetchedIndustries: industries,
      pageTitle: "Hawaiians in Tech",
    },
    revalidate: 60,
  };
}

export default function HomePage({
  fetchedMembers,
  fetchedFocuses,
  fetchedIndustries,
  pageTitle,
}) {
  const initialState = {
    members: fetchedMembers.map((mem) => ({
      ...mem,
      // mutate & add active prop
      focus: mem.focus
        ? mem.focus.map((foc) => ({ ...foc, active: false }))
        : [],
    })),
    focuses: fetchedFocuses.filter((focus) => focus.count > 0),
    industries: fetchedIndustries,
  };
  const [members, setMembers] = useState<DirectoryMember[]>(
    initialState.members
  );
  const [focuses, setFocuses] = useState<FocusPickerFocus[]>(
    initialState.focuses
  );
  const [industries, setIndustries] = useState<[]>(initialState.industries);

  useEffect(() => {
    const activeFocuses = focuses.filter((foc) => foc.active);
    const membersWithFocuses = members
      .map((mem) => ({
        ...mem,
        focus: mem.focus?.map((foc) => ({
          ...foc,
          // update member focuses if filtered
          active: activeFocuses.map((foc) => foc.id).includes(foc.id),
        })),
      }))
      // sort by number of focuses set
      .sort((a, b) => {
        if (a.focus === undefined || b.focus === undefined) return;
        const firstActive = a.focus
          .map((foc) => foc?.active)
          .filter((foc) => foc).length;
        const nextActive = b?.focus
          .map((foc) => foc?.active)
          .filter((foc) => foc).length;
        // if same count, randomize
        if (nextActive === firstActive) return 0.5 - Math.random();
        // or sort by
        return nextActive > firstActive ? 1 : -1;
      });

    setMembers(membersWithFocuses);
  }, [focuses]);

  const handleFilterByFocuses = (id?: string) => {
    setFocuses(
      focuses.map((foc) => ({
        ...foc,
        // add false active prop
        active: id ? (id === foc.id ? !foc.active : foc.active) : false,
      }))
    );
  };

  return (
    <>
      <Head>
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav primaryNav={{ show: true }} />
      <div className="home-splash">
        <Title className="m0 p0" text="Hawaiians*in&nbsp;Technology" />
      </div>
      <div>
        <aside>
          {focuses && (
            <FocusPicker
              focuses={focuses}
              onFilterClick={handleFilterByFocuses}
              memberCount={members.length}
            />
          )}
        </aside>
        <main>{members && <MemberDirectory members={members} />}</main>
      </div>
      <style jsx>{`
        .home-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .home-splash {
            margin: 0 2rem;
          }
        }
        main {
          padding: 0 1rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
          main {
            padding: 0 1rem;
          }
        }
        aside {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 8rem 0 1rem;
          padding: 0 1rem 0.5rem;
          background: ${theme.color.background.base};
          border-bottom: 0.125rem solid ${theme.color.border.base};
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          aside {
            padding: 0 2rem 1rem;
          }
        }
        h5 {
          margin: 0;
          text-align: right;
          font-size: 1.125rem;
          color: ${theme.color.text.alt2};
          font-weight: 400;
        }
        h5 strong {
          color: ${theme.color.text.alt};
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
