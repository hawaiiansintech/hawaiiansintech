import AdminNav from "@/components/admin/AdminNav";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import CheckBox, {
  CheckBoxSize,
  CheckBoxVariant,
} from "@/components/form/CheckBox";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import Tag, { TagVariant } from "@/components/Tag";
import { DocumentData, getFirebaseTable } from "@/lib/api";
import { FirebaseTablesEnum } from "@/lib/enums";
import { useUserSession } from "@/lib/hooks";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { doc, getDoc } from "firebase/firestore";
import { cn } from "helpers";
import Head from "next/head";
import Router from "next/router";
import { FC, useEffect, useState } from "react";
import { db, signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

interface MemberEmail {
  id: string;
  name: string;
  email: string;
  emailAbbr: string;
  unsubscribed: boolean;
}

export async function getStaticProps() {
  const secureMemberData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.SECURE_MEMBER_DATA
  );

  const emailPromises = secureMemberData.map((secM) => {
    if (secM.fields.email === "") return null;
    const docRef = doc(db, FirebaseTablesEnum.MEMBERS, secM.id);
    return getDoc(docRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return {
            id: secM.id,
            email: secM.fields.email,
            name: docSnapshot.data().name || null,
            emailAbbr: docSnapshot.data().masked_email || null,
            unsubscribed: docSnapshot.data().unsubscribed || false,
          };
        } else {
          console.log(
            `No data available for ${secM.id} in MEMBERS (${secM.fields.email})`
          );
          return null;
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  });

  const emails: MemberEmail[] = await Promise.all(emailPromises);
  const filteredEmails = emails.filter((email) => email !== null);

  return {
    props: {
      emails: filteredEmails,
      pageTitle: "Admin Panel · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function AdminPage(props: { emails: MemberEmail[]; pageTitle }) {
  const { isLoggedIn, userData, isLoadingUserSession } = useUserSession();

  useEffect(() => {
    if (!isLoadingUserSession && !isLoggedIn) Router.push(`/admin`);
  }, [isLoggedIn, isLoadingUserSession]);

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={props.pageTitle} />
        <title>{props.pageTitle}</title>
      </Head>
      <AdminNav
        handleLogOut={signOutWithGoogle}
        handleLogIn={signInWithGoogle}
        name={userData?.name}
      />

      {isLoadingUserSession || !isLoggedIn ? (
        <div className="flex w-full justify-center p-4">
          <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
        </div>
      ) : (
        <div className="mx-auto">
          {props.emails ? <EmailList emails={props.emails} /> : <></>}
        </div>
      )}
    </>
  );
}

const EmailList: FC<{ emails: MemberEmail[] }> = ({ emails }) => {
  const [error, setError] = useState<ErrorMessageProps>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  const [showUnsubscribed, setShowUnsubscribed] = useState<boolean>(false);
  const [emailsShown, setEmailsShown] = useState<MemberEmail[]>(emails);
  const [revealEmail, setRevealEmail] = useState<boolean>(false);
  const [includeName, setIncludeName] = useState<boolean>(true);
  const [selectedEmails, setSelectedEmails] = useState<MemberEmail[]>([]);

  const handleEmailSelection = (em: MemberEmail) => {
    if (selectedEmails.find((selectedEm) => em.id === selectedEm.id)) {
      setSelectedEmails(
        selectedEmails.filter((selectedEm) => em.id !== selectedEm.id)
      );
    } else {
      setSelectedEmails([
        ...selectedEmails,
        {
          id: em.id,
          name: em.name,
          email: em.email,
          emailAbbr: em.emailAbbr,
          unsubscribed: em.unsubscribed,
        },
      ]);
    }
  };

  const emailSubscribed = emails
    .filter((em) => !em.unsubscribed)
    .sort((a, b) => a.name.localeCompare(b.name));
  const emailUnsubscribed = emails
    .filter((em) => em.unsubscribed)
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleCopyToClipboard = (emailList: MemberEmail[]) => {
    setError(null);
    const emailListText = emailList
      .map((em) => {
        if (includeName) {
          return `${em.name} <${em.email}>`;
        }
        return `${em.email}`;
      })
      .join("\n");

    navigator.clipboard
      .writeText(emailListText)
      .then(() => {
        setCopiedToClipboard(true);

        const timeout = setTimeout(() => {
          setCopiedToClipboard(false);
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

  useEffect(() => {
    if (showUnsubscribed) {
      setEmailsShown([...emailUnsubscribed, ...emailSubscribed]);
    } else {
      setEmailsShown(emailSubscribed);
    }
  }, [showUnsubscribed]);

  return (
    <>
      <div className="sticky top-12 z-50 w-full bg-tan-400">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-1 px-2 py-1">
          <div className="flex grow items-center gap-2">
            <h2 className="text-xl font-semibold leading-8">Emails</h2>
            <Tabs
              items={[
                {
                  label: (
                    <>
                      Subscribers{" "}
                      <span className="text-tan-700">
                        {emailSubscribed.length}
                      </span>
                    </>
                  ),
                  onClick: () => {
                    setShowUnsubscribed(!showUnsubscribed);
                    setSelectedEmails(
                      selectedEmails.filter((em) => !em.unsubscribed)
                    );
                  },
                  selected: !showUnsubscribed,
                },
                {
                  label: (
                    <>
                      All <span className="text-tan-700">{emails.length}</span>
                    </>
                  ),
                  onClick: () => {
                    setShowUnsubscribed(!showUnsubscribed);
                  },
                  selected: showUnsubscribed,
                },
              ]}
            />
          </div>
          <div className="flex items-center gap-2">
            <CheckBox
              label="Obscure Email"
              checked={!revealEmail}
              onChange={() => {
                setRevealEmail(!revealEmail);
              }}
              size={CheckBoxSize.Small}
              variant={CheckBoxVariant.Darker}
            />
            <CheckBox
              label={`Prepend Name`}
              checked={includeName}
              onChange={() => {
                setIncludeName(!includeName);
              }}
              size={CheckBoxSize.Small}
              variant={CheckBoxVariant.Darker}
            />
            {selectedEmails.length > 0 && (
              <Button
                size={ButtonSize.XSmall}
                variant={ButtonVariant.Secondary}
                onClick={() => {
                  if (selectedEmails.length > 8) {
                    const confirmDelete = window.confirm(
                      `You've selected ${selectedEmails.length} emails. That's a lot; more than most.
                      
Are you sure you want to deselect?`
                    );
                    if (confirmDelete) {
                      setSelectedEmails([]);
                    }
                  } else {
                    setSelectedEmails([]);
                  }
                }}
              >
                Deselect All
              </Button>
            )}
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
              {copiedToClipboard
                ? "Copied! ✔️"
                : selectedEmails.length > 0
                ? `Copy Selected (${selectedEmails.length})`
                : `Copy All${showUnsubscribed ? "" : " Subscribers"}`}
            </Button>
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
        {emailsShown.map((em) => {
          const selected = selectedEmails.find(
            (selectedEm) => em.id === selectedEm.id
          );
          return (
            <button
              key={`email-${em.email}-${em.id}`}
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
                em.unsubscribed &&
                  `border-red-400/50 bg-red-400/5 text-red-600 hover:border-red-400 hover:bg-red-400/20  active:bg-red-400/30`,
                em.unsubscribed &&
                  selected &&
                  `border-red-400 bg-red-400/20 text-red-600 hover:bg-red-400/30  active:bg-red-400/20`
              )}
              onClick={() => {
                handleEmailSelection({
                  id: em.id,
                  name: em.name,
                  email: em.email,
                  emailAbbr: em.emailAbbr,
                  unsubscribed: em.unsubscribed,
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
                    text-left`
                  )}
                >
                  <div className="flex items-start gap-2">
                    <h3 className="grow text-sm font-semibold">{em.name}</h3>
                    {em.unsubscribed && (
                      <Tag variant={TagVariant.Alert}>Unsubscribed</Tag>
                    )}
                  </div>
                  <h5 className="inline-flex items-center gap-1 text-sm">
                    {includeName && (
                      <span
                        className={cn(
                          `inline-flex shrink-0 cursor-text select-text text-stone-500`,
                          selected && "text-stone-600",
                          em.unsubscribed && `text-red-600/60`
                        )}
                      >
                        {em.name}
                      </span>
                    )}

                    <span
                      className={cn(
                        `flex-grow cursor-text select-text overflow-hidden overflow-ellipsis whitespace-nowrap text-stone-500`,
                        selected && "text-stone-600",
                        em.unsubscribed && `text-red-600/60`
                      )}
                    >
                      {includeName && `<`}
                      {revealEmail ? em.email : em.emailAbbr}
                      {includeName && `>`}
                    </span>
                    {em.unsubscribed && (
                      <>
                        {/* <span
                    className={cn(
                      `shrink-0 text-stone-400`,
                      em.unsubscribed && `text-red-600/30`
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
                  </h5>
                </div>
                <div
                  className={cn(
                    `pr-4 text-stone-500 opacity-50 group-hover:opacity-100`,
                    selected && `text-brown-600 opacity-100`,
                    em.unsubscribed && `text-red-600`
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
        })}
      </div>
    </>
  );
};
