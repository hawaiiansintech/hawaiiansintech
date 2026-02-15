import Code from "@/components/Code";
import Logo from "@/components/Logo";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import { Subtitle } from "@/components/Title";
import { ArrowUpRight, Computer, MessageCircleHeart } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { DISCORD_URL, GITHUB_URL } from "../about";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import theme from "@/styles/theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buttonVariants } from "@/components/ui/button";
import { Filter } from "@/lib/firebase-helpers/interfaces";
import { getFilters } from "@/lib/firebase-helpers/filters";
import { getMembers } from "@/lib/firebase-helpers/members";

export async function getStaticProps() {
  const { members, focuses, industries } = await getMembers();

  return {
    props: {
      pageTitle: "Thank You · Hawaiians in Technology",
      members: members,
      focuses: await getFilters(
        FirebaseTablesEnum.FOCUSES,
        true,
        members
          .filter((member) => member.status === StatusEnum.APPROVED)
          .map((m) => m.id),
        focuses,
      ),
      industries: await getFilters(
        FirebaseTablesEnum.INDUSTRIES,
        true,
        members
          .filter((member) => member.status === StatusEnum.APPROVED)
          .map((m) => m.id),
        industries,
      ),
    },
  };
}

export default function ThankYou({ pageTitle, focuses, industries, members }) {
  const router = useRouter();
  const { focusesSelected, industriesSelected } = router.query;
  const [similarFocuses, setSimilarFocuses] = useState<Filter[]>([]);
  const [similarIndustries, setSimilarIndustries] = useState<Filter[]>([]);

  const getActiveFilters = (filters: Filter[], activeIds: string[]) => {
    return filters.filter((filter) => activeIds.includes(filter.id));
  };

  useEffect(() => {
    const updateSimilar = ({ selectedItems, allItems, setter }) => {
      if (!selectedItems) return;
      const queryAsArray = Array.isArray(selectedItems)
        ? selectedItems
        : [selectedItems];
      setter(() => getActiveFilters(allItems, queryAsArray));
    };
    updateSimilar({
      selectedItems: focusesSelected,
      allItems: focuses,
      setter: setSimilarFocuses,
    });
    updateSimilar({
      selectedItems: industriesSelected,
      allItems: industries,
      setter: setSimilarIndustries,
    });
  }, [focuses, industries, focusesSelected, industriesSelected]);

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <div className="column flex h-screen flex-col">
        <header className="relative flex w-full shrink-0 items-center p-4">
          <div className="ml-4 grow">
            <Link href="/">Back to home</Link>
          </div>
          <Logo />
        </header>
        <main className="flex max-w-3xl grow flex-col justify-center gap-4 px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Subtitle text="Submission&nbsp;successful" />
            <img
              src={"/images/shaka.gif"}
              alt="Animated shaka, rotating left to right, real loose"
              className="w-20"
            />
          </div>
          <p>
            <strong>
              A community manager should be reaching out once we review your
              submission
            </strong>{" "}
            and get you added to the directory. Beyond that, this is a pretty
            (intentionally) simple operation. 🤙🏼🤙🏽🤙🏾
          </p>
          <section
            className={cn(
              "flex w-full flex-col gap-4 sm:flex-row",
              similarFocuses.length + similarIndustries.length <= 0 &&
                "flex-col sm:flex-col",
            )}
          >
            <div className="grow">
              <div className="flex flex-col justify-between rounded-xl bg-brown-600/10 pb-4 pt-4">
                <div className="mb-2 space-y-2 px-4">
                  <Computer style={{ color: theme.color.link.base }} />
                  <h3 className="font-semibold text-foreground">
                    Connect with your kanaka peers with interests in common.
                  </h3>
                </div>

                {(similarFocuses.length > 0 ||
                  similarIndustries.length > 0) && (
                  <Accordion type="single" collapsible>
                    {[similarFocuses, similarIndustries].map((items, i) => {
                      if (items.length === 0) return null;

                      return (
                        <div key={`${items[0].filterType}-${i}`}>
                          {items.length > 0 && (
                            <h6 className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brown-600">
                              {items[0].filterType}
                            </h6>
                          )}
                          {items.map((item, itemIndex) => {
                            // conditionally add scroll area if there are more than 8 members
                            let memberContent = (
                              <div className="grid grid-cols-2 gap-1 py-1 pl-5 pr-2">
                                {/* TODO
                                    - this sort of should probably be made possible when we update get-members
                                    - return the members with the filters
                                */}
                                {members
                                  .filter(
                                    (member) =>
                                      (items[0].filterType === "focuses" &&
                                        member.focus
                                          ?.map((foc) => foc?.id)
                                          .includes(item.id)) ||
                                      (items[0].filterType === "industries" &&
                                        member.industry
                                          ?.map((ind) => ind?.id)
                                          .includes(item.id)),
                                  )
                                  .map((member) => (
                                    <Link
                                      key={member.id}
                                      href={member.link}
                                      className={cn(
                                        "flex items-center p-1 text-xs text-foreground",
                                        "plausible-event-name=Thank+You+Page+Click",
                                      )}
                                      target="_blank"
                                    >
                                      <div className="grow">
                                        <p className="line-clamp-1 font-semibold">
                                          {member.name}
                                        </p>
                                        <p className="line-clamp-1">
                                          {member.title}
                                        </p>
                                      </div>
                                      <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" />
                                    </Link>
                                  ))}
                              </div>
                            );

                            if (items[itemIndex].count > 8) {
                              memberContent = (
                                <ScrollArea className="h-48 w-full grid-cols-2 gap-2 rounded-md">
                                  {memberContent}
                                </ScrollArea>
                              );
                            }

                            return (
                              <AccordionItem
                                key={`filter-${itemIndex}-${item.name}`}
                                value={`filter-${itemIndex}-${item.name}`}
                              >
                                <AccordionTrigger className="border-0 px-4 hover:bg-brown-600/10">
                                  <div className="flex items-center">
                                    {/* TODO
                                      - this count is inaccurate, but I want to use it!
                                  <div className="flex min-w-12">
                                    <Badge variant="ghost">{item.count}</Badge>
                                  </div> */}
                                    <h3 className="line-clamp-1 text-left">
                                      {item.name}
                                    </h3>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {memberContent}
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </div>
                      );
                    })}
                  </Accordion>
                )}
                <div className="mt-2 px-4">
                  <Link
                    href="/"
                    target="_blank"
                    className={cn(
                      "plausible-event-name=Thank+You+Page+Click",
                      buttonVariants({ variant: "secondaryBrand" }),
                      "w-full justify-start",
                    )}
                  >
                    → Home
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 basis-1/3 flex-col justify-start gap-4">
              {[
                {
                  icon: <MessageCircleHeart />,
                  title: "Join the discussion on our Discord server.",
                  link: DISCORD_URL,
                  linkLabel: "Discord",
                },
                {
                  icon: <Computer />,
                  title: "Contribute to our projects on GitHub.",
                  link: GITHUB_URL,
                  linkLabel: "Github",
                },
              ].map((item, index) => {
                const { icon, title, link, linkLabel } = item;
                return (
                  <div
                    className="flex flex-col gap-2 rounded-xl bg-brown-600/10 p-4 text-primary"
                    key={`link-${index}`}
                  >
                    {icon}
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <Link
                      href={link}
                      target="_blank"
                      className={cn(
                        "plausible-event-name=Thank+You+Page+Click",
                        buttonVariants({ variant: "secondaryBrand" }),
                        "w-full justify-start",
                      )}
                    >
                      → {linkLabel}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
          <p className="text-sm tracking-wide text-secondary-foreground">
            You should have received a confirmation email from us. If you
            didn&rsquo;t, you may need to add{" "}
            <Code noWrap>no-reply@hawaiiansintech.org</Code> to your address
            book.
          </p>
          <p className="text-sm tracking-wide text-secondary-foreground">
            If you are having any issues, please contact us on{" "}
            <Link
              href={DISCORD_URL}
              className="plausible-event-name=Thank+You+Page+Click text-inherit underline"
            >
              our Discord server
            </Link>
            .
          </p>
        </main>
      </div>
    </>
  );
}
