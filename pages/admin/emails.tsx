import AdminNav from "@/components/admin/AdminNav";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import CheckBox, {
  CheckBoxSize,
  CheckBoxVariant,
} from "@/components/form/CheckBox";
import { ErrorMessageProps } from "@/components/form/ErrorMessage";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import Tag, { TagVariant } from "@/components/Tag";
import { DocumentData, getFirebaseTable } from "@/lib/api";
import { FirebaseTablesEnum } from "@/lib/enums";
import { useUserSession } from "@/lib/hooks";
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
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  const { isLoggedIn, userData, isLoadingUserSession } = useUserSession();

  const handleCopyToClipboard = () => {
    const emailListText = props.emails.join("\n");
    navigator.clipboard.writeText(emailListText);
    setCopiedToClipboard(true);

    const timeout = setTimeout(() => {
      setCopiedToClipboard(false);
      clearTimeout(timeout);
    }, 2000);
  };

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
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  const [showUnsubscribed, setShowUnsubscribed] = useState<boolean>(false);
  const [emailsShown, setEmailsShown] = useState<MemberEmail[]>(emails);
  const [revealEmail, setRevealEmail] = useState<boolean>(false);
  const [includeName, setIncludeName] = useState<boolean>(true);

  const emailSubscribed = emails
    .filter((em) => !em.unsubscribed)
    .sort((a, b) => a.name.localeCompare(b.name));
  const emailUnsubscribed = emails
    .filter((em) => em.unsubscribed)
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleCopyToClipboard = () => {
    const emailListText = emailsShown
      .map((em) => {
        if (includeName) {
          return `${em.name} <${em.email}>`;
        }
        return em.email;
      })
      .join("\n");
    navigator.clipboard.writeText(emailListText);
    setCopiedToClipboard(true);

    const timeout = setTimeout(() => {
      setCopiedToClipboard(false);
      clearTimeout(timeout);
    }, 2000);
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
      <div className="sticky top-12 mb-2 w-full bg-tan-400">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center px-2 py-1 ">
          <div className="flex grow items-center gap-2">
            <h2 className="text-xl font-semibold leading-8">Emails</h2>
            <div className="flex grow items-center gap-1">
              <span>{emailSubscribed.length} subscribers</span>
              {showUnsubscribed && (
                <span className="text-red-600">
                  {`(+${emails.length - emailSubscribed.length})`}
                </span>
              )}
              <button
                className={cn(
                  `mt-0.5 rounded-sm bg-tan-500 px-1 py-0.5 text-xs leading-none text-tan-100 hover:bg-tan-600/70`,
                  showUnsubscribed && `bg-red-600 hover:bg-red-700`
                )}
                onClick={() => {
                  setShowUnsubscribed(!showUnsubscribed);
                }}
              >
                {showUnsubscribed ? "Hide" : "Include Unsubscribers"}
              </button>
            </div>
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
            <Button
              onClick={handleCopyToClipboard}
              size={ButtonSize.XSmall}
              variant={ButtonVariant.Invert}
            >
              {copiedToClipboard ? "Copied! ✔️" : "Copy All to Clipboard"}
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-2">
        {emailsShown.map((em) => (
          <button
            className={cn(
              `mx-auto
            flex
            w-full
            flex-col
            gap-0.5
            rounded
            border
            border-tan-300
            p-2
            px-2
            text-left
            hover:border-tan-400
            hover:bg-tan-300/50
            active:bg-tan-300/80`,
              em.unsubscribed &&
                `border-red-400/50 bg-red-400/10 text-red-600 hover:border-red-400 hover:bg-red-400/20 active:bg-red-400/30`
            )}
            key={`email-${em.email}-${em.id}`}
          >
            <div className="flex items-start gap-2">
              <h3 className="grow text-sm font-semibold">{em.name}</h3>
              {em.unsubscribed && (
                <Tag variant={TagVariant.Alert}>Unsubscribed</Tag>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {includeName && (
                <p
                  className={cn(
                    `inline-flex shrink-0 text-stone-500`,
                    em.unsubscribed && `text-red-600/60`
                  )}
                >
                  {em.name}
                </p>
              )}

              <p
                className={cn(
                  `flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap text-stone-500`,
                  em.unsubscribed && `text-red-600/60`
                )}
              >
                {includeName && `<`}
                {revealEmail ? em.email : em.emailAbbr}
                {includeName && `>`}
              </p>
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
                  <p className={cn("shrink-0 text-xs text-red-600/60")}>
                    Transactional / urgent emails only
                  </p>
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
