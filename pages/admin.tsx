import Button, { ButtonSize } from "@/components/Button";
import { useEmailCloaker } from "helpers";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import { signInWithGoogle, signOutWithGoogle } from "../lib/firebase";

interface User {
  name: string;
  uid: string;
  email: Array<string>;
  emailIsVerified: boolean;
}

export default function auth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnAdmin, setIsAnAdmin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      const userData: User = {
        name: sessionStorage.getItem("user"),
        uid: sessionStorage.getItem("uid"),
        email: useEmailCloaker(sessionStorage.getItem("email")),
        emailIsVerified: Boolean(sessionStorage.getItem("emailIsVerified")),
      };
      setIsLoggedIn(true);
      setUserData(userData);
    }
  }, []);

  const handleSignOut = () => {
    signOutWithGoogle();
    setIsLoggedIn(false);
    setIsAnAdmin(false);
  };

  const checkIsAdmin = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch("/api/is-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: userData.uid }),
        });
        const data = await response.json();
        setIsAnAdmin(data.isAdmin);
      } catch (error) {
        console.error("An error occurred:", error);
        setIsAnAdmin(false);
      }
    } else {
      setIsAnAdmin(false);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <Button
        size={ButtonSize.Small}
        customWidth="16rem"
        customWidthSmall="28rem"
        customFontSize="1.5rem"
        onClick={checkIsAdmin}
      >
        is admin
      </Button>
      <h3>{isAnAdmin ? "You ARE an admin" : "You ARE NOT an admin"}</h3>
      <h3>{isLoggedIn ? "Signed in as: " + userData.name : "Not Signed In"}</h3>
      <Button
        size={ButtonSize.Small}
        customWidth="16rem"
        customWidthSmall="28rem"
        customFontSize="1.5rem"
        onClick={isLoggedIn ? handleSignOut : signInWithGoogle}
      >
        {isLoggedIn ? "Log Out" : "Log in"}
      </Button>
      <style jsx>{`
        div {
          margin: 3rem auto 0;
          padding: 0 4rem;
          max-width: ${theme.layout.breakPoints.medium};
        }
      `}</style>
    </div>
  );
}
