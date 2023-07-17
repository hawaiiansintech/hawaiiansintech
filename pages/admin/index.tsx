import AdminNav from "@/components/admin/AdminNav";
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
import { useEffect, useState } from "react";
import { signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

interface User {
  name: string;
  uid: string;
  email: Array<string>;
  emailIsVerified: boolean;
}

export const checkUserIsAdmin = async (user_id: string) => {
  try {
    const response = await fetch("/api/is-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user_id }),
    });
    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
};

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
  const { userData, isLoggedIn, isAdmin } = useUserSession();
  const router = useRouter();

  const [memberStates, setMemberStates] = useState(
    props.nonApprovedMembers.map((member) => ({
      id: member.id,
      deleteSelected: false,
      isHidden: false,
    }))
  );

  useEffect(() => {
    if (userData && isLoggedIn && isAdmin) router.push(`/admin/directory`);
  }, [isLoggedIn, isAdmin, userData]);

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={props.pageTitle} />
        <title>{props.pageTitle}</title>
        <AdminNav
          handleLogOut={signOutWithGoogle}
          handleLogIn={signInWithGoogle}
          sticky
        />
      </Head>

      <div className="mx-auto max-w-3xl px-8 py-4">
        {userData === null && (
          <div className="flex w-full justify-center p-4">
            <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
          </div>
        )}

        {userData === undefined && (
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
      </div>
    </>
  );
}
