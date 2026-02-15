import React from "react";
import Head from "next/head";
import Image from "next/image";
import { GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import Nav from "@/components/Nav";
import ChangelogLinks from "@/components/ChangelogLinks";
import { formatDate } from "@/helpers";
import fs from "fs";
import path from "path";

interface ChangelogEntry {
  date: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  href?: string[];
  imageURL?: string;
}

interface ChangelogIndexProps {
  entries: ChangelogEntry[];
  pageTitle: string;
}

const ChangelogIndex: React.FC<ChangelogIndexProps> = ({
  entries,
  pageTitle = "Changelog · Hawaiians in Technology",
}) => {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backLinkTo="/" variant="minimized" />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">Changelog</h1>
        <ul className="flex flex-col gap-16">
          {entries.map((entry) => (
            <li
              key={entry.slug}
              className="grid gap-2 lg:grid-cols-[0.25fr_1fr]"
            >
              <div>
                <p className="sticky top-4 text-lg text-muted-foreground">
                  {formatDate(entry.date)}
                </p>
              </div>
              <div className="space-y-4">
                {entry.imageURL && (
                  <Image
                    src={`${entry.imageURL}`}
                    alt=""
                    height={960}
                    width={540}
                    className="mb-4 w-full rounded-lg border"
                  />
                )}
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {entry.title}
                  </h2>
                  <ReactMarkdown className="prose">
                    {entry.content}
                  </ReactMarkdown>
                </div>
                {entry.href && <ChangelogLinks links={entry.href} />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "public/changelog.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const entries = JSON.parse(fileContents);

  return {
    props: {
      entries,
    },
  };
};

export default ChangelogIndex;
