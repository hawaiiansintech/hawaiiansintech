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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deleteDocument,
  deleteReferences,
  getReferencesToDelete,
} from "@/lib/admin/directory-helpers";
import { MemberEmail, MemberSecure, RegionPublic } from "@/lib/api";
import {
  CompanySizeEnum,
  StatusEnum,
  YearsOfExperienceEnum,
} from "@/lib/enums";
import { useIsAdmin } from "@/lib/hooks";
import { getAuth, User } from "firebase/auth";
import { cn, convertStringSnake } from "helpers";
import { ExternalLink, Trash } from "lucide-react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Directory · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function DirectoryPage(props: { pageTitle }) {
  const auth = getAuth();
  const [members, setMembers] = useState<MemberSecure[]>([]);
  const [regions, setRegions] = useState<RegionPublic[]>([]);
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, isAdminLoading] = useIsAdmin(user, loading);
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/get-members")
        .then((res) => res.json())
        .then((data) => {
          setMembers(data.members);
          setRegions(data.regions.sort((a, b) => a.name.localeCompare(b.name)));
        });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) router.push(`/admin`);
  }, [isAdmin, isAdminLoading, router]);

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={props.pageTitle} />
        <title>{props.pageTitle}</title>
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
              <Directory members={members} regions={regions} user={user} />
            </div>
          )}
        </Admin.Body>
      </Admin>
    </>
  );
}

interface MemberDirectoryProps {
  members?: MemberSecure[];
  regions?: RegionPublic[];
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

const Directory: MemberDirectoryType = ({ members, regions, user }) => {
  const [tabVisible, setTabVisible] = useState<DirectoryFilter>(
    DirectoryFilter.All
  );
  const [sortOrder, setSortOrder] = useState<DirectorySortOrder>(
    DirectorySortOrder.LastModified
  );
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [membersFiltered, setMembersFiltered] = useState<MemberSecure[]>();

  useEffect(() => {
    setMembersFiltered(
      members
        .filter((m) => {
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
        })
    );
  }, [members, tabVisible]);

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
              <Directory.Card
                member={m}
                key={`member-card-${m.id}`}
                regions={regions}
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
  member: MemberSecure;
  regions?: RegionPublic[];
  user?: User;
}

Directory.Card = Card;

function Card({ member, regions, user }: CardProps) {
  const [showModal, setShowModal] = useState<ReactNode | false>(false);

  const handleDelete = async () => {
    alert("NOT ACTUALLY DELETING!!! RETURNING EARLY");
    return;
    const references = await getReferencesToDelete(member.id);
    const memberRef = references.memberRef;
    // CONFIRM THAT THIS CHECKS IF OTHER MEMBERS USE THE SAME FOCUSES
    console.log("removing focuses references");
    await deleteReferences(memberRef, references.focuses);
    // CONFIRM THAT THIS CHECKS IF OTHER MEMBERS USE THE SAME INDUSTRY
    console.log("removing industries references");
    await deleteReferences(memberRef, references.industries);
    // CONFIRM THAT THIS CHECKS IF OTHER MEMBERS USE THE SAME REGION
    console.log("removing regions references");
    await deleteReferences(memberRef, references.regions);
    console.log("removing secureMemberData document");
    await deleteDocument(references.secureMemberData);
    console.log("removing member document");
    await deleteDocument(references.memberRef);
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
              : "border-red-500/30 bg-red-500/5 hover:bg-red-500/10 active:bg-red-500/20"
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-5xl items-center gap-2 px-2 py-4"
            )}
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
                  member.status === StatusEnum.IN_PROGRESS && "bg-violet-500/10"
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
                              industryNotApproved &&
                                `font-medium text-violet-600`
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{member.name}</DialogTitle>
            <DialogDescription>{member.title}</DialogDescription>
          </DialogHeader>
          <MemberEdit
            member={member}
            onClose={() => setShowModal(false)}
            onDelete={handleDelete}
            regions={regions}
            user={user}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

const MemberEdit: FC<{
  member: MemberSecure;
  regions?: RegionPublic[];
  onClose: () => void;
  onDelete: () => void;
  user?: User;
}> = ({ member, regions, onClose, onDelete, user }) => {
  const [email, setEmail] = useState<MemberEmail>(null);
  const [loadingEmail, setLoadingEmail] = useState<boolean>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchEmailById = async () => {
    const response = await fetch(`/api/get-email-by-id?id=${member.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    const data = await response.json();
    return data.email;
  };

  const handleManageEmail = async () => {
    if (email === null) {
      setLoadingEmail(true);
      await fetchEmailById().then((email) => {
        if (!email) {
          // TODO: handle error
          // this seems to fire occasionally when the email is not found
          setLoadingEmail(false);
          return;
        }
        setEmail(email);
        setLoadingEmail(false);
      });
    } else {
      setEmail(null);
    }
  };

  const handleRegionChange = (value: string) => {
    if (value === "New") {
      console.log("create new region");
      return;
    }
    console.log(value);
  };

  const mapTabsTriggerToVariant = (
    status: StatusEnum
  ): "alert" | "success" | "nearSuccess" | "warn" => {
    switch (status) {
      case StatusEnum.APPROVED:
        return "success";
      case StatusEnum.IN_PROGRESS:
        return "nearSuccess";
      case StatusEnum.PENDING:
        return "warn";
      case StatusEnum.DECLINED:
        return "alert";
      default:
        return;
    }
  };

  return (
    <div>
      {isDeleting ? (
        <>
          <h2 className="text-2xl font-semibold">Delete Member</h2>
          <p className="text-xl font-light text-secondary-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-stone-700">{member.name}</span>{" "}
            and all data associated with them?
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
              }}
            >
              Remove Permanently
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleting(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Tabs
            defaultValue={member.status}
            onValueChange={(value) => {
              // setTabVisible(value as DirectoryFilter);
            }}
            // value={tabVisible}
            className="col-span-2"
          >
            <TabsList loop className="w-full">
              {Object.values(StatusEnum)
                .filter((status) => status !== StatusEnum.DECLINED)
                .map((status, i) => (
                  <TabsTrigger
                    value={status}
                    key={`directory-status-${i}`}
                    variant={mapTabsTriggerToVariant(status)}
                    // size="sm"
                  >
                    {convertStringSnake(status)}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
          <div className="col-span-2 flex flex-col items-start gap-1">
            <h2 className="text-sm font-semibold">Name</h2>
            <Input name={"usernamef"} value={member.name} />
          </div>
          <div className="col-span-2 flex flex-col items-start gap-1">
            <h2 className="text-sm font-semibold">Title</h2>
            <Input name={"title"} value={member.title} />
          </div>
          <div className="col-span-2 flex flex-col items-start gap-1">
            <div className="flex w-full items-center">
              <h2 className="grow text-sm font-semibold">Website</h2>
              <Link
                href={member.link}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <ExternalLink className="h-4 w-4 text-primary" />
              </Link>
            </div>
            <Input name={"link"} value={member.link} />
          </div>
          <div className="relative col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="grow text-sm font-semibold">Email</h2>
              {loadingEmail && (
                <LoadingSpinner
                  variant={LoadingSpinnerVariant.Invert}
                  className="h-4 w-4 border-2"
                />
              )}
              {!email && (
                <button
                  className="text-xs font-medium text-primary"
                  onClick={handleManageEmail}
                >
                  Update
                </button>
              )}
            </div>
            <div className="relative flex flex-col gap-2">
              <Input
                name="email"
                disabled={email === null}
                value={email?.email || member.emailAbbr}
              />
              {email ? (
                <>
                  <section className="flex items-start gap-2">
                    <Checkbox
                      id="subscribed"
                      checked={!member.unsubscribed}
                      defaultChecked
                    />
                    <div className="text-xs leading-relaxed">
                      <label
                        htmlFor="subscribed"
                        className="font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Subscribed
                      </label>
                      <p className="leading-relaxed text-secondary-foreground">
                        Members opt out of emails during sign-up and/or using
                        unsubscribe links.
                      </p>
                    </div>
                  </section>
                  <section className="flex items-start gap-2">
                    <Checkbox id="verified" />
                    <div className="text-xs leading-relaxed">
                      <label
                        htmlFor="verified"
                        className="font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Verified
                      </label>
                      <p className="leading-relaxed text-secondary-foreground">
                        Members verify their email address by replying or
                        authenticating.
                      </p>
                    </div>
                  </section>
                </>
              ) : (
                <div className="absolute right-0 top-1/2 flex grow -translate-y-1/2 gap-0.5 pr-2 opacity-80">
                  <Badge variant="secondary">Verified</Badge>
                  {member.unsubscribed ? (
                    <Badge variant="destructive">Unsubscribed</Badge>
                  ) : (
                    <Badge variant="secondary">Subscribed</Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* <div className="flex items-start gap-x-2">
            <Checkbox id="verified" checked={true} />
            <div className="flex gap-1 leading-none">
              <label
                htmlFor="verified"
                className="flex flex-col text-xs font-semibold leading-none text-secondary-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Verified
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-secondary-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Confirmed ownership of email (through reply or
                      authentication)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-start gap-x-2">
            <Checkbox id="subscribed" checked={member.unsubscribed} />
            <div className="flex gap-1 leading-none">
              <label
                htmlFor="subscribed"
                className="flex flex-col text-xs font-semibold leading-none text-secondary-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unsubscribed
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-secondary-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Opted-out during sign-up or requested directly</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div> */}

          <div className="flex flex-col items-start gap-1">
            <h2 className="text-sm font-semibold">Location</h2>
            <Input name={"location"} value={member.location} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex w-full items-center">
              <h2 className="grow text-sm font-semibold">Region</h2>
              <Popover>
                <PopoverTrigger>
                  <h2 className="text-xs font-medium text-primary">Add</h2>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="end"
                  className="flex flex-col gap-1"
                >
                  <Input placeholder="Region" autoFocus />
                  {/* HERE */}
                  <Button size="sm">Add Region</Button>
                </PopoverContent>
              </Popover>
            </div>
            <Select
              defaultValue={member.region}
              onValueChange={handleRegionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {regions?.map((region) => (
                  <SelectItem value={region.name} key={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-sm font-semibold">Years of Experience</h2>
            <Select
              defaultValue={member.yearsExperience}
              onValueChange={handleRegionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {Object.values(YearsOfExperienceEnum).map((year, i) => (
                  <SelectItem value={year} key={`years-exerience-${year}`}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-sm font-semibold">Company Size</h2>
            <Select
              defaultValue={member.companySize}
              onValueChange={handleRegionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {Object.values(CompanySizeEnum).map((size, i) => (
                  <SelectItem value={size} key={`company-size-${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <h4 className="text-sm font-semibold">Focuses</h4>
            <div className="flex flex-wrap gap-1">
              {member.focus &&
                member.focus.map((focus, i) => {
                  const focusNotApproved = focus.status !== StatusEnum.APPROVED;
                  return (
                    <span
                      className={cn(
                        "inline-block rounded-xl border px-3 py-0.5 text-sm tracking-wide text-secondary-foreground",
                        focusNotApproved &&
                          `bg-violet-600/20 font-medium text-violet-600`
                      )}
                      key={member.id + focus.id}
                    >
                      {focus.name}
                      {focusNotApproved ? ` (${focus.status})` : null}
                    </span>
                  );
                })}
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="text-sm font-semibold">Industries</h4>
            <div className="flex flex-wrap gap-1">
              {member.industry &&
                member.industry.map((industry, i) => {
                  const industryNotApproved =
                    industry.status !== StatusEnum.APPROVED;
                  return (
                    <span
                      className={cn(
                        "inline-block rounded-xl border px-3 py-0.5 text-sm tracking-wide text-secondary-foreground",
                        industryNotApproved &&
                          `bg-violet-600/20 font-medium text-violet-600`
                      )}
                      key={member.id + industry.id}
                    >
                      {industry.name}
                      {industryNotApproved ? (
                        <span> ({industry.status})</span>
                      ) : null}
                    </span>
                  );
                })}
            </div>
          </div>

          <section>
            <h4 className="text-sm font-semibold">ID</h4>
            <p className="font-light text-secondary-foreground">{member.id}</p>
          </section>
          <section>
            <h4 className="text-sm font-semibold">Last Modified</h4>
            <p className="font-light text-secondary-foreground">
              {member.lastModified}
            </p>
          </section>
          <div className="col-span-2 mt-2 flex flex-col gap-2 sm:flex-row">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsDeleting(true);
                    }}
                    size="sm"
                    disabled
                  >
                    <span className="flex items-center gap-2">
                      <Trash className="h-4 w-4" />
                      Archive
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disabled · Read-only</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex grow justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button disabled onClick={onClose} size="sm">
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Disabled · Read-only</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
