import Admin from "@/components/admin/Admin";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import Tag, { TagVariant } from "@/components/Tag";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FirestoreDocumentData,
  MemberPublic,
} from "@/lib/firebase-helpers/interfaces";
import { StatusEnum, YearsOfExperienceEnum } from "@/lib/enums";
import { useIsAdmin } from "@/lib/hooks";
import { User } from "firebase/auth";
import { convertStringSnake } from "helpers";
import { cn, sortByOrder } from "@/lib/utils";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";
import { MemberEdit } from "@/components/MemberEdit";
// import { getAllMemberReferencesToDelete } from "@/lib/firebase-helpers/members";
// import { deleteReferences } from "@/lib/firebase-helpers/members";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Directory · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function DirectoryPage(props) {
  const { pageTitle } = props;
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [regions, setRegions] = useState<FirestoreDocumentData[]>([]);
  const [experience, setExperience] = useState<FirestoreDocumentData[]>([]);
  const [user, loading] = useAuthState(auth);
  const [isAdmin, isAdminLoading] = useIsAdmin(user, loading);
  const router = useRouter();
  const experienceOrder = Object.values(YearsOfExperienceEnum) as string[];

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) router.push(`/admin`);
  }, [isAdmin, isAdminLoading, router]);

  const fetchMembers = useCallback(async () => {
    const response = await fetch("/api/members", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    const data = await response.json();
    if (data) {
      setMembers(data.members);
      setRegions(
        (data.regions || [])
          .filter((item) => item && item.fields && item.fields.name) // Filter out invalid items
          .sort((a, b) => {
            const aName = a.fields.name;
            const bName = b.fields.name;
            return aName.localeCompare(bName);
          }),
      );
      setExperience(sortByOrder(data.experience || [], experienceOrder));
    }
  }, [user, experienceOrder]);

  useEffect(() => {
    if (isAdmin) {
      fetchMembers();
    }
  }, [isAdmin]);

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Admin>
        <Admin.Nav
          handleLogOut={signOutWithGoogle}
          handleLogIn={signInWithGoogle}
          isLoggedIn={!!user}
          isAdmin={isAdmin}
          displayName={user?.displayName}
        />
        <Admin.Body>
          {isAdminLoading && (
            <div className="flex w-full justify-center p-4">
              <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
            </div>
          )}
          {isAdmin && (
            <div className="mx-auto">
              <Directory
                members={members}
                regions={regions}
                experience={experience}
                user={user}
              />
            </div>
          )}
        </Admin.Body>
      </Admin>
    </>
  );
}

interface MemberDirectoryProps {
  members?: MemberPublic[];
  regions?: FirestoreDocumentData[];
  experience?: FirestoreDocumentData[];
  user?: User;
}

type MemberDirectoryType = FC<MemberDirectoryProps> & {
  Card: FC<CardProps>;
};

enum DirectorySortOrder {
  Alphabetical = "Alphabetical",
  LastModified = "Last Modified",
}

enum DirectoryFilter {
  All = "All",
  InProgress = "In Progress",
  Pending = "Pending",
  Archived = "Archived",
}

const Directory: MemberDirectoryType = ({
  members,
  regions,
  experience,
  user,
}) => {
  const [tabVisible, setTabVisible] = useState<DirectoryFilter>(
    DirectoryFilter.All,
  );
  const [sortOrder, setSortOrder] = useState<DirectorySortOrder>(
    DirectorySortOrder.LastModified,
  );
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [filteredMembers, setFilteredMembers] = useState<MemberPublic[]>();

  useEffect(() => {
    setFilteredMembers(
      members
        ?.filter((m) => {
          switch (tabVisible) {
            case DirectoryFilter.All:
              return true;
            case DirectoryFilter.Pending:
              return m.status === StatusEnum.PENDING;
            case DirectoryFilter.InProgress:
              return m.status === StatusEnum.IN_PROGRESS;
            case DirectoryFilter.Archived:
              return m.status === StatusEnum.DECLINED;
            default:
              return false;
          }
        })
        .sort((a, b) => {
          if (sortOrder === DirectorySortOrder.LastModified) {
            if (moment(a.lastModified) > moment(b.lastModified)) return -1;
            if (moment(a.lastModified) < moment(b.lastModified)) return 1;
            return 0;
          }
          return 0;
        }),
    );
  }, [members, tabVisible, sortOrder]);

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-tan-400">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-1 px-2 py-1">
          <div className="flex grow items-center gap-2">
            <h2 className="text-xl font-semibold leading-8">Directory</h2>
            <Tabs
              defaultValue={Object.values(DirectoryFilter)[0]}
              onValueChange={(value) => {
                setTabVisible(value as DirectoryFilter);
              }}
              value={tabVisible}
            >
              <TabsList loop>
                {Object.values(DirectoryFilter).map((filter, i) => (
                  <TabsTrigger value={filter} key={`directory-filter-${i}`}>
                    {filter}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex grow justify-end">
              <select
                className="rounded px-1 py-0.5 text-sm"
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as DirectorySortOrder)
                }
              >
                {Object.values(DirectorySortOrder).map((option) => (
                  <option key={`sort-order-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col">
        {error && (
          <div className="mx-auto my-2 w-full max-w-5xl">
            <ErrorMessage
              headline={error.headline}
              body={error.body}
              onClose={() => {
                setError(null);
              }}
            />
          </div>
        )}
        {filteredMembers && filteredMembers.length > 0 ? (
          <>
            {filteredMembers.map((m) => (
              <Directory.Card
                member={m}
                key={`member-card-${m.id}`}
                regions={regions}
                experience={experience}
                user={user}
              />
            ))}
          </>
        ) : (
          <div className="flex w-full justify-center p-4">
            <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
          </div>
        )}
      </div>
    </>
  );
};

interface CardProps {
  member: MemberPublic;
  regions?: FirestoreDocumentData[];
  experience?: FirestoreDocumentData[];
  user?: User;
}

Directory.Card = Card;

function Card({ member, regions, experience, user }: CardProps) {
  const [, setShowModal] = useState<boolean>(false);
  const handleDelete = async () => {
    alert("NOT ACTUALLY DELETING!!! RETURNING EARLY");
    return;
    // const references = await getAllMemberReferencesToDelete(member.id);
    // const memberRef = references.memberRef;
    // // CONFIRM THAT THIS CHECKS IF OTHER MEMBERS USE THE SAME FOCUSES
    // console.log("removing focuses references");
    // await deleteReferences(memberRef, references.focuses);
    // // CONFIRM THAT THIS CHECKS IF OTHER MEMBERS USE THE SAME INDUSTRY
    // console.log("removing industries references");
    // await deleteReferences(memberRef, references.industries);
    // // CONFIRM THAT THIS CHECKS IF OTHER MEMBERS USE THE SAME REGION
    // console.log("removing regions references");
    // await deleteReferences(memberRef, references.regions);
    // console.log("removing secureMemberData document");
    // await deleteDocument(references.secureMemberData);
    // console.log("removing member document");
    // await deleteDocument(references.memberRef);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger
          className={cn(
            "group border-b",
            member.status === StatusEnum.APPROVED
              ? "border-tan-300 hover:bg-tan-600/5 active:bg-tan-600/10"
              : member.status === StatusEnum.IN_PROGRESS
                ? "border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 active:bg-violet-500/20"
                : member.status === StatusEnum.PENDING
                  ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20"
                  : "border-red-500/30 bg-red-500/5 hover:bg-red-500/10 active:bg-red-500/20",
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-5xl items-center gap-2 px-2 py-4",
            )}
          >
            <div
              className={cn(
                `mx-auto
              flex
              w-full
              flex-col
              gap-3
              text-left`,
              )}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex w-full gap-2">
                  {member.status && (
                    <div className="flex grow items-start">
                      <Tag
                        variant={
                          member.status === StatusEnum.APPROVED
                            ? TagVariant.Success
                            : member.status === StatusEnum.IN_PROGRESS
                              ? TagVariant.NearSuccess
                              : member.status === StatusEnum.PENDING
                                ? TagVariant.Warn
                                : TagVariant.Alert
                        }
                      >
                        {convertStringSnake(member.status)}
                      </Tag>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <h3 className="text-sm text-secondary-foreground">
                    {member.title}
                  </h3>
                  {/* <h3 className="text-sm font-light text-secondary-foreground">
                  {member.id}
                </h3> */}
                </div>
                {/* <span
                className="text-xs font-light text-secondary-foreground"
                title={`${member.lastModified}`}
              >
                Last modified{" "}
                <span className={"font-semibold text-stone-700"}>
                  {moment(member.lastModified).fromNow()}
                </span>
              </span> */}
              </div>
              <div
                className={cn(
                  "grid grid-flow-col grid-cols-5 items-start gap-2 rounded bg-tan-500/10 px-4 py-2 text-xs",
                  member.status === StatusEnum.IN_PROGRESS &&
                    "bg-violet-500/10",
                )}
              >
                <section>
                  <h4 className="font-medium">Location</h4>
                  <p className="break-words font-light text-secondary-foreground">
                    {member.location}
                  </p>
                </section>
                <section>
                  <h4 className="font-medium">Region</h4>
                  <p className="break-words font-light text-secondary-foreground">
                    {member.region}
                  </p>
                </section>
                <section>
                  <h4 className="font-medium">Company Size</h4>
                  <p className="break-words font-light text-secondary-foreground">
                    {member.companySize}
                  </p>
                </section>
                <section>
                  <h4 className="font-medium">Focuses</h4>
                  <p>
                    {member.focus &&
                      member.focus.map((focus, i) => {
                        // Skip null/undefined focus objects
                        if (!focus) return null;

                        const focusNotApproved =
                          focus.status !== StatusEnum.APPROVED;
                        return (
                          <span
                            className={cn(
                              "font-light text-secondary-foreground",
                              focusNotApproved && `font-medium text-violet-600`,
                            )}
                            key={member.id + focus.id}
                          >
                            {focus.name}
                            {focusNotApproved ? ` (${focus.status})` : null}
                            {i < member.focus.length - 1 ? `, ` : null}
                          </span>
                        );
                      })}
                  </p>
                </section>
                <section>
                  <h4 className="font-medium">Industries</h4>
                  <p>
                    {member.industry &&
                      member.industry.map((industry, i) => {
                        // Skip null/undefined industry objects
                        if (!industry) return null;

                        const industryNotApproved =
                          industry.status !== StatusEnum.APPROVED;
                        return (
                          <span
                            className={cn(
                              "font-light text-secondary-foreground",
                              industryNotApproved &&
                                `font-medium text-violet-600`,
                            )}
                            key={member.id + industry.id}
                          >
                            {industry.name}
                            {industryNotApproved ? (
                              <span> ({industry.status})</span>
                            ) : null}
                            {i < member.industry.length - 1 ? `, ` : null}
                          </span>
                        );
                      })}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{member.name}</DialogTitle>
            <DialogDescription>{member.title}</DialogDescription>
          </DialogHeader>
          <MemberEdit
            member={member}
            onClose={() => setShowModal(false)}
            onDelete={handleDelete}
            regions={regions}
            experience={experience}
            user={user}
            adminView={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
