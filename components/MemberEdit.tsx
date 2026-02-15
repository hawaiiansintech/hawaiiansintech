import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import AdminFilter from "@/components/admin/FilterEditor";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import {
  FirestoreDocumentData,
  MemberEmail,
  MemberPublic,
} from "@/lib/firebase-helpers/interfaces";
import { CompanySizeEnum, FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import { User } from "firebase/auth";
import { convertStringSnake, scrollToTop, cloakEmail } from "helpers";
import { Check, ExternalLink, EyeOff, Info, Trash } from "lucide-react";
import Link from "next/link";
import { ADMIN_EMAILS } from "@/lib/email/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";

export const MemberEdit: FC<{
  member: MemberPublic;
  regions?: FirestoreDocumentData[];
  experience?: FirestoreDocumentData[];
  onClose?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  user?: User;
  adminView?: boolean;
}> = ({ member, regions, experience, onDelete, onSave, user, adminView }) => {
  const router = useRouter();
  const { query } = router;
  const [email, setEmail] = useState<MemberEmail>(null);
  const [loadingEmail, setLoadingEmail] = useState<boolean>(null);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [originalEmail, setOriginalEmail] = useState<string>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [name, setName] = useState<string>(member.name);
  const [title, setTitle] = useState<string>(member.title);
  const [link, setLink] = useState<string>(member.link);
  const [location, setLocation] = useState<string>(member.location);
  const [companySize, setCompanySize] = useState<string>(member.companySize);
  const [status, setStatus] = useState<StatusEnum>(member.status);
  const [unsubscribed, setUnsubscribed] = useState<boolean>(
    member.unsubscribed,
  );
  const [focuses, setFocuses] = useState<
    { name: string; id: string }[] | string[]
  >(member.focus);
  const [suggestedFocus, setSuggestedFocus] = useState<string>(undefined);
  const [industries, setIndustries] = useState<
    { name: string; id: string }[] | string[]
  >(member.industry);
  const [suggestedIndustry, setSuggestedIndustry] = useState<string>(undefined);
  const [error, setError] = useState<ErrorMessageProps>(undefined);

  const getIdFromName = (
    collection: FirestoreDocumentData[],
    name: string,
  ): string => {
    const item = collection.find((r) => r.fields.name === name);
    return item ? item.id : null;
  };

  const initialRegion = getIdFromName(regions, member.region);
  const [region, setRegion] = useState<string>(initialRegion);
  const initialYearsExperience = getIdFromName(
    experience,
    member.yearsExperience,
  );
  const [yearsExperience, setYearsExperience] = useState<string>(
    initialYearsExperience,
  );

  useEffect(() => {
    let timeout;
    if (query.updated === "success") {
      setShowSuccess(() => {
        timeout = setTimeout(() => {
          setShowSuccess(false);
        }, 10000);
        return true;
      });
    }
    if (error) scrollToTop();
    return () => {
      clearTimeout(timeout);
    };
  }, [query.updated, error]);

  const fetchEmailById = async () => {
    const response = await fetch(`/api/emails?id=${member.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    const data = await response.json();
    return data.email;
  };

  const handleRevealEmail = async () => {
    if (email === null) {
      setLoadingEmail(true);
      await fetchEmailById().then((email) => {
        if (!email) {
          // TODO: handle error
          // this seems to fire occasionally when the email is not found
          setLoadingEmail(false);
          return;
        }
        setOriginalEmail(email.email);
        setEmail(email);
        setLoadingEmail(false);
      });
    } else {
      setEmail(null);
    }
  };

  const updateMember = async (memberNew: MemberPublic) => {
    const response = await fetch("/api/members", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        memberOld: member,
        memberNew: memberNew,
        currentUser: user.displayName || user.uid,
      }),
    });
    if (!response.ok) {
      return response.json().then((err) => {
        setError({
          headline: "Error updating member data",
          body: err.message,
        });
        return response;
      });
    }
    console.log(`✅ updated ${member.name}`);
    return response;
  };

  const updateSecureEmail = async (uid: string, email: string) => {
    const response = await fetch("/api/emails", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        uid: uid,
        email: email,
        currentUser: user.displayName || user.uid,
      }),
    });
    if (response.status !== 200) {
      return response.json().then((err) => {
        setError({
          headline: `Error updating member email for ${uid}`,
          body: err.message,
        });
      });
    }
    console.log(`✅ updated email for ${uid}`);
    return response;
  };

  const saveChanges = async () => {
    setError(undefined);
    setSaveInProgress(true);

    const emailChanged: boolean = email?.email && email.email !== originalEmail;
    const updatedMember: MemberPublic = {
      ...member,
      companySize: companySize,
      emailAbbr: emailChanged ? cloakEmail(email.email) : member.emailAbbr,
      focus: focuses,
      focusSuggested: suggestedFocus,
      industry: industries,
      industrySuggested: suggestedIndustry,
      link: link,
      location: location,
      name: name,
      region: region,
      status: status,
      title: title,
      unsubscribed: unsubscribed,
      yearsExperience: yearsExperience,
    };

    const updateResult = await updateMember(updatedMember);
    if (!updateResult.ok) {
      setSaveInProgress(false);
      return;
    }
    if (emailChanged) {
      await updateSecureEmail(member.id, email.email);
    }
    if (onSave) {
      onSave();
    }

    if (!adminView) {
      // Update the URL without navigation to avoid the "same URL" error
      router.replace(
        {
          pathname: router.pathname,
          query: { memberId: member.id, updated: "success" },
        },
        undefined,
        { shallow: true },
      );
    }
    setSaveInProgress(false);
    setShowSuccess(true);
  };

  const mapTabsTriggerToVariant = (
    status: StatusEnum,
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
        return "warn";
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
          {adminView && (
            <Tabs
              defaultValue={member.status}
              onValueChange={(value) => {
                setStatus(value as StatusEnum);
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
          )}
          <div className="col-span-2 flex flex-col items-start gap-1">
            {showSuccess && (
              <Alert variant="success">
                <Check />
                <AlertTitle>Successfully updated profile</AlertTitle>
                <AlertDescription>
                  Your changes will be reflected on the website shortly.
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <div className="mt-2 w-full">
                <ErrorMessage headline={error.headline} body={error.body} />
              </div>
            )}
            <h2
              className={`text-sm font-semibold ${
                name !== member.name && "text-brown-600"
              }`}
            >
              Name
            </h2>
            <Input
              name={"usernamef"}
              value={name}
              className={name !== member.name && "text-brown-600"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="col-span-2 flex flex-col items-start gap-1">
            <h2
              className={`text-sm font-semibold ${
                title !== member.title && "text-brown-600"
              }`}
            >
              Title
            </h2>
            <Input
              name={"title"}
              value={title}
              className={title !== member.title && "text-brown-600"}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="col-span-2 flex flex-col items-start gap-1">
            <div className="flex w-full items-center">
              <h2
                className={`grow text-sm font-semibold ${
                  link !== member.link && "text-brown-600"
                }`}
              >
                Website / Link
              </h2>
              <Link href={link} target="_blank" referrerPolicy="no-referrer">
                <ExternalLink className="h-4 w-4 text-primary" />
              </Link>
            </div>
            <Input
              name={"link"}
              value={link}
              className={link !== member.link && "text-brown-600"}
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </div>
          <div className="relative col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="grow text-sm font-semibold">Email</h2>
              {!adminView && (
                <Popover>
                  <PopoverTrigger>
                    <Info className="h-4 w-4 text-secondary-foreground" />
                  </PopoverTrigger>
                  <PopoverContent side="left">
                    <p className="text-xs">
                      If you need to update your email, please reach out to{" "}
                      {ADMIN_EMAILS.map((email, i) => (
                        <span key={`${email}-${i}`}>
                          <Link href={`mailto:${email}`} target="_blank">
                            {email}
                          </Link>
                          {i < ADMIN_EMAILS.length - 1 && " or "}
                        </span>
                      ))}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="relative">
              <Input
                name="email"
                className={
                  email && email.email !== originalEmail && "text-brown-600"
                }
                disabled={email === null || !adminView}
                value={email?.email || member.emailAbbr}
                onChange={(e) => {
                  const newEmail = { ...email };
                  newEmail.email = e.target.value;
                  setEmail(newEmail);
                }}
              />
              <div className="absolute right-4 top-0 flex h-full items-center">
                {loadingEmail ? (
                  <LoadingSpinner
                    variant={LoadingSpinnerVariant.Invert}
                    className="h-4 w-4 border-2"
                  />
                ) : !email ? (
                  <button onClick={handleRevealEmail}>
                    <EyeOff className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
            <section className="flex items-start gap-2 text-xs leading-relaxed">
              <Checkbox
                id="subscribed"
                checked={!unsubscribed}
                onCheckedChange={(e) => {
                  setUnsubscribed(!e);
                }}
                defaultChecked
              />

              <label
                htmlFor="subscribed"
                className="font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Subscribe to newsletter updates
              </label>
            </section>
          </div>

          <div className="flex flex-col items-start gap-1">
            <h2
              className={`text-sm font-semibold ${
                location !== member.location && "text-brown-600"
              }`}
            >
              Location
            </h2>
            <Input
              name={"location"}
              value={location}
              className={location !== member.location && "text-brown-600"}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex w-full items-center">
              <h2
                className={`grow text-sm font-semibold ${
                  region !== initialRegion && "text-brown-600"
                }`}
              >
                Region
              </h2>
              {/* TODO: Implement add region */}
              {/* <Popover>
                <PopoverTrigger>
                  <h2 className="text-xs font-medium text-primary">Add</h2>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="end"
                  className="flex flex-col gap-1"
                >
                  <Input placeholder="Region" autoFocus />
                  <Button size="sm">Add Region</Button>
                </PopoverContent>
              </Popover> */}
            </div>
            <Select
              defaultValue={initialRegion}
              onValueChange={(e) => {
                setRegion(e);
              }}
            >
              <SelectTrigger
                className={region !== initialRegion && "text-brown-600"}
              >
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {[...regions]
                  .sort((a, b) =>
                    (a.fields.name as string).localeCompare(
                      b.fields.name as string,
                    ),
                  )
                  .map((region) => (
                    <SelectItem
                      value={region.id}
                      key={`region-${region.fields.name}`}
                    >
                      {region.fields.name as string}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2
              className={`text-sm font-semibold ${
                yearsExperience !== initialYearsExperience && "text-brown-600"
              }`}
            >
              Years of Experience
            </h2>
            <Select
              defaultValue={initialYearsExperience}
              onValueChange={(e) => {
                setYearsExperience(e);
              }}
            >
              <SelectTrigger
                className={
                  yearsExperience !== initialYearsExperience && "text-brown-600"
                }
              >
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {[...experience].map((exp) => (
                  <SelectItem
                    value={exp.id}
                    key={`experience-${exp.fields.name}`}
                  >
                    {exp.fields.name as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2
              className={`text-sm font-semibold ${
                companySize !== member.companySize && "text-brown-600"
              }`}
            >
              Company Size
            </h2>
            <Select
              defaultValue={member.companySize}
              onValueChange={(e) => {
                setCompanySize(e);
              }}
            >
              <SelectTrigger
                className={
                  companySize !== member.companySize && "text-brown-600"
                }
              >
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {Object.values(CompanySizeEnum).map((size) => (
                  <SelectItem value={size} key={`company-size-${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AdminFilter
            labels={{ singular: "Focus", plural: "Focuses" }}
            filterTable={FirebaseTablesEnum.FOCUSES}
            memberId={member.id}
            filters={focuses as { name: string; id: string; status: string }[]}
            setFilters={setFocuses}
            suggestedFilter={suggestedFocus}
            setSuggestedFilter={setSuggestedFocus}
          />
          <AdminFilter
            labels={{ singular: "Industry", plural: "Industries" }}
            filterTable={FirebaseTablesEnum.INDUSTRIES}
            memberId={member.id}
            filters={
              industries as { name: string; id: string; status: string }[]
            }
            setFilters={setIndustries}
            suggestedFilter={suggestedIndustry}
            setSuggestedFilter={setSuggestedIndustry}
          />

          {adminView && (
            <section>
              <h4 className="text-sm font-semibold">ID</h4>
              <p className="font-light text-secondary-foreground">
                {member.id}
              </p>
            </section>
          )}
          {member.lastModified && adminView && (
            <section>
              <h4 className="text-sm font-semibold">Last Modified</h4>
              <p className="font-light text-secondary-foreground">
                {typeof member.lastModified === "string"
                  ? new Date(member.lastModified).toLocaleDateString()
                  : member.lastModified.toDate().toLocaleDateString()}
              </p>
            </section>
          )}
          <div className="col-span-2 mt-2 flex flex-col gap-2 sm:flex-row">
            {adminView && (
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
            )}
            <div className="flex grow justify-end">
              <Button
                className="w-full"
                onClick={saveChanges}
                size="sm"
                loading={saveInProgress}
                disabled={saveInProgress}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
