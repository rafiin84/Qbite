"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QBiteLogo } from "@/components/branding/qbite-logo";
import { useSessionStore } from "@/store/session-store";

export default function SplashPage() {
  const router = useRouter();
  const role = useSessionStore((s) => s.role);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role === "consumer") router.replace("/home");
      else if (role === "staff") router.replace("/staff/dashboard");
      else router.replace("/auth");
    }, 1300);
    return () => clearTimeout(timer);
  }, [role, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <QBiteLogo size={84} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex flex-col items-center gap-1.5"
      >
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">QBite</h1>
        <p className="text-sm font-medium text-muted-foreground">Order. Track. Collect.</p>
      </motion.div>
    </div>
  );
}
