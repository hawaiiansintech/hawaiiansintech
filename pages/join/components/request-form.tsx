import Button, { ButtonSize } from "@/components/Button";
import Selectable from "@/components/form/Selectable";
import { MemberPublic } from "@/lib/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import { joinFormMap } from "../utils";

interface RequestFormProps {
  onToggle?: () => void;
}

export default function RequestForm({ onToggle }: RequestFormProps) {
  const router = useRouter();
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [editing, setEditing] = useState<boolean[]>([false, false, false]);
  const [memberSelected, setMemberSelected] = useState<MemberPublic>();

  useEffect(() => {
    fetch("/api/get-members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
      });
  }, []);

  useEffect(() => {
    setEditing([false, false, false]);
  }, [memberSelected]);

  const handleSubmit = () => {
    let editMap: string = "";
    joinFormMap.forEach((item, index) => {
      editMap += editing[index] ? "1" : "0";
    });
    if (editMap === "000") return;

    if (editMap[0] === "1") onToggle();

    router.push({
      pathname:
        editMap[0] === "1"
          ? joinFormMap[0]
          : editMap[1] === "1"
          ? joinFormMap[1]
          : joinFormMap[2],
      query: { edit: editMap },
    });
  };

  return (
    <div className="request-form">
      <label htmlFor="member-select">Request edit for:</label>
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
        <>
          <h4>
            I would like to <strong>update / change</strong>:
          </h4>
          <div className="request-form__options">
            <Selectable
              headline={"Basic Information"}
              byline={`${
                (memberSelected.name ? 1 : 0) +
                (memberSelected.location ? 1 : 0) +
                (memberSelected.link ? 1 : 0)
              } / 3 Completed`}
              fullWidth
              selected={editing[0]}
              onClick={() => setEditing([!editing[0], editing[1], editing[2]])}
            />
            <Selectable
              headline={`Work Experience`}
              byline={`${
                (memberSelected.focus ? 1 : 0) +
                (memberSelected.title ? 1 : 0) +
                (memberSelected.yearsExperience ? 1 : 0)
              } / 3 Completed`}
              fullWidth
              selected={editing[1]}
              onClick={() => setEditing([editing[0], !editing[1], editing[2]])}
            />
            <Selectable
              headline={`Company / Industry`}
              byline={`${
                (memberSelected.industry ? 1 : 0) +
                (memberSelected.companySize ? 1 : 0)
              } / 2 Completed`}
              fullWidth
              selected={editing[2]}
              onClick={() => setEditing([editing[0], editing[1], !editing[2]])}
            />
          </div>

          <Button size={ButtonSize.Small} onClick={handleSubmit}>
            Continue
          </Button>
          <a>Remove me from this list</a>
        </>
      )}
      <style jsx>{`
        .request-form {
          margin: 0 auto 1rem;
          max-width: ${theme.layout.width.interior};
          z-index: ${theme.layout.zIndex.above};
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
          margin: 0 0.5rem 0 0;
          white-space: nowrap;
          font-size: 1.5rem;
          color: ${theme.color.text.alt};
        }
        select {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}
