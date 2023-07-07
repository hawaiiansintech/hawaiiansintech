import AdminNav from "@/components/admin/AdminNav";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import { ErrorMessageProps } from "@/components/form/ErrorMessage";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import { DocumentData, getFirebaseTable } from "@/lib/api";
import { FirebaseTablesEnum } from "@/lib/enums";
import { useUserSession } from "@/lib/hooks";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { db, signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

interface MemberEmail {
  id: string;
  email: string;
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
        <>
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
              console.log(em);
              return (
                <div className="flex" key={`email-${em.email}-${em.id}`}>
                  <p>email: {em.email}</p>
                  {em.unsubscribed && <div>🚫</div>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
