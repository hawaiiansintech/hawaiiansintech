"use client";

import Admin from "@/components/admin/Admin";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/firebase";
import useUserSession from "@/lib/hooks/useUserSession";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, isLoggedIn, isAdmin } = useUserSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (userData && isLoggedIn && isAdmin) router.push(`/admin/directory`);
  // }, [isLoggedIn, isAdmin, userData]);

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
      <Admin.Body>{children}</Admin.Body>
    </Admin>
  );
}
