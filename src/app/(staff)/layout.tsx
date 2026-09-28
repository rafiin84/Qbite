"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StaffHeader } from "@/components/navigation/staff-header";
import { OfflineBanner } from "@/components/feedback/offline-banner";
import { useSessionStore } from "@/store/session-store";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useSessionStore((s) => s.role);

  useEffect(() => {
    if (role !== "staff") router.replace("/staff-login");
  }, [role, router]);

  if (role !== "staff") return null;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <OfflineBanner />
      <StaffHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
