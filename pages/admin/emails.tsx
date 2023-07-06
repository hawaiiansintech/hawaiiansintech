import AdminNav from "@/components/admin/AdminNav";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import { ErrorMessageProps } from "@/components/form/ErrorMessage";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import {
  DocumentData,
  getFirebaseTable,
  getMembers,
  MemberPublic,
} from "@/lib/api";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import { useUserSession } from "@/lib/hooks";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

export async function getStaticProps() {
  // skipping fetching unneeded facets
  //   e.g. no need regions/focuses/industries
  //        only pulling id
  const approvedMembers: MemberPublic[] = await getMembers(
    undefined,
    undefined,
    undefined,
    [StatusEnum.APPROVED]
  );

  const secureMemberData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.SECURE_MEMBER_DATA
  );

  const emails: string[] = secureMemberData
    .filter((secM) => {
      return approvedMembers.find(
        (m) =>
          secM.id === m.id &&
          m.unsubscribed === false &&
          "fields" in secM &&
          secM.fields !== undefined
      );
    })
    .map((m) => m.fields.email);

  return {
    props: {
      emails: emails,
      pageTitle: "Admin Panel · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function AdminPage(props: {
  nonApprovedMembers: MemberPublic[];
  approvedMembers: MemberPublic[];
  emails: string[];
  pageTitle;
}) {
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
    console.log(
      `🔥 isLoading: ${isLoadingUserSession}, isLoggedIn: ${isLoggedIn}`
    );
    if (!isLoadingUserSession && !isLoggedIn) {
      Router.push(`/admin`);
    }
  }, [isLoggedIn, isLoadingUserSession]);

  if (isLoadingUserSession || !isLoggedIn) {
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
        <div className="flex w-full justify-center p-4">
          <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
        </div>
      </>
    );
  }

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

      <div className="mx-auto max-w-3xl px-8 py-4">
        {props.emails ? (
          <Button
            onClick={handleCopyToClipboard}
            size={ButtonSize.Small}
            variant={ButtonVariant.Secondary}
          >
            {copiedToClipboard ? "Copied! ✔️" : "Copy to Clipboard"}
          </Button>
        ) : (
          <></>
        )}
        {props.emails.map((em) => {
          return <p key={`email-${em}`}>{em}</p>;
        })}
      </div>
    </>
  );
}
