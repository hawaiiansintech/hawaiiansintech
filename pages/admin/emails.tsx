import AdminNav from "@/components/admin/AdminNav";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import CheckBox, { CheckBoxSize } from "@/components/form/CheckBox";
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
        <div className="mx-auto max-w-3xl px-8 py-4">
          {props.emails ? (
            <>
              {/* <Button
                onClick={handleCopyToClipboard}
                size={ButtonSize.Small}
                variant={ButtonVariant.Secondary}
              >
                {copiedToClipboard ? "Copied! ✔️" : "Copy to Clipboard"}
              </Button> */}
              <EmailList emails={props.emails} />
            </>
          ) : (
            <></>
          )}
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

  const emailSubscribed = emails
    .filter((em) => !em.unsubscribed)
    .sort((a, b) => a.name.localeCompare(b.name));
  const emailUnsubscribed = emails
    .filter((em) => em.unsubscribed)
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (showUnsubscribed) {
      setEmailsShown([...emailUnsubscribed, ...emailSubscribed]);
    } else {
      setEmailsShown(emailSubscribed);
    }
  }, [showUnsubscribed]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <div className="flex grow items-center gap-2">
          <h2 className="text-xl font-semibold">Emails</h2>
          <span className="text-xl text-stone-500">{emails.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckBox
            label="Subscribed-Only"
            checked={!showUnsubscribed}
            onChange={() => {
              setShowUnsubscribed(!showUnsubscribed);
            }}
            size={CheckBoxSize.Small}
          />
          <CheckBox
            label="Hide Emails"
            checked={!revealEmail}
            onChange={() => {
              setRevealEmail(!revealEmail);
            }}
            size={CheckBoxSize.Small}
          />
          <Button
            // onClick={handleCopyToClipboard}
            size={ButtonSize.XSmall}
            variant={ButtonVariant.Secondary}
          >
            {/* {copiedToClipboard ? "Copied! ✔️" : "Copy to Clipboard"} */}
            Copy Emails
          </Button>
        </div>
      </div>
      {emailsShown.map((em) => (
        <button
          className={cn(
            `flex flex-col gap-0.5 rounded border border-tan-300 p-2 text-left hover:border-tan-400 hover:bg-tan-300/50 active:bg-tan-300`,
            em.unsubscribed &&
              `border-red-400/50 bg-red-400/10 text-red-600 hover:border-red-400 hover:bg-red-400/20`
          )}
          key={`email-${em.email}-${em.id}`}
        >
          <div className="flex items-start gap-2">
            <h3 className="grow text-sm font-semibold">{em.name}</h3>
            {em.unsubscribed && (
              <Tag variant={TagVariant.Alert}>Unsubscribed</Tag>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <p
              className={cn(
                `text-stone-500`,
                em.unsubscribed && `text-red-600/60`
              )}
            >
              {revealEmail ? em.email : em.emailAbbr}
            </p>
            <span
              className={cn(
                `text-stone-400`,
                em.unsubscribed && `text-red-600/30`
              )}
            >
              ·
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
