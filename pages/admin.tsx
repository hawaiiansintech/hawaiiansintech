import Button, { ButtonSize } from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import {
  DocumentData,
  getFirebaseTable,
  getMembers,
  MemberPublic,
} from "@/lib/api";
import { ADMIN_EMAILS } from "@/lib/email/utils";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import MemberCard from "@/lib/memberCard";
import { useEmailCloaker } from "helpers";
import { useEffect, useState } from "react";
import { signInWithGoogle, signOutWithGoogle } from "../lib/firebase";

interface User {
  name: string;
  uid: string;
  email: Array<string>;
  emailIsVerified: boolean;
}

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

export async function getStaticProps() {
  const focusesData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.FOCUSES
  );
  const industriesData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.INDUSTRIES
  );
  const regionsData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.REGIONS
  );
  const members: MemberPublic[] = await getMembers(
    focusesData,
    industriesData,
    regionsData,
    [StatusEnum.IN_PROGRESS, StatusEnum.PENDING]
  );
  return {
    props: {
      fetchedMembers: members,
    },
    revalidate: 60,
  };
}

export default function auth(props: { fetchedMembers: MemberPublic[] }) {
  const [memberData, setMemberData] = useState(props.fetchedMembers);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [showDashboard, setShowDashboard] = useState(false);

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
    setShowDashboard(false);
  };

  const handleDashboard = () => {
    if (!checkUserIsAdmin(userData.uid)) {
      setError({
        headline: "Eh you not one admin!",
        body:
          "If you are, try ask one of the admins for access: " +
          ADMIN_EMAILS.join(", "),
      });
    } else {
      console.log(memberData);
      setShowDashboard(true);
    }
  };

  return (
    <div className="content">
      <div className="simple-nav">
        <h3>
          {isLoggedIn ? "Signed in as: " + userData.name : "Not Signed In"}
        </h3>
        <div className="auth-button">
          <Button
            size={ButtonSize.Small}
            customWidth="16rem"
            customWidthSmall="28rem"
            customFontSize="1.5rem"
            onClick={isLoggedIn ? handleSignOut : signInWithGoogle}
          >
            {isLoggedIn ? "Log Out" : "Log in"}
          </Button>
        </div>
      </div>
      <div className="dashboard">
        {isLoggedIn ? (
          <Button
            size={ButtonSize.Small}
            customWidth="16rem"
            customWidthSmall="28rem"
            customFontSize="1.5rem"
            onClick={handleDashboard}
          >
            View Dashboard
          </Button>
        ) : null}
        {error && (
          <div style={{ marginBottom: "1rem" }}>
            <ErrorMessage headline={error.headline} body={error.body} />
          </div>
        )}
      </div>
      {showDashboard && (
        <div>
          {/* {console.log("TESTING", memberData)} */}
          {memberData
            .sort((a, b) => b.status.localeCompare(a.status))
            .map((member) => MemberCard(member))}
        </div>
      )}
      <style jsx>{`
        .content {
          width: 90%;
          margin: 0 auto;
        }

        .simple-nav {
          height: 5rem;
          position: relative;
          margin-top: 1rem;
        }

        .simple-nav h3 {
          display: inline-block;
        }

        .auth-button {
          position: absolute;
          right: 0;
          top: 1.2rem;
        }

        .dashboard {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
