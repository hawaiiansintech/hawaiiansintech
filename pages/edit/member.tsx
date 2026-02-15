import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import {
  FirestoreDocumentData,
  MemberPublic,
} from "@/lib/firebase-helpers/interfaces";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MemberEdit } from "@/components/MemberEdit";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { YearsOfExperienceEnum } from "@/lib/enums";
import { sortByOrder } from "@/lib/utils";
export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Update Profile · Hawaiians in Technology",
    },
  };
}

export default function EditMemberPage({ pageTitle }) {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav variant="minimized" backLinkTo="/" />
      <Heading>Edit Profile</Heading>
      <EditMember />
    </>
  );
}

function EditMember() {
  const [user] = useAuthState(auth);
  const [error, setError] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const memberId = router.query.memberId as string;
  const [member, setMember] = useState<MemberPublic>(null);
  const [regions, setRegions] = useState<FirestoreDocumentData[]>([]);
  const [experience, setExperience] = useState<FirestoreDocumentData[]>([]);
  const experienceOrder = Object.values(YearsOfExperienceEnum) as string[];

  const getUser = async () => {
    try {
      user.getIdToken().then(async (token) => {
        await fetch(`/api/members`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data || !data.members) {
              throw new Error(`Invalid API response: ${JSON.stringify(data)}`);
            }
            const member = data.members.find((m) => m.id === memberId);
            if (!member) {
              throw new Error(
                `Something went wrong while fetching ${memberId}`,
              );
            }
            setMember(member);

            setRegions(data.regions || []);
            try {
              setExperience(
                sortByOrder(data.experience || [], experienceOrder),
              );
            } catch (error) {
              console.error("Error sorting experience:", error);
              console.error("Error stack:", error.stack);
              // Fallback to unsorted array
              setExperience(data.experience || []);
            }
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      });
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  return (
    <div
      className={`
        mx-auto
        mb-8
        mt-8
        flex
        max-w-3xl
        flex-col
        items-center
        px-4
      `}
    >
      {error && (
        <Alert variant="destructive">
          <ShieldAlert />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading && <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />}
      {member && regions && auth.currentUser && (
        <MemberEdit
          member={member}
          regions={regions}
          user={auth.currentUser}
          experience={experience}
          adminView={false}
        />
      )}
    </div>
  );
}
