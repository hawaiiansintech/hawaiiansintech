import Button, { ButtonSize } from "@/components/Button";
import ProgressBar from "@/components/form/ProgressBar";
import { Heading } from "@/components/Heading";
import JoinHeader from "@/components/intake-form/JoinHeader";
import MetaTags from "@/components/Metatags";
import { MemberPublic } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";

interface RequestFormProps {
  onToggle?: () => void;
}

export default function RequestForm({ onToggle }: RequestFormProps) {
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

  const handleToggle = () => {
    router.push({ pathname: `/join` });
  };

  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Request Changes</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader hideCenter showModify toggleEdit={handleToggle}>
        <ProgressBar
          headline="Public"
          label="Who You Are"
          currentCount={1}
          totalCount={4}
        />
      </JoinHeader>
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
        {/* <a>Remove me from this list</a> */}
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
      </div>
    </>
  );
}
