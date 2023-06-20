import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
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
  const nonApprovedmembers: MemberPublic[] = await getMembers(
    focusesData,
    industriesData,
    regionsData,
    [StatusEnum.IN_PROGRESS, StatusEnum.PENDING]
  );
  const approvedmembers: MemberPublic[] = await getMembers(
    focusesData,
    industriesData,
    regionsData,
    [StatusEnum.APPROVED]
  );
  return {
    props: {
      nonApprovedMembers: nonApprovedmembers,
      approvedMembers: approvedmembers,
    },
    revalidate: 60,
  };
}

export async function getEmails(
  approvedMembers: MemberPublic[]
): Promise<string[]> {
  const secureMemberData: DocumentData[] = await getFirebaseTable(
    FirebaseTablesEnum.SECURE_MEMBER_DATA
  );
  let returnData = [];
  for (const member of approvedMembers) {
    const secureMember = secureMemberData.find(
      (secureMember) =>
        secureMember.id === member.id &&
        member.unsubscribed === false &&
        "fields" in secureMember &&
        secureMember.fields !== undefined
    );
    secureMember && returnData.push(secureMember.fields.email);
  }
  returnData.sort();
  return returnData;
}

export default function admin(props: {
  nonApprovedMembers: MemberPublic[];
  approvedMembers: MemberPublic[];
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [showEmails, setShowEmails] = useState<boolean>(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

  const [memberStates, setMemberStates] = useState(
    props.nonApprovedMembers.map((member) => ({
      id: member.id,
      deleteSelected: false,
      isHidden: false,
    }))
  );

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

  const handleDeleteClick = (id: string) => {
    setMemberStates((prevStates) =>
      prevStates.map((state) =>
        state.id === id
          ? { ...state, deleteSelected: !state.deleteSelected }
          : state
      )
    );
  };

  const handleHideMember = (id: string) => {
    setMemberStates((prevStates) =>
      prevStates.map((state) =>
        state.id === id ? { ...state, isHidden: !state.isHidden } : state
      )
    );
  };

  const handleShowDelete = () => {
    setShowDelete(!showDelete);
  };

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
      setShowDashboard(!showDashboard);
    }
  };

  const handleGetEmails = async () => {
    if (emailList.length === 0) {
      const emails = await getEmails(props.approvedMembers);
      setEmailList(emails);
    }
    if (showEmails) setCopiedToClipboard(false);
    setShowEmails(!showEmails);
  };

  const handleCopyToClipboard = () => {
    const emailListText = emailList.join("\n");
    navigator.clipboard.writeText(emailListText);
    setCopiedToClipboard(true);
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
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "auto" }}>
              <Button
                size={ButtonSize.Small}
                customWidth="16rem"
                customWidthSmall="28rem"
                customFontSize="1.5rem"
                onClick={handleDashboard}
              >
                {showDashboard ? "Hide Dashboard" : "View Dashboard"}
              </Button>
            </div>
            <div>
              {showDashboard && (
                <Button
                  size={ButtonSize.Small}
                  customWidth="10rem"
                  customFontSize="1rem"
                  onClick={handleShowDelete}
                >
                  {showDelete ? "Hide Delete" : "Show Delete"}
                </Button>
              )}
            </div>
          </div>
        ) : null}
        <div style={{ marginTop: "1.5rem", display: "flex" }}>
          <div style={{ marginRight: "1.5rem" }}>
            <Button
              size={ButtonSize.Small}
              customWidth="16rem"
              customWidthSmall="28rem"
              customFontSize="1.5rem"
              onClick={handleGetEmails}
            >
              {showEmails ? "Hide Emails" : "Get Emails"}
            </Button>
          </div>
          <div>
            {showEmails && (
              <Button
                size={ButtonSize.Small}
                customWidth="10rem"
                customFontSize="1rem"
                onClick={handleCopyToClipboard}
                variant={ButtonVariant.Secondary}
              >
                {copiedToClipboard ? "Copied! ✔️" : "Copy to Clipboard"}
              </Button>
            )}
          </div>
        </div>
        {showEmails && (
          <div style={{ marginTop: "1.5rem" }}>
            {emailList.map((email) => (
              <div key={email}>{email}</div>
            ))}
          </div>
        )}
        {error && (
          <div style={{ marginBottom: "1rem" }}>
            <ErrorMessage headline={error.headline} body={error.body} />
          </div>
        )}
      </div>
      {showDashboard && (
        <div>
          {props.nonApprovedMembers
            .sort((a, b) => b.status.localeCompare(a.status))
            .map((member) =>
              MemberCard(
                member,
                memberStates.find((state) => state.id === member.id)
                  .deleteSelected,
                handleDeleteClick,
                memberStates.find((state) => state.id === member.id).isHidden,
                handleHideMember,
                showDelete
              )
            )}
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
