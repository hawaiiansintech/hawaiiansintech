import Button, { ButtonSize } from "@/components/Button";
import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import { MemberPublic } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";

export default function EditPage() {
  const router = useRouter();
  const { setItem, removeItem } = useStorage();
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [memberSelected, setMemberSelected] = useState<MemberPublic>();

  useEffect(() => {
    fetch("/api/get-members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
      });
  }, []);

  useEffect(() => {
    // reset selection
    removeItem("userData");
    // add all items in storage
    if (!memberSelected) return;
    if (memberSelected) setItem("userData", JSON.stringify(memberSelected));
  }, [memberSelected]);

  const handleSubmit = () => {
    router.push({
      pathname: `/edit/${FORM_LINKS[0]}`,
    });
  };

  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Request Changes</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <Nav backUrl="/join/01-you" />
      <Heading>Request Changes</Heading>
      <div className="request-form">
        <label htmlFor="member-select">Request edit for:</label>
        <div className="request-form__input">
          <select
            name="member-select"
            id="member-select"
            onChange={(e) => {
              setMemberSelected(
                members.find((member) => member.id === e.target.value)
              );
            }}
          >
            {members?.length > 0 ? (
              <option value="">Please choose an option</option>
            ) : (
              <option value="">loading</option>
            )}
            {members?.map((member: MemberPublic) => (
              <option value={member.id} key={`member-${member.id}`}>
                {member.name}
              </option>
            ))}
          </select>
          {memberSelected && (
            <Button size={ButtonSize.Small} onClick={handleSubmit}>
              Continue
            </Button>
          )}
        </div>
      </div>
      <NewFeatures />
      <style jsx>{`
        .request-form {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 0 2rem;
          gap: 0.5rem;
          margin: 0 auto 1rem;
          max-width: ${theme.layout.width.interior};
          z-index: ${theme.layout.zIndex.above};
        }
        .request-form__input {
          display: flex;
          gap: 0.5rem;
          flex-grow: 1;
          flex-wrap: wrap;
        }
        .request-form__options {
          display: grid;
          grid-auto-rows: 4rem;
          grid-column-gap: 0.5rem;
          grid-row-gap: 0.5rem;
          margin-bottom: 1rem;
        }
        h3 {
          margin: 2rem 0 0.5rem;
          font-size: 1.6rem;
          font-weight: 400;
          color: ${theme.color.text.alt};
        }
        h4 {
          margin: 1rem 0 0.5rem;
          font-size: 1.2rem;
          font-weight: 400;
        }
        label {
          margin: 0;
          white-space: nowrap;
          font-size: 1.25rem;
          color: ${theme.color.text.alt};
        }
        select {
          flex-grow: 1;
          font-size: 1.25rem;
        }
      `}</style>
    </>
  );
}

const features: { title: string; description: string }[] = [
  {
    title: "Field of Work",
    description: "Core discipline and craft in the industry",
  },
  {
    title: "Years of Experience",
    description: "Level of expertise in your field",
  },
  {
    title: "Industry",
    description: "Broader domain / business you work within",
  },
  {
    title: "Job title",
    description: "The title that hangs from your name tag",
  },
];
function NewFeatures() {
  return (
    <div className="new-features">
      <div className="new-features__container">
        <h4 className="new-features__headline">
          A few <span>NEW</span> fields to add to your profile:
        </h4>
        <ul className="new-features__list">
          {features.map((feature, i) => {
            return (
              <li className="new-features__item" key={`new-feature-${i}`}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .new-features {
          margin: 2rem 1rem 0;
        }
        .new-features__container {
          margin: 0 auto;
          max-width: ${theme.layout.width.interior};
          border-radius: ${theme.borderRadius.md};
          background: ${theme.color.background.alt};
          padding: 1rem;
          font-size: 1rem;
        }
        .new-features__headline {
          font-size: 1.25rem;
          text-align: center;
          margin: 0 0 1rem;
          color: ${theme.color.text.alt};
        }
        .new-features__list {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          grid-template-rows: repeat(2, 1fr);
          column-gap: 1rem;
          row-gap: 1rem;
          text-align: center;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .new-features__list {
            padding-bottom: 1rem;
          }
        }
        h3 {
          font-size: 1em;
          margin: 0 0 0.25rem;
          line-height: 1.2;
          color: ${theme.color.text.alt};
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        p {
          font-size: 0.875em;
          margin: 0;
          color: ${theme.color.text.alt3};
        }
        span {
          display: inline-block;
          background: ${theme.color.brand.base};
          color: ${theme.color.text.overlay.base};
          font-size: 0.8em;
          padding: 0.33em 0.5em;
          line-height: 1;
          border-radius: ${theme.borderRadius.xs};
        }
      `}</style>
    </div>
  );
}
