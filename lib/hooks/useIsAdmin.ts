import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function useIsAdmin(user: User | null, loading: boolean) {
  const [isAdmin, setIsAdmin] = useState<boolean>(null);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch("/api/is-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(idToken),
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        setIsAdminLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
        setIsAdminLoading(false);
      }
    };

    if (!loading) {
      fetchIsAdmin();
    }
  }, [loading, user]);

  return [isAdmin, isAdminLoading];
}
