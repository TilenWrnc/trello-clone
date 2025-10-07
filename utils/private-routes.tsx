"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";

export function checkForSession() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/sign-in");
    }
  }, [router]);

  return { session };
}