import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function useIsAdmin(user: User | null, loading: boolean) {
  const [isAdmin, setIsAdmin] = useState<boolean>(null);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      // Early return if user is null or loading
      if (!user || loading) {
        setIsAdminLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/is-admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        setIsAdminLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
        setIsAdminLoading(false);
      }
    };

    fetchIsAdmin();
  }, [loading, user]);

  if (user === null) return [false, false];

  return [isAdmin, isAdminLoading];
}
