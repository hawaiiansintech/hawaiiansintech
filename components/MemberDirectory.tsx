import { MemberPublic } from "@/lib/api";
import { motion } from "framer-motion";
import theme from "styles/theme";
import Pill from "./Pill";

export interface DirectoryMember extends MemberPublic {
  focus: { active?: boolean; id: string; name: string }[];
}

interface MemberDirectoryProps {
  members?: DirectoryMember[];
}

export default function MemberDirectory({ members }: MemberDirectoryProps) {
  const isFiltered =
    members.filter((mem) => mem.focus?.filter((foc) => foc.active).length > 0)
      .length > 0;
  return (
    <section>
      {members.map((member, i) => {
        const isDisabled =
          member.focus?.filter((foc) => foc.active).length === 0;

        return (
          <motion.div layout="position" key={`member-${member.id}`}>
            <a
              href={member.link}
              target="_blank"
              className={`member ${
                isFiltered && isDisabled && "member--disabled"
              } ${i === members.length - 1 && "member--last"}`}
            >
              <h2 className="member__name">{member.name}</h2>
              <div className="member__location">
                <h3>{member.location}</h3>
                <h4>{member.region}</h4>
              </div>
              <h3 className="member__title">{member.title}</h3>
              <dl className="member__meta">
                {member.focus?.map((foc) => (
                  <dt key={`member-meta-${foc.id}`}>
                    <Pill active={foc.active}>{foc.name}</Pill>
                  </dt>
                ))}
              </dl>
            </a>
          </motion.div>
        );
      })}

      <style jsx>{`
        .member {
          display: block;
          padding: 1rem 0;
          color: ${theme.color.text.base};
          border-bottom: 0.1rem solid ${theme.color.border.alt};
        }
        .member:hover {
          color: ${theme.color.text.alt2};
        }
        .member--disabled {
          opacity: 0.5;
        }
        .member__name {
          color: inherit;
          font-size: 1.5rem;
          font-weight: 500;
          margin: 0;
        }
        .member__title,
        .member__location {
          display: inline-block;
        }
        .member__title {
          margin-bottom: 0.5rem;
        }
        .member__location:after {
          content: "·";
          margin: 0 0.5rem;
          color: ${theme.color.text.alt3};
        }
        .member__meta {
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
        h3,
        h4 {
          color: ${theme.color.text.alt2};
          display: inline-block;
          font-size: 1.25rem;
          margin: 0;
        }
        h3 {
          font-weight: 400;
        }
        h4 {
          font-weight: 400;
          margin-top: 0.25rem;
        }
        .member__location h3:after {
          content: ",";
          margin-right: 0.25rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .member {
            display: grid;
            grid-template-areas: "name location title meta";
            grid-template-columns: 1.5fr 1fr 1fr 0.75fr;
            grid-column-gap: 1rem;
            padding: 1rem;
          }
          .member__name {
            grid-area: name;
            font-size: 2rem;
          }
          .member__location {
            grid-area: location;
          }
          .member__title {
            grid-area: title;
            margin-bottom: 0;
          }
          .member__location:after {
            display: none;
          }
          .member__meta {
            grid-area: meta;
          }
          h3,
          h4 {
            display: block;
          }
          h3 {
            color: ${theme.color.text.alt};
            font-size: 1.5rem;
          }
          h3:after {
            display: none;
          }
          h4 {
            font-size: 1.25rem;
            color: ${theme.color.text.alt2};
          }
          .member:hover h3 {
            color: inherit;
          }

          .member:hover h4 {
            color: ${theme.color.text.alt3};
          }
        }
      `}</style>
    </section>
  );
}
