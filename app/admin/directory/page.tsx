"use client";
import Button, { ButtonVariant } from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import Modal from "@/components/Modal";
import Tag, { TagVariant } from "@/components/Tag";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteDocument,
  deleteReferences,
  getReferencesToDelete,
} from "@/lib/admin/directory-helpers";
import {
  DocumentData,
  getFirebaseTable,
  getMembers,
  MemberPublic,
} from "@/lib/api";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import { cn, convertStringSnake } from "helpers";
import { Trash } from "lucide-react";
import moment from "moment";
import { FC, ReactNode, useState } from "react";

export async function fetchMembers(): Promise<MemberPublic[]> {
  const focusesData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.FOCUSES
  );
  const industriesData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.INDUSTRIES
  );
  const regionsData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.REGIONS
  );
  const members: MemberPublic[] = await getMembers(
    focusesData,
    industriesData,
    regionsData,
    [StatusEnum.APPROVED, StatusEnum.IN_PROGRESS, StatusEnum.PENDING]
  );
  console.log("FORE SOME REASON THIS IS RUNNING AGAIN AND AGAIN");
  return members;
}

enum DirectorySortOrder {
  Alphabetical = "Alphabetical",
  LastModified = "Last Modified",
}

enum DirectoryFilter {
  All = "All",
  InProgress = "In Progress",
  Pending = "Pending",
}

export default async function Page() {
  const [tabVisible, setTabVisible] = useState<DirectoryFilter>(
    DirectoryFilter.All
  );
  const [sortOrder, setSortOrder] = useState<DirectorySortOrder>(
    DirectorySortOrder.LastModified
  );
  const [error, setError] = useState<ErrorMessageProps>(null);

  const members = await fetchMembers();

  let membersFiltered = members
    .filter((m) => {
      if (tabVisible === "All") return true;
      if (tabVisible === "Pending" && m.status === StatusEnum.PENDING)
        return true;
      if (tabVisible === "In Progress" && m.status === StatusEnum.IN_PROGRESS)
        return true;
    })
    .sort((a, b) => {
      if (sortOrder === DirectorySortOrder.LastModified) {
        if (moment(a.lastModified) > moment(b.lastModified)) return -1;
        if (moment(a.lastModified) < moment(b.lastModified)) return 1;
        return 0;
      }
      return 0;
    });

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
        {membersFiltered && membersFiltered.length > 0 ? (
          <>
            {membersFiltered.map((m) => (
              <DirectoryCard
                member={m}
                isHidden={false}
                setIsHidden={() => {}}
                key={`member-card-${m.id}`}
              />
            ))}
          </>
        ) : (
          <>no members</>
        )}
      </div>
    </>
  );
}

interface CardProps {
  member: MemberPublic;
  isHidden: boolean;
  setIsHidden: (id: string) => void;
}

function DirectoryCard({ member, isHidden, setIsHidden }: CardProps) {
  const [showModal, setShowModal] = useState<ReactNode | false>(false);

  const handleDelete = async () => {
    alert("NOT ACTUALLY DELETING!!! RETURNING EARLY");
    return;
    const references = await getReferencesToDelete(member.id);
    const memberRef = references.memberRef;
    console.log("removing focuses references");
    await deleteReferences(memberRef, references.focuses);
    console.log("removing industries references");
    await deleteReferences(memberRef, references.industries);
    console.log("removing regions references");
    await deleteReferences(memberRef, references.regions);
    console.log("removing secureMemberData document");
    await deleteDocument(references.secureMemberData);
    console.log("removing member document");
    await deleteDocument(references.memberRef);
    setIsHidden(member.id);
  };

  return isHidden ? null : (
    <>
      {showModal && <Modal>{showModal}</Modal>}
      <button
        key={`member-${member.id}`}
        className={cn(
          `
            group
            border-b
          `,
          member.status === StatusEnum.APPROVED
            ? "border-tan-300 hover:bg-tan-600/5 active:bg-tan-600/10"
            : member.status === StatusEnum.IN_PROGRESS
            ? "border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 active:bg-violet-500/20"
            : member.status === StatusEnum.PENDING
            ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20"
            : "border-red-500/30 bg-red-500/5 hover:bg-red-500/10 active:bg-red-500/20"
        )}
        onClick={() => {
          setShowModal(
            <MemberProfileModal
              member={member}
              onClose={() => setShowModal(false)}
              onDelete={handleDelete}
            />
          );
        }}
        title={member.id}
      >
        <div
          className={cn(`
            mx-auto
            flex
            w-full
            max-w-5xl
            items-center
            gap-2
            px-2
            py-4
          `)}
        >
          <div
            className={cn(
              `mx-auto
              flex
              w-full
              flex-col
              gap-3
              text-left`
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
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <h3 className="text-sm font-light text-secondary-foreground">
                  {member.id}
                </h3>
              </div>
              <span
                className="text-xs font-light text-secondary-foreground"
                title={`${member.lastModified}`}
              >
                Last modified{" "}
                <span className={"font-semibold text-stone-700"}>
                  {moment(member.lastModified).fromNow()}
                </span>
              </span>
            </div>
            <div
              className={cn(
                "grid grid-flow-col grid-cols-6 items-start gap-2 rounded bg-tan-500/10 px-4 py-2 text-xs",
                member.status === StatusEnum.IN_PROGRESS && "bg-violet-500/10"
              )}
            >
              <section>
                <h4 className="font-medium">Title</h4>
                <p className="break-words font-light text-secondary-foreground">
                  {member.title}
                </p>
              </section>
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
                      const focusNotApproved =
                        focus.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "font-light text-secondary-foreground",
                            focusNotApproved && `font-medium text-violet-600`
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
                      const industryNotApproved =
                        industry.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "font-light text-secondary-foreground",
                            industryNotApproved && `font-medium text-violet-600`
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
      </button>
    </>
  );
}

const MemberProfileModal: FC<{
  member: MemberPublic;
  onClose: () => void;
  onDelete: () => void;
}> = ({ member, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="fixed inset-x-0 inset-y-0 z-50 flex items-center justify-center bg-white/50">
      <div className="pointer-events-auto flex max-w-5xl flex-col gap-4 rounded-t-xl bg-white p-4 text-center shadow-lg sm:m-4 sm:rounded-b-xl">
        {isDeleting ? (
          <>
            <h2 className="text-2xl font-semibold">Delete Member</h2>
            <p className="text-xl font-light text-secondary-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-stone-700">
                {member.name}
              </span>{" "}
              and all data associated with them?
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant={ButtonVariant.Destructive}
                onClick={() => {
                  onDelete();
                }}
              >
                Remove Permanently
              </Button>
              <Button
                variant={ButtonVariant.Secondary}
                onClick={() => {
                  setIsDeleting(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 pt-4">
              <h2 className="text-sm font-semibold">Name:</h2>
              <Input name={"usernamef"} value={member.name} />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <h2 className="text-sm font-semibold">Title:</h2>
              <Input name={"title"} value={member.title} />
            </div>
            <Tabs />
            <div
              className={cn(
                `grid
                max-h-96
                gap-x-2
                gap-y-4
                overflow-y-auto
                rounded
                border
                border-tan-400/40
                p-4
                text-xs
                sm:grid-cols-5
                md:max-h-none
                md:bg-none`
              )}
            >
              <section>
                <h4 className="text-base font-semibold">ID</h4>
                <p className="text-base font-light text-secondary-foreground">
                  {member.id}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold">Name</h4>
                <p className="text-base font-light text-secondary-foreground">
                  {member.name}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold">Title</h4>
                <p className="text-base font-light text-secondary-foreground">
                  {member.title}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold">Status</h4>
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
              </section>
              <section>
                <h4 className="text-base font-semibold">Last Modified</h4>
                <p className="text-base font-light text-secondary-foreground">
                  {member.lastModified}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold">Location</h4>
                <p className="text-base font-light text-secondary-foreground">
                  {member.location}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold">Region</h4>
                <p className="text-base font-light text-secondary-foreground">
                  {member.region}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold">Company Size</h4>
                <p className="text-base font-light text-secondary-foreground">
                  {member.companySize}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold">Focuses</h4>
                <p>
                  {member.focus &&
                    member.focus.map((focus, i) => {
                      const focusNotApproved =
                        focus.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "text-base font-light text-secondary-foreground",
                            focusNotApproved && `font-medium text-violet-600`
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
                <h4 className="text-base font-semibold">Industries</h4>
                <p>
                  {member.industry &&
                    member.industry.map((industry, i) => {
                      const industryNotApproved =
                        industry.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "text-base font-light text-secondary-foreground",
                            industryNotApproved && `font-medium text-violet-600`
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
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                disabled
                variant={ButtonVariant.Primary}
                onClick={onClose}
              >
                Save
              </Button>
              <Button
                variant={ButtonVariant.Destructive}
                onClick={() => {
                  setIsDeleting(true);
                }}
              >
                <Trash />
              </Button>
              <div className="flex grow justify-end">
                <Button variant={ButtonVariant.Secondary} onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
