import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { buttonVariants } from "@/components/ui/button";
import LoadingSpinner, {
  LoadingSpinnerVariant,
} from "@/components/LoadingSpinner";
import Logo from "@/components/Logo";
import Link from "next/link";
import { DISCORD_URL } from "./about";
import Code from "@/components/Code";

enum UnsubState {
  Loading = "loading",
  Success = "success",
  Error = "error",
}

interface UnsubStatus {
  state: UnsubState;
  message?: string;
}

export default function UnsubscribePage() {
  const [unsubscribeStatus, setUnsubscribeStatus] = useState<UnsubStatus>({
    state: UnsubState.Loading,
    message: null,
  });

  const router = useRouter();
  const { query } = router;
  const { uid, unsub } = query;

  const handleUnsubscribe = async () => {
    try {
      if (!uid || !unsub) {
        throw new Error("Missing UID or unsubscribe token in URL query.");
      }

      const response = await fetch("/api/unsubscribe", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          unsubKey: unsub,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to unsubscribe");
      }
      setUnsubscribeStatus({ state: UnsubState.Success });
    } catch (error) {
      console.error("Failed to unsubscribe:", error.message);
      setUnsubscribeStatus({ state: UnsubState.Error, message: error.message });
    }
  };

  useEffect(() => {
    if (uid && unsub) {
      handleUnsubscribe();
    } else if (router.isReady) {
      setUnsubscribeStatus({
        state: UnsubState.Error,
        message: "Bad url",
      });
    }
  }, [uid, unsub, router.isReady]);

  return (
    <section
      className={`
        mx-auto
        mb-4
        mt-8
        flex
        max-w-lg
        flex-col
        px-4
      `}
    >
      <div className="flex w-full flex-col gap-4 sm:rounded-lg sm:border sm:p-4">
        <div className="self-center">
          <Logo />
        </div>
        {unsubscribeStatus.state === UnsubState.Loading ? (
          <div className="self-center py-12">
            <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
          </div>
        ) : (
          <>
            <h2 className="grow text-2xl">
              {unsubscribeStatus.state === UnsubState.Success ? (
                <>Hūlō!</>
              ) : unsubscribeStatus.state === UnsubState.Error ? (
                <>E kala mai</>
              ) : null}
            </h2>
          </>
        )}

        <div className="flex flex-col gap-2 text-base text-secondary-foreground">
          {unsubscribeStatus.state === UnsubState.Error && (
            <p>
              Something went wrong here. The dang machine keeps buzzing{" "}
              <Code>{unsubscribeStatus.message}</Code>.
            </p>
          )}
          {unsubscribeStatus.state === UnsubState.Success && (
            <>
              <p>
                You’ve unsubscribed from the Hawaiians in Tech mailing list. You
                won’t receive any more newsletter updates from us.
              </p>
              <p>You can subscribe again at any time.</p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {unsubscribeStatus.state === UnsubState.Error ? (
            <Link className={buttonVariants()} href={DISCORD_URL}>
              Let us know on Discord
            </Link>
          ) : null}
          {unsubscribeStatus.state !== UnsubState.Loading && (
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={"/"}
            >
              Back to home
            </Link>
          )}
        </div>
      </div>
      {unsubscribeStatus.state === UnsubState.Success && (
        <p className="mt-2 text-center text-sm">
          Having issues?{" "}
          <Link href={DISCORD_URL} className="font-semibold">
            Let us know on Discord
          </Link>
        </p>
      )}
    </section>
  );
}
