import Admin from "@/components/admin/Admin";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
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
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

interface User {
  name: string;
  uid: string;
  email: Array<string>;
  emailIsVerified: boolean;
}

export async function getStaticProps() {
  const focusesData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.FOCUSES
  );
  const industriesData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.INDUSTRIES
  );
  const regionsData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.REGIONS
  );
  const nonApprovedmembers: MemberPublic[] = await getMembers(
    focusesData,
    industriesData,
    regionsData,
    [StatusEnum.IN_PROGRESS, StatusEnum.PENDING]
  );
  const approvedmembers: MemberPublic[] = await getMembers(
    focusesData,
    industriesData,
    regionsData,
    [StatusEnum.APPROVED]
  );

  return {
    props: {
      pageTitle: "Admin Panel · Hawaiians in Technology",
      nonApprovedMembers: nonApprovedmembers,
      approvedMembers: approvedmembers,
    },
    revalidate: 60,
  };
}

export default function AdminPage(props: {
  nonApprovedMembers: MemberPublic[];
  approvedMembers: MemberPublic[];
  pageTitle;
}) {
  const { userData, isLoggedIn, isAdmin, isSessionChecked } = useUserSession();
  const router = useRouter();

  useEffect(() => {
    if (userData && isLoggedIn && isAdmin) router.push(`/admin/directory`);
  }, [isLoggedIn, isAdmin, userData]);

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={props.pageTitle} />
        <title>{props.pageTitle}</title>
      </Head>
      <Admin.Nav
        handleLogOut={signOutWithGoogle}
        handleLogIn={signInWithGoogle}
        isSessionChecked={isSessionChecked}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        name={userData?.name}
      />
      <Admin.Body className="mx-auto max-w-3xl px-8 py-4">
        {userData === null && (
          <div className="flex w-full justify-center p-4">
            <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
          </div>
        )}
        {userData !== null && isLoggedIn && !isAdmin && (
          <h4>
            You cannot access this page. Please contact an administrator if you
            believe this is an error.
          </h4>
        )}
        {userData !== null && !isLoggedIn && (
          <h4>
            <span>You must</span>{" "}
            <Button
              size={ButtonSize.XSmall}
              variant={ButtonVariant.Secondary}
              onClick={signInWithGoogle}
            >
              log in
            </Button>{" "}
            <span>to continue.</span>
          </h4>
        )}
      </Admin.Body>
    </>
  );
}
