import { Member } from "@/lib/api";
import { motion } from "framer-motion";
import Pill from "./Pill";

export interface DirectoryMember extends Member {
  focus: { active?: boolean; id: string; name: string }[];
}

interface MemberDirectoryProps {
  members?: DirectoryMember[];
}

export default function MemberDirectory({ members }: MemberDirectoryProps) {
  return (
    <>
      {members.map((member, i) => (
        <motion.div layout="position" key={`member-${member.name}`}>
          <a href={member.link} target="_blank" className="member">
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
          </a>
        </motion.div>
      ))}

      <style jsx>{`
        .member {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 0.75fr;
          column-gap: 1rem;
          border-bottom: 0.1rem solid var(--color-border-alt);
          padding: 1rem;
        }
        dl,
        dt {
          overflow: hidden;
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
          color: var(--color-text);
          font-size: 2rem;
          font-weight: 500;
          margin: 0;
        }
        h3 {
          color: var(--color-text-alt);
          font-size: 1.5rem;
          font-weight: 400;
        }
        h4 {
          color: var(--color-text-alt-2);
          font-size: 1.25rem;
          font-weight: 400;
          margin-top: 0.25rem;
        }
      `}</style>
    </>
  );
}
