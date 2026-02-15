import { Heading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import Head from "next/head";
import { useRouter } from "next/router";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";

export default function UnsubscribePage({ pageTitle }) {
  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav backLinkTo="/" />
      <Heading>Unsubscribe from Email List</Heading>
      <Unsubscribe />
    </>
  );
}

function Unsubscribe() {
  const router = useRouter();
  const { uid, unsubKey } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<string | null>(null);
  useEffect(() => {
    if (uid && unsubKey) {
      fetch("/api/unsubscribe", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, unsubKey }),
      })
        .then((response) => response.json())
        .then((data) => {
          setResult(data.message);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [uid, unsubKey]);

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
      {loading ? (
        <div className="flex w-full justify-center p-4">
          <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
        </div>
      ) : (
        <div>{result}</div>
      )}
    </div>
  );
}
