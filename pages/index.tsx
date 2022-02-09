import Selectable from "@/components/form/Selectable";
import HitLogo from "@/components/HitLogo.js";
import MetaTags from "@/components/Metatags.js";
import Nav from "@/components/Nav.js";
import Pill from "@/components/Pill";
import Title from "@/components/Title.js";
import { getFocuses, getMembers } from "@/lib/api";
import Head from "next/head";

export async function getStaticProps() {
  const members = await getMembers();
  const focuses = await getFocuses();
  return {
    props: {
      members,
      focuses: focuses.filter((focus) => {
        return focus;
        return focus.count > 0;
      }),
    },
    revalidate: 60,
  };
}

export default function Home({ members, focuses }) {
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
        {focuses && <FocusPicker focuses={focuses} />}
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

interface MemberListProps {
  members?: any[];
}

function MemberList({ members }: MemberListProps) {
  return (
    <ul className="member-list">
      {members.map((member, i) => (
        <li className="member" key={`member-${i}`}>
          <div>
            <h2 className="member__name">{member.name}</h2>
          </div>
          <div className="member__location">
            <h3>{member.location}</h3>
            <h4>{member.region}</h4>
          </div>
          <div>
            <h3>{member.title}</h3>
          </div>
          <div>
            <dl>
              {member.focus.map((foc) => (
                <dt>
                  <Pill>{foc.name}</Pill>
                </dt>
              ))}
            </dl>
          </div>
        </li>
      ))}
      <style jsx>{`
        ul.member-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li.member {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          column-gap: 1rem;
          border-bottom: 0.1rem solid var(--color-border-alt);
          padding: 2rem 1rem;
        }
        dl {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.5rem;
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
    </ul>
  );
}

interface FocusPickerProps {
  focuses: any;
}
function FocusPicker({ focuses }: FocusPickerProps) {
  const activeCount = 6;
  return (
    <ul>
      {focuses.map((focus, i) => {
        const disabled = i >= activeCount;
        return (
          <li
            className={`${disabled ? "disabled" : ""}`}
            key={`focus-filter-${i}`}
          >
            <Selectable headline={focus.name} fullWidth />
          </li>
        );
      })}
      <style jsx>{`
        ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          flex-shrink: 0;
          width: calc((100vw - 4rem) / ${activeCount} - 1rem);
          margin: 0 0.5rem 0 0;
          padding: 0;
        }
        li.disabled {
          pointer-events: none;
          opacity: 0.5;
        }
      `}</style>
    </ul>
  );
}
