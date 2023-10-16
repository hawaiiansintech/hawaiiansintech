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
import { useIsAdmin } from "@/lib/hooks";
import { getAuth } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
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
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const isAdmin = useIsAdmin(user, loading);
  const router = useRouter();

  // TODO: Add once /admin/directory doesn't loop back here
  // useEffect(() => {
  //   if (user && isAdmin) {
  //     sessionStorage.setItem(StorageEnum.PREVIOUS_PAGE, "/admin");
  //     router.push({ pathname: "/admin/directory" });
  //   }
  // }, [user, router, isAdmin]);

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
          {loading && (
            <div className="flex w-full justify-center p-4">
              <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
            </div>
          )}
          {!loading && !user && (
            <h4 className="p-4">
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
          {!loading && user && !isAdmin && (
            <h4 className="p-4">
              You cannot access this page. Please contact an administrator if
              you believe this is an error.
            </h4>
          )}
          {isAdmin && <h4>Admin</h4>}
        </Admin.Body>
      </Admin>
    </>
  );
}
