import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function useIsAdmin(user: User | null, loading: boolean) {
  const [isAdmin, setIsAdmin] = useState<boolean>(null);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIsAdmin = async () => {
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

    if (!loading) {
      fetchIsAdmin();
    }
  }, [loading, user]);

  if (user === null) return [false, false];

  return [isAdmin, isAdminLoading];
}
