"use client";

import Admin from "@/components/admin/Admin";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/firebase";
import useUserSession from "@/lib/hooks/useUserSession";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, isLoggedIn, isAdmin, isSessionChecked } = useUserSession();

  return (
    <Admin>
      <Admin.Nav
        handleLogOut={signOutWithGoogle}
        handleLogIn={signInWithGoogle}
        isLoggedIn={isLoggedIn || null}
        isAdmin={isAdmin || null}
        name={userData?.name || ""}
        isSessionChecked={isSessionChecked}
      />
      <Admin.Body>
        {isSessionChecked ? (
          isLoggedIn ? (
            isAdmin ? (
              <>{children}</>
            ) : (
              <div className="p-4">
                You must be an admin to access this page.
              </div>
            )
          ) : (
            <div className="p-4">Please log in to continue.</div>
          )
        ) : (
          <div className="p-4">Checking user session...</div>
        )}
      </Admin.Body>
    </Admin>
  );
}
