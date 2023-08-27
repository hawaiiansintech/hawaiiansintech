"use client";

import Admin from "@/components/admin/Admin";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/firebase";
import useUserSession from "@/lib/hooks/useUserSession";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, isLoggedIn, isAdmin } = useUserSession();

  return (
    <Admin>
      <Admin.Nav
        handleLogOut={signOutWithGoogle}
        handleLogIn={signInWithGoogle}
        isLoggedIn={isLoggedIn || false}
        isAdmin={isAdmin || false}
        name={userData?.name || ""}
        sticky
      />
      <Admin.Body>{isLoggedIn && isAdmin ? children : <></>}</Admin.Body>
    </Admin>
  );
}
