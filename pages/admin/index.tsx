import AdminNav from "@/components/admin/AdminNav";
import Dashboard from "@/components/admin/Dashboard";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import { ErrorMessageProps } from "@/components/form/ErrorMessage";
import MetaTags from "@/components/Metatags";
import Plausible from "@/components/Plausible";
import {
  DocumentData,
  getFirebaseTable,
  getMembers,
  MemberPublic,
} from "@/lib/api";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import { useUserSession } from "@/lib/hooks";
import Head from "next/head";
import { useState } from "react";
import { signInWithGoogle, signOutWithGoogle } from "../../lib/firebase";

interface User {
  name: string;
  uid: string;
  email: Array<string>;
  emailIsVerified: boolean;
}

export const checkUserIsAdmin = async (user_id: string) => {
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
      pageTitle: "Admin Panel · Hawaiians in Technology",
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

export default function AdminPage(props: {
  nonApprovedMembers: MemberPublic[];
  approvedMembers: MemberPublic[];
  pageTitle;
}) {
  const [error, setError] = useState<ErrorMessageProps>(undefined);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [showEmails, setShowEmails] = useState<boolean>(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn, userData } = useUserSession();

  const [memberStates, setMemberStates] = useState(
    props.nonApprovedMembers.map((member) => ({
      id: member.id,
      deleteSelected: false,
      isHidden: false,
    }))
  );

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

  // const handleDashboard = () => {
  //   if (!checkUserIsAdmin(userData.uid)) {
  //     setError({
  //       headline: "Eh you not one admin!",
  //       body:
  //         "If you are, try ask one of the admins for access: " +
  //         ADMIN_EMAILS.join(", "),
  //     });
  //   } else {
  //     setShowDashboard(!showDashboard);
  //   }
  // };

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
    <>
      <Head>
        <Plausible />
        <MetaTags title={props.pageTitle} />
        <title>{props.pageTitle}</title>
      </Head>

      <AdminNav
        handleLogOut={signOutWithGoogle}
        handleLogIn={signInWithGoogle}
        isLoggedIn={isLoggedIn}
        name={userData?.name}
      />

      <div className="mx-auto max-w-3xl px-8 py-4">
        {isLoggedIn ? (
          <Dashboard userId={userData?.uid} />
        ) : (
          <h4>
            <span>You must</span>{" "}
            <Button
              size={ButtonSize.XSmall}
              variant={ButtonVariant.Secondary}
              onClick={signInWithGoogle}
            >
              log in
            </Button>{" "}
            <span>to continue.</span>
          </h4>
        )}
      </div>

      {/* <div className="mx-auto max-w-3xl p-8">
        <div className="dashboard">
          {isLoggedIn ? (
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: "auto" }}>
                <Button onClick={handleDashboard}>
                  {showDashboard ? "Hide Dashboard" : "View Dashboard"}
                </Button>
              </div>
              <div>
                {showDashboard && (
                  <Button size={ButtonSize.Small} onClick={handleShowDelete}>
                    {showDelete ? "Hide Delete" : "Show Delete"}
                  </Button>
                )}
              </div>
            </div>
          ) : null}
          <div style={{ marginTop: "1.5rem", display: "flex" }}>
            <div style={{ marginRight: "1.5rem" }}>
              {isLoggedIn && (
                <Button size={ButtonSize.Small} onClick={handleGetEmails}>
                  {showEmails ? "Hide Emails" : "Get Emails"}
                </Button>
              )}
            </div>
            <div>
              {showEmails && (
                <Button
                  size={ButtonSize.Small}
                  onClick={handleCopyToClipboard}
                  variant={ButtonVariant.Secondary}
                >
                  {copiedToClipboard ? "Copied! ✔️" : "Copy to Clipboard"}
                </Button>
              )}
            </div>
          </div>
          {showEmails && (
            <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
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
      </div> */}
    </>
  );
}
