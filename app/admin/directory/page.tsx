"use client";
import Button, { ButtonVariant } from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import Tag, { TagVariant } from "@/components/Tag";
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
              items={Object.values(DirectoryFilter).map((filter) => ({
                label: filter,
                onClick: () => {
                  if (tabVisible === filter) return;
                  setTabVisible(filter);
                },
                selected: tabVisible === filter,
              }))}
            />
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
            w-full
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
                <h3 className="text-sm font-light text-stone-500 group-hover:text-stone-600">
                  {member.id}
                </h3>
              </div>
              <span
                className="text-xs font-light text-stone-500"
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
                <h4 className="font-medium text-stone-600">Title</h4>
                <p className="break-words font-light text-stone-500">
                  {member.title}
                </p>
              </section>
              <section>
                <h4 className="font-medium text-stone-600">Location</h4>
                <p className="break-words font-light text-stone-500">
                  {member.location}
                </p>
              </section>
              <section>
                <h4 className="font-medium text-stone-600">Region</h4>
                <p className="break-words font-light text-stone-500">
                  {member.region}
                </p>
              </section>
              <section>
                <h4 className="font-medium text-stone-600">Company Size</h4>
                <p className="break-words font-light text-stone-500">
                  {member.companySize}
                </p>
              </section>
              <section>
                <h4 className="font-medium text-stone-600">Focuses</h4>
                <p>
                  {member.focus &&
                    member.focus.map((focus, i) => {
                      const focusNotApproved =
                        focus.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "font-light text-stone-500",
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
                <h4 className="font-medium text-stone-600">Industries</h4>
                <p>
                  {member.industry &&
                    member.industry.map((industry, i) => {
                      const industryNotApproved =
                        industry.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "font-light text-stone-500",
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
    <div className="pointer-events-none fixed inset-x-0 inset-y-0 z-50">
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col gap-4 rounded-t-xl bg-white p-4 text-center shadow-lg sm:m-4 sm:rounded-b-xl">
        {isDeleting ? (
          <>
            <h2 className="text-2xl font-semibold">Delete Member</h2>
            <p className="text-xl font-light text-stone-500">
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
            <div className="px-4 pt-4 text-center">
              <h2 className="text-2xl font-semibold">{member.name}</h2>
            </div>
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
                <h4 className="text-base font-semibold text-stone-600">ID</h4>
                <p className="text-base font-light text-stone-500">
                  {member.id}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold text-stone-600">Name</h4>
                <p className="text-base font-light text-stone-500">
                  {member.name}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold text-stone-600">
                  Title
                </h4>
                <p className="text-base font-light text-stone-500">
                  {member.title}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold text-stone-600">
                  Status
                </h4>
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
                <h4 className="text-base font-semibold text-stone-600">
                  Last Modified
                </h4>
                <p className="text-base font-light text-stone-500">
                  {member.lastModified}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold text-stone-600">
                  Location
                </h4>
                <p className="text-base font-light text-stone-500">
                  {member.location}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold text-stone-600">
                  Region
                </h4>
                <p className="text-base font-light text-stone-500">
                  {member.region}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold text-stone-600">
                  Company Size
                </h4>
                <p className="text-base font-light text-stone-500">
                  {member.companySize}
                </p>
              </section>
              <section>
                <h4 className="text-base font-semibold text-stone-600">
                  Focuses
                </h4>
                <p>
                  {member.focus &&
                    member.focus.map((focus, i) => {
                      const focusNotApproved =
                        focus.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "text-base font-light text-stone-500",
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
                <h4 className="text-base font-semibold text-stone-600">
                  Industries
                </h4>
                <p>
                  {member.industry &&
                    member.industry.map((industry, i) => {
                      const industryNotApproved =
                        industry.status !== StatusEnum.APPROVED;
                      return (
                        <span
                          className={cn(
                            "text-base font-light text-stone-500",
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
            <div className="flex flex-col justify-between gap-2 sm:flex-row">
              <Button variant={ButtonVariant.Primary} onClick={onClose}>
                Modify
              </Button>
              <Button
                variant={ButtonVariant.Destructive}
                onClick={() => {
                  setIsDeleting(true);
                }}
              >
                Remove
              </Button>
              <Button variant={ButtonVariant.Secondary} onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
