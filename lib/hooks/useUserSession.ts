import { checkUserIsAdmin } from "@/pages/admin";
import { useEmailCloaker } from "helpers";
import { useEffect, useState } from "react";

export default function useUserSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userData = {
          name: storedUser,
          uid: sessionStorage.getItem("uid"),
          email: useEmailCloaker(sessionStorage.getItem("email")),
          emailIsVerified: Boolean(sessionStorage.getItem("emailIsVerified")),
        };
        // wait to check if the user is an admin
        const isAdmin = await checkUserIsAdmin(userData?.uid);
        // set the user's admin status
        setIsAdmin(isAdmin);
        // set userData from session storage
        setUserData(userData);
        // flip the user to logged-in
        setIsLoggedIn(true);
      } else {
        // set to undefined if user is not found in session storage
        setUserData(undefined);
      }
    };

    fetchUserSession();
  }, []);

  return { userData, isLoggedIn, isAdmin };
}
