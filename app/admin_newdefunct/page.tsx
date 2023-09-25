"use client";
import { useUserSession } from "@/lib/hooks";
import { useEffect, useState } from "react";

export default function Page() {
  const { userData } = useUserSession();
  const [greeting, setGreetings] = useState<
    "Aloha kakahiaka" | "Aloha auinalā" | "Aloha ahiahi" | "Hello"
  >();
  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreetings("Aloha kakahiaka");
    } else if (hour < 18) {
      setGreetings("Aloha auinalā");
    } else {
      setGreetings("Aloha ahiahi");
    }
  }, []);

  {
    return (
      userData && (
        <>
          <div className="p-4">
            <h1 className="py-8 text-5xl font-semibold">
              {greeting}, {userData?.name}!
            </h1>
          </div>
        </>
      )
    );
  }
}
