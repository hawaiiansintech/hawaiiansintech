import Admin from "@/components/admin/Admin";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import { StorageEnum } from "@/lib/enums";
import { useIsAdmin } from "@/lib/hooks";
import { getAuth } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

interface User {
  name: string;
  uid: string;
  email: Array<string>;
  emailIsVerified: boolean;
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Admin Panel · Hawaiians in Technology",
    },
    revalidate: 60,
  };
}

export default function AdminPage(props: { pageTitle }) {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, isAdminLoading] = useIsAdmin(user, loading);
  const router = useRouter();

  // TODO: Add once /admin/directory doesn't loop back here
  useEffect(() => {
    if (user && isAdmin) {
      sessionStorage.setItem(StorageEnum.PREVIOUS_PAGE, "/admin");
      router.push({ pathname: "/admin/directory" });
    }
  }, [user, router, isAdmin]);

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
          {loading ||
            (isAdminLoading && (
              <div className="flex w-full justify-center p-4">
                <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
              </div>
            ))}
          {!loading && !isAdminLoading && !user && (
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
          {user && isAdmin && <h4>Admin</h4>}
        </Admin.Body>
      </Admin>
    </>
  );
}
