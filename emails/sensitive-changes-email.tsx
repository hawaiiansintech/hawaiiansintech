import { DISCORD_URL } from "@/pages/about";
import { Text, Link } from "@react-email/components";
import * as React from "react";
import CTABlock from "./ui/cta-block";
import Base from "./ui/base";
import List from "./ui/list";
import { CreateMemberFields } from "@/lib/firebase-helpers/members";
import Layout from "./ui/layout";
import Logo from "./ui/logo";
import Code from "@/components/Code";

export default function SensitiveChangesEmail({
  name = "[Name Inoa]",
  changes = `{"link": {"old": "https://old.url", "new": "https://new.url"}}`,
  recordID,
}: {
  name: string;
  changes: string;
  recordID: string;
}) {
  const FIREBASE_URL = `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/data/~2Fmembers~2F${recordID}`;
  const changesObject = JSON.parse(changes);

  return (
    <Base
      preview={`Freeform Field Changes from ${name}`}
      title={`Freeform Field Changes from ${name}`}
    >
      <Layout>
        <Logo />
        <Text className="px-4 text-center text-3xl">
          Freeform Changes from
          <br />
          <strong>{name}</strong>
        </Text>
        <Text>
          A member <strong className="font-semibold">{name}</strong> updated
          their information with one of our freeform fields. Out of an abundance
          of caution, we let admin know to make sure these fields are not being
          abused.
        </Text>
        <Text>
          Please ensure the following changes are appropriate:
          <List
            nodes={Object.keys(changesObject).map((key) => ({
              icon: "👀",
              label: (
                <>
                  <strong className="capitalize">{key}</strong> changed from{" "}
                  <code className="rounded bg-stone-200 px-1.5 py-1 text-xs font-semibold text-stone-600">
                    {changesObject[key].old}
                  </code>{" "}
                  to{" "}
                  <code className="rounded bg-stone-200 px-1.5 py-1 text-xs font-semibold text-stone-600">
                    {changesObject[key].new}
                  </code>
                  .
                </>
              ),
            }))}
          />
        </Text>
        <Text>
          If anything looks wrong here, please return the fields back to their
          original values. If this appears to be a problem, please reach out to
          the member directly.
        </Text>
        <CTABlock
          className="mt-4"
          nodes={[
            <>You are receiving this because you are a community manager</>,
            <CTABlock.Button href={FIREBASE_URL}>Open {name}</CTABlock.Button>,
          ]}
        />
        {recordID && (
          <Text className="mb-0 mt-2 text-center text-xs italic text-stone-300">
            {recordID}
          </Text>
        )}
      </Layout>
    </Base>
  );
}
