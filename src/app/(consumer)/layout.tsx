"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConsumerHeader } from "@/components/navigation/consumer-header";
import { ConsumerBottomNav } from "@/components/navigation/consumer-bottom-nav";
import { OfflineBanner } from "@/components/feedback/offline-banner";
import { useSessionStore } from "@/store/session-store";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useSessionStore((s) => s.role);

  useEffect(() => {
    if (role !== "consumer") router.replace("/auth");
  }, [role, router]);

  if (role !== "consumer") return null;

  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <ConsumerHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-24 pt-5 sm:px-6 md:pb-10">
        {children}
      </main>
      <ConsumerBottomNav />
    </div>
  );
}
