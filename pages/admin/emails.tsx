import Admin from "@/components/admin/Admin";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import Tag, { TagVariant } from "@/components/Tag";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberEmail } from "@/lib/firebase-helpers/interfaces";
import { StatusEnum } from "@/lib/enums";
import { useIsAdmin } from "@/lib/hooks";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { convertStringSnake } from "helpers";
import { cn } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";
import { ADMIN_EMAILS } from "@/lib/email/utils";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Admin Panel · Hawaiians in Technology",
    },
  };
}

export default function EmailsPage(props: { pageTitle }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, isAdminLoading] = useIsAdmin(user, loading);
  const router = useRouter();
  const [emails, setEmails] = useState<MemberEmail[]>([]);

  const fetchEmails = async () => {
    const response = await fetch("/api/emails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    const data = await response.json();
    if (data) {
      setEmails(data.emails);
    }
  };

  const fetchUnsubKey = async (uid: string) => {
    const unsubLink = await fetch(`/api/unsubscribe?uid=${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.unsubKey;
      })
      .catch((error) => {
        console.log("error: ", error.message);
      });
    return unsubLink;
  };

  const sendNewsletter = async (email: string, unsubscribeUrl: string) => {
    fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({
        email: email,
        unsubscribeUrl: unsubscribeUrl,
      }),
    });
  };

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) router.push(`/admin`);
  }, [isAdmin, isAdminLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchEmails();
    }
  }, [isAdmin]);

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
              {emails ? (
                <EmailList
                  emails={emails}
                  fetchUnsubKey={fetchUnsubKey}
                  sendNewsletter={sendNewsletter}
                />
              ) : (
                <strong>Authorized, but emails did not load.</strong>
              )}
            </div>
          )}
        </Admin.Body>
      </Admin>
    </>
  );
}

enum EmailDirectoryFilter {
  Newsletter = "Newsletter",
  All = "All",
}

const EmailList: FC<{
  emails: MemberEmail[];
  fetchUnsubKey: (uid: string) => Promise<void>;
  sendNewsletter: (email: string, unsubscribeUrl: string) => Promise<void>;
}> = ({ emails, fetchUnsubKey, sendNewsletter }) => {
  const baseUrl = window.location.origin;
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [showCopiedNotification, setShowCopiedNotification] =
    useState<boolean>(false);
  const [tabVisible, setTabVisible] = useState<EmailDirectoryFilter>(
    EmailDirectoryFilter.Newsletter,
  );
  const [emailsShown, setEmailsShown] = useState<MemberEmail[]>(emails);
  const [revealEmail, setRevealEmail] = useState<boolean>(false);
  const [includeName, setIncludeName] = useState<boolean>(true);
  const [selectedEmails, setSelectedEmails] = useState<MemberEmail[]>([]);
  const [showUnsubLink, setShowUnsubLink] = useState<boolean>(false);

  useEffect(() => {
    setEmailsShown(
      emails
        .filter((email) => {
          if (email?.name === undefined || email?.email === undefined)
            return false;
          switch (tabVisible) {
            case EmailDirectoryFilter.All:
              return true;
            case EmailDirectoryFilter.Newsletter:
              return !email?.unsubscribed;
            default:
              return false;
          }
        })
        .sort((a, b) => {
          if (a?.unsubscribed && !b?.unsubscribed) return -1;
          if (!a?.unsubscribed && b?.unsubscribed) return 1;
          if (selectedEmails.includes(a) && !selectedEmails.includes(b))
            return -1;
          if (!selectedEmails.includes(a) && selectedEmails.includes(b))
            return 1;

          return 0;
        }),
    );
  }, [emails, tabVisible, selectedEmails]);

  const handleEmailSelection = (em: MemberEmail) => {
    if (selectedEmails.find((selectedEm) => em?.id === selectedEm?.id)) {
      setSelectedEmails(
        selectedEmails.filter((selectedEm) => em?.id !== selectedEm?.id),
      );
    } else {
      const nameSanitized = em?.name.replace(/[,()]/g, "");
      setSelectedEmails([
        ...selectedEmails,
        {
          id: em?.id,
          name: nameSanitized,
          email: em?.email,
          emailAbbr: em?.emailAbbr,
          status: em?.status,
          unsubscribed: em?.unsubscribed,
          unsubKey: em?.unsubKey,
        },
      ]);
    }
  };

  /**
   * Checks if the emails in the list have any issues.
   *
   * @param {MemberEmail[]} emailList - The list of emails to check.
   * @returns {boolean} - Returns true if any email in the list has an issue, false otherwise.
   */
  const emailsHaveIssues = (emailList: MemberEmail[]): boolean => {
    emailList.map((email) => {
      if (email?.unsubscribed) {
        setError({
          headline: "Error",
          body: `Cannot send email to unsubscribed member: ${email.email}`,
        });
        return true;
      }
      if (!email?.unsubKey) {
        setError({
          headline: "Error",
          body: `Cannot send email to member without unsubscribe key: ${email.email}`,
        });
        return true;
      }
      if (!email?.email) {
        setError({
          headline: "Error",
          body: `Cannot send email to member without email: ${email.email}`,
        });
      }
      return true;
    });
    return false;
  };

  const handleSendEmails = async (emailList: MemberEmail[]) => {
    const confirmSend = window.confirm(
      `Are you sure you want to deselect all ${emailList.length} members?`,
    );
    if (confirmSend) {
      if (emailList.length === 0) {
        console.error("No emails to send to");
        setError({
          headline: "Error",
          body: "No emails to send to",
        });
        return;
      }
      if (emailsHaveIssues(emailList)) {
        return;
      }
      await Promise.all(
        emailList.map(async (email) => {
          try {
            const unsubLink = `${baseUrl}/edit/unsubscribe?uid=${email?.id}&unsubKey=${email?.unsubKey}`;
            console.log(
              `sending email to ${email.email} with unsublink ${unsubLink}`,
            );
            sendNewsletter(email.email, unsubLink);
          } catch {
            console.error("Failed to send email for: ", email.email);
          }
        }),
      );
    }
  };

  const handleGenerateUnsubKeys = async (emailList: MemberEmail[]) => {
    setError(null);
    await Promise.all(
      emailList.map(async (email) => {
        if (!email.unsubKey) {
          try {
            const unsubKey = await fetchUnsubKey(email.id);
            console.log(
              `Generated unsubscribe key for ${email.email}: ${unsubKey}`,
            );
            return unsubKey;
          } catch (error) {
            console.error("Failed to generate unsubscribe key: ", error);
            setError({
              headline: "Error",
              body: `Failed to generate unsubscribe key for ${email.email}`,
            });
          }
        }
      }),
    );
    window.location.reload();
  };

  const handleCopyToClipboard = (emailList: MemberEmail[]) => {
    setError(null);
    const emailListText = emailList
      .map((em) => {
        if (includeName) {
          return `${em?.name} <${em?.email}>`;
        }
        return `${em?.email}`;
      })
      .join("\n");

    navigator.clipboard
      .writeText(emailListText)
      .then(() => {
        setShowCopiedNotification(true);

        const timeout = setTimeout(() => {
          setShowCopiedNotification(false);
          clearTimeout(timeout);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setError({
          headline: "Error",
          body: "Failed to copy text to clipboard. Please try again.",
        });
      });
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-tan-400">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-1 px-2 py-1">
          <div className="flex grow items-center gap-2">
            <h2 className="text-xl font-semibold leading-8">Emails</h2>
            <Tabs
              defaultValue={Object.values(EmailDirectoryFilter)[0]}
              onValueChange={(value) =>
                setTabVisible(value as EmailDirectoryFilter)
              }
              value={tabVisible}
            >
              <TabsList loop>
                {Object.values(EmailDirectoryFilter).map((filter, i) => (
                  <TabsTrigger
                    value={filter}
                    key={`email-directory-filter-${i}`}
                  >
                    {filter}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            {selectedEmails.length > 0 ? (
              <Button
                size={ButtonSize.XSmall}
                variant={ButtonVariant.Secondary}
                onClick={() => {
                  setSelectedEmails([]);
                }}
              >
                Deselect
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size={ButtonSize.XSmall}
                  variant={ButtonVariant.Secondary}
                  onClick={() => {
                    setSelectedEmails([...emails]);
                  }}
                >
                  Select All
                </Button>
                {/* <Button
                  size={ButtonSize.XSmall}
                  variant={ButtonVariant.Secondary}
                  onClick={() => {
                    setSelectedEmails(
                      [...emails].filter((em) => !em?.unsubscribed),
                    );
                  }}
                >
                  Select Subscribed
                </Button> */}
                <Button
                  size={ButtonSize.XSmall}
                  variant={ButtonVariant.Secondary}
                  onClick={() => {
                    setSelectedEmails(
                      [...emails].filter(
                        (em) =>
                          !em?.unsubscribed &&
                          (em?.status === StatusEnum.APPROVED ||
                            em?.status === StatusEnum.IN_PROGRESS),
                      ),
                    );
                  }}
                >
                  Select Subscribed, Approved, & In Progress
                </Button>
                <Button
                  size={ButtonSize.XSmall}
                  variant={ButtonVariant.Secondary}
                  onClick={() => {
                    // const emailList = [];
                    setSelectedEmails(
                      [...emails].filter((em) =>
                        ADMIN_EMAILS.includes(em?.email),
                      ),
                    );
                  }}
                >
                  Select Admins
                </Button>
              </div>
            )}
            {selectedEmails.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (selectedEmails.length > 0) {
                      handleCopyToClipboard(selectedEmails);
                    } else if (emailsShown) {
                      handleCopyToClipboard(emailsShown);
                    }
                  }}
                  size={ButtonSize.XSmall}
                  variant={ButtonVariant.Invert}
                >
                  {showCopiedNotification
                    ? "Copied! ✔️"
                    : selectedEmails.length > 0
                      ? `Copy Selected (${selectedEmails.length})`
                      : `Copy All (${emailsShown.length})`}
                </Button>
                <Button
                  onClick={() => {
                    handleGenerateUnsubKeys(selectedEmails);
                  }}
                  size={ButtonSize.XSmall}
                  variant={ButtonVariant.Primary}
                  disabled={true}
                >
                  {`Generate unsubKeys (${selectedEmails.length})`}
                </Button>
                <Button
                  onClick={() => {
                    handleSendEmails(selectedEmails);
                  }}
                  size={ButtonSize.XSmall}
                  variant={ButtonVariant.Primary}
                  disabled={true} // disabling for now
                >
                  {`Send Emails to Selected (${selectedEmails.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col">
        <div className="w-full border-b border-tan-400 bg-tan-100">
          <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 p-2">
            {tabVisible === EmailDirectoryFilter.All ? (
              <p className="flex flex-wrap gap-x-1 text-xs text-stone-500">
                This list includes all email addresses, including unsubscribed
                members. Do not send marketing or newsletter emails.
              </p>
            ) : (
              <p className="text-xs text-stone-500">
                This list includes all email addresses that will receive our
                newsletter.{" "}
                <span className="text-stone-400">
                  (Excludes unsubscribed members)
                </span>
              </p>
            )}
            <div className="flex shrink-0 gap-4">
              <div className="flex gap-x-2">
                <Checkbox
                  checked={showUnsubLink}
                  onCheckedChange={() => {
                    setShowUnsubLink(!showUnsubLink);
                  }}
                  id="unsubscribe-link"
                />
                <label
                  htmlFor="unsubscribe-link"
                  className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Unsubscribe Link
                </label>
              </div>
              <div className="flex gap-x-2">
                <Checkbox
                  checked={!revealEmail}
                  onCheckedChange={() => {
                    setRevealEmail(!revealEmail);
                  }}
                  id="obscure-email"
                />
                <label
                  htmlFor="obscure-email"
                  className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Obscure Email
                </label>
              </div>
              <div className="flex gap-x-2">
                <Checkbox
                  checked={includeName}
                  onCheckedChange={() => {
                    setIncludeName(!includeName);
                  }}
                  id="include-name"
                />
                <label
                  htmlFor="include-name"
                  className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Prepend Name
                </label>
              </div>
            </div>
          </div>
        </div>
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
        {emailsShown.length === 0 ? (
          <div className="flex w-full justify-center p-4">
            <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
          </div>
        ) : (
          emailsShown.map((em) => {
            const selected = selectedEmails.find(
              (selectedEm) => em?.id === selectedEm?.id,
            );

            return (
              <button
                key={`email-${em?.email}-${em?.id}`}
                className={cn(
                  `
                  group
                  w-full
                  border-b
                  border-tan-300
                  hover:border-tan-600/40
                  hover:bg-tan-600/5
                  active:bg-brown-600/10
                `,
                  selected &&
                    "border-brown-600/40 bg-brown-600/10 text-stone-800 hover:bg-brown-600/20 active:bg-brown-600/10",
                  em?.unsubscribed &&
                    `border-red-400/50 bg-red-400/5 text-red-600 hover:border-red-400 hover:bg-red-400/20  active:bg-red-400/30`,
                  em?.unsubscribed &&
                    selected &&
                    `border-red-400 bg-red-400/20 text-red-600 hover:bg-red-400/30  active:bg-red-400/20`,
                )}
                onClick={() => {
                  handleEmailSelection({
                    id: em?.id,
                    name: em?.name,
                    email: em?.email,
                    emailAbbr: em?.emailAbbr,
                    status: em?.status,
                    unsubscribed: em?.unsubscribed,
                  });
                }}
              >
                <div
                  className={cn(`
                  mx-auto
                  flex
                  w-full
                  max-w-5xl
                  items-center
                  gap-2
                `)}
                >
                  <div
                    className={cn(
                      `mx-auto
                    flex
                    w-full
                    flex-col
                    gap-0.5
                    p-2
                    text-left`,
                    )}
                  >
                    <div className="flex grow flex-col items-start gap-1">
                      {em?.status && (
                        <Tag
                          variant={
                            em?.status === StatusEnum.APPROVED
                              ? TagVariant.Success
                              : em?.status === StatusEnum.IN_PROGRESS
                                ? TagVariant.NearSuccess
                                : em?.status === StatusEnum.PENDING
                                  ? TagVariant.Warn
                                  : TagVariant.Alert
                          }
                        >
                          {convertStringSnake(em?.status)}
                        </Tag>
                      )}
                      <h3 className="text-xl font-semibold">{em?.name}</h3>
                    </div>
                    <h5
                      className={cn(
                        "flex flex-col items-start gap-1 rounded bg-tan-500/10 px-2 py-1 text-xs",
                        em?.unsubscribed && "bg-red-400/10 text-red-600",
                      )}
                    >
                      {em?.unsubscribed && (
                        <span className="font-medium">UNSUBSCRIBER</span>
                      )}
                      {includeName && (
                        <span
                          className={cn(
                            `inline-flex shrink-0 cursor-text select-text text-stone-500`,
                            selected && "text-stone-600",
                            em?.unsubscribed && `text-red-600/60`,
                          )}
                        >
                          {em?.name}
                        </span>
                      )}
                      <span
                        className={cn(
                          `flex-grow cursor-text select-text overflow-hidden overflow-ellipsis whitespace-nowrap text-stone-500`,
                          selected && "text-stone-600",
                          em?.unsubscribed && `text-red-600/60`,
                        )}
                      >
                        {includeName && `<`}
                        {revealEmail ? em?.email : em?.emailAbbr}
                        {includeName && `>`}
                      </span>{" "}
                      {em?.unsubscribed && (
                        <>
                          {/* <span
                    className={cn(
                      `shrink-0 text-stone-400`,
                      em?.unsubscribed && `text-red-600/30`
                      )}
                      >
                      ·
                    </span> */}
                          <span
                            className={cn("shrink-0 text-xs text-red-600/60")}
                          >
                            Transactional / urgent emails only
                          </span>
                        </>
                      )}
                      {showUnsubLink && (
                        <span
                          className={cn(
                            `inline-flex shrink-0 cursor-text select-text text-stone-500`,
                            selected && "text-stone-600",
                            em?.unsubscribed && `text-red-600/60`,
                          )}
                        >
                          {em?.unsubKey ? (
                            <span className="text-blue-500">
                              {`${baseUrl}/edit/unsubscribe?uid=${em?.id}&unsubKey=${em?.unsubKey}`}
                            </span>
                          ) : (
                            <span className="rounded bg-yellow-50/80 px-1 py-0.5 font-semibold text-yellow-600">
                              Unsubscribe link not generated yet
                            </span>
                          )}
                        </span>
                        // </div>
                      )}
                    </h5>
                  </div>
                  <div
                    className={cn(
                      `pr-4 text-stone-500 opacity-50 group-hover:opacity-100`,
                      selected && `text-brown-600 opacity-100`,
                      em?.unsubscribed && `text-red-600`,
                    )}
                  >
                    {selected ? (
                      <CheckIcon width={20} height={20} />
                    ) : (
                      <PlusIcon width={20} height={20} />
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </>
  );
};
