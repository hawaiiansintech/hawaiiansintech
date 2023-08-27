import { useEmailCloaker } from "helpers";
import { useEffect, useState } from "react";

const checkUserIsAdmin = async (user_id: string) => {
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

type UserData = {
  name: string;
  uid: string;
  email: string | string[];
  emailIsVerified: boolean;
};

export default function useUserSession() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    const fetchUserSession = async () => {
      const storedUser = sessionStorage.getItem("user") ?? "";

      if (!storedUser) {
        setUserData(undefined);
        return;
      }

      const userData: UserData = {
        name: sessionStorage.getItem("user") || "",
        uid: sessionStorage.getItem("uid") || "",
        email: useEmailCloaker(sessionStorage.getItem("email") || ""),
        emailIsVerified: Boolean(sessionStorage.getItem("emailIsVerified")),
      };

      if (!userData?.uid) {
        setUserData(undefined);
        return;
      }

      const isAdmin = await checkUserIsAdmin(userData?.uid || "");

      setIsAdmin(isAdmin);
      setUserData(userData);
      setIsLoggedIn(true);
    };

    fetchUserSession();
  }, []);

  return { userData, isLoggedIn, isAdmin };
}
