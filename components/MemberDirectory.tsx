import { MemberPublic } from "@/lib/api";
import { motion } from "framer-motion";
import theme from "styles/theme";
import { Icon, IconAsset, IconColor, IconSize } from "./icon/icon";
import Pill from "./Pill";

export interface DirectoryMember extends MemberPublic {
  focus: { active?: boolean; id: string; name: string }[];
  industry: { active?: boolean; id: string; name: string }[];
  experienceFilter: { active?: boolean; id: string; name: string }[];
  regionFilter: { active?: boolean; id: string; name: string }[];
}

interface MemberDirectoryProps {
  members?: DirectoryMember[];
}

export default function MemberDirectory({ members }: MemberDirectoryProps) {
  const isFiltered =
    members.filter(
      (mem) =>
        mem.focus
          .concat(mem.industry)
          .concat(mem.experienceFilter)
          .concat(mem.regionFilter)
          ?.filter((foc) => foc.active).length > 0
    ).length > 0;
  return (
    <section>
      {members.map((member, i) => {
        const isSelected =
          member.focus
            .concat(member.industry)
            .concat(member.experienceFilter)
            .concat(member.regionFilter)
            ?.filter((foc) => foc.active).length > 0;
        return (
          <motion.div layout="position" key={`member-${member.id}`}>
            <a
              href={member.link}
              target="_blank"
              className={`member ${
                isFiltered && !isSelected && "member--disabled"
              } ${i === members.length - 1 && "member--last"} ${
                isSelected && "member--selected"
              }`}
            >
              <h2 className="member__name">{member.name}</h2>
              <div className="member__location">
                {/* <h3
                  className={
                    member.regionFilter[0] && member.regionFilter[0].active
                      ? "region--selected"
                      : null
                  }
                >
                  {member.location}
                </h3>
                <h4
                  className={
                    member.regionFilter[0] && member.regionFilter[0].active
                      ? "region--selected"
                      : null
                  }
                >
                  {member.region}
                </h4> */}
                <h3>{member.location}</h3>
                {member.regionFilter[0] ? (
                  <h4>
                    <Pill
                      active={member.regionFilter[0].active}
                      customWidth="max-content"
                      customFontSize="1rem"
                    >
                      {member.regionFilter[0].name}
                    </Pill>
                  </h4>
                ) : (
                  <h4>{member.region}</h4>
                )}
              </div>
              <div>
                <h3 className="member__title">{member.title}</h3>
                <dl className="member__meta">
                  {member.focus?.map((fil) => (
                    <dt key={`member-meta-${fil.id}`}>
                      <Pill active={fil.active}>{fil.name}</Pill>
                    </dt>
                  ))}
                  {member.industry?.map((fil) => (
                    <dt key={`member-meta-${fil.id}`}>
                      <Pill active={fil.active}>{fil.name}</Pill>
                    </dt>
                  ))}
                  {member.experienceFilter?.map((fil) => (
                    <dt key={`member-meta-${fil.id}`}>
                      <Pill active={fil.active}>{fil.name}</Pill>
                    </dt>
                  ))}
                </dl>
              </div>
              <div className="member__link">
                <Icon
                  asset={IconAsset.CaretRight}
                  color={IconColor.Inherit}
                  size={IconSize.Small}
                />
              </div>
            </a>
          </motion.div>
        );
      })}

      <style jsx>{`
        .member {
          position: relative;
          display: block;
          padding: 1rem 3rem 1rem 0;
          margin-bottom: 0.5rem;
          color: ${theme.color.text.base};
          border-radius: ${theme.borderRadius.md};
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
          margin-bottom: 0.25rem;
        }
        .member__location:after {
          content: "·";
          margin: 0 0.5rem;
          color: ${theme.color.text.alt3};
        }
        .member__link {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateX(-0.5rem) translateY(-50%);
          transform-origin: center right;
          padding: 0.5rem;
          color: ${theme.color.brand.base};
          transition: transform ease-in 150ms;
        }
        .member:hover .member__link {
          transform: translateX(0) translateY(-50%);
          opacity: 1;
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
          margin-top: 0.4rem;
        }
        .member__location h3:after {
          content: ",";
          margin-right: 0.25rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .member {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            grid-column-gap: 2rem;
            padding: 0.5rem 4rem 0.5rem 0.5rem;
            border: 0.25rem solid transparent;
            background: transparent;
          }
          .member:hover {
            color: ${theme.color.brand.base};
          }
          .member--selected {
            background: ${theme.color.brand.alpha};
            border-color: ${theme.color.brand.alpha};
          }
          .region--selected {
            color: ${theme.color.brand.base};
          }
          .member__name {
            font-size: 2rem;
          }
          .member__location {
          }
          .member__title {
            margin-bottom: 0.25rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .member__location:after {
            display: none;
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
          .member:hover {
            border-color: ${theme.color.brand.alpha};
          }
          .member:hover h3,
          .member:hover h4 {
            color: inherit;
          }
        }
      `}</style>
    </section>
  );
}
