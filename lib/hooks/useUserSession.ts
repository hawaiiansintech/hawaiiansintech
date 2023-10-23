import { useEmailCloaker } from "helpers";
import { useCallback, useEffect, useState } from "react";

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

export type UserData = {
  name: string;
  uid: string;
  email: string | string[];
  emailIsVerified: boolean;
  token: string;
};

export default function useUserSession() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSessionChecked, setIsSessionChecked] = useState<boolean>(false);

  const fetchUserSession = useCallback(() => {
    const storedUser = sessionStorage.getItem("user") ?? "";

    if (!storedUser) {
      setUserData(undefined);
      setIsSessionChecked(true);
      return;
    }

    const userData: UserData = {
      name: sessionStorage.getItem("user") || "",
      uid: sessionStorage.getItem("uid") || "",
      email: useEmailCloaker(sessionStorage.getItem("email") || ""),
      emailIsVerified: Boolean(sessionStorage.getItem("emailIsVerified")),
      token: sessionStorage.getItem("token") || "",
    };

    if (!userData?.uid) {
      setUserData(undefined);
      setIsSessionChecked(true);
      return;
    }

    checkUserIsAdmin(userData?.uid || "")
      .then((isAdmin) => {
        setIsAdmin(isAdmin);
        setUserData(userData);
        setIsLoggedIn(true);
        setIsSessionChecked(true);
      })
      .catch((error) => {
        console.error(error);
        setIsSessionChecked(true);
      });
  }, []);

  useEffect(() => {
    fetchUserSession();
  }, [fetchUserSession]);

  return { userData, isLoggedIn, isAdmin, isSessionChecked };
}
