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

export default function authTest() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  };

  return (
    <div>
      <h2>Sign In</h2>
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
