import Button, { ButtonSize } from "@/components/Button";
import { Heading, Subheading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import Tag from "@/components/Tag";
import { MemberPublic } from "@/lib/api";
import { StatusEnum } from "@/lib/enums";
import { useStorage } from "@/lib/hooks";
import { FORM_LINKS } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Request Changes · Hawaiians in Technology",
    },
  };
}

export default function EditPage({ pageTitle }) {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backUrl="/" />
      <Heading>Request Changes</Heading>
      <Subheading centered>Welcome back, Hawaiian.</Subheading>
      <RequestForm />
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
function RequestForm() {
  const router = useRouter();
  const { setItem, removeItem } = useStorage();
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [memberSelected, setMemberSelected] = useState<MemberPublic>();

  useEffect(() => {
    removeItem("userData");
    removeItem("editedData");
    fetch(`/api/get-members?status=${StatusEnum.APPROVED}`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    // reset selection
    removeItem("userData");
    removeItem("editedData");
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
    <div
      className={`
        mx-auto
        mb-4
        mt-8
        flex
        max-w-3xl
        flex-col
        items-center
        px-4
      `}
    >
      <div className="flex w-full flex-grow items-center gap-4">
        <label
          className={`shrink-0 whitespace-nowrap text-stone-900`}
          htmlFor="member-select"
        >
          Request edit for:
        </label>
        <select
          className={`w-full grow rounded bg-tan-100 px-2 py-5 text-lg font-semibold text-stone-700`}
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

        <Button
          size={ButtonSize.Small}
          onClick={handleSubmit}
          disabled={!!!memberSelected}
        >
          Continue
        </Button>
      </div>
      {memberSelected && (
        <a
          href="edit/04-contact?removeRequest=true"
          className={`
            mx-auto
            mt-6
            rounded
            border-4
            border-transparent
            bg-red-300/30
            px-4
            py-0.5
            text-center
            text-red-600
            transition-all
            hover:border-red-300/50
            hover:text-red-600
          `}
        >
          Request removing{" "}
          <span className={`font-semibold`}>{memberSelected.name}</span> from
          the list
        </a>
      )}

      <div className="mx-auto mt-8 max-w-lg rounded-lg bg-tan-300 px-4 py-4 text-center">
        <h4 className="mb-4 text-lg font-semibold">
          <em>Huuuui</em>, get <Tag>NEW</Tag> fields to add to your profile:
        </h4>
        <ul className="grid grid-cols-2 gap-4 text-sm">
          {features.map((feature, i) => {
            return (
              <li key={`new-feature-${i}`}>
                <h3 className={`font-semibold`}>{feature.title}</h3>
                <p className={`text-stone-600`}>{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
