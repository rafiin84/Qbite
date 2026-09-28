"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WifiSlash } from "@phosphor-icons/react/dist/ssr";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="status"
          className="flex items-center justify-center gap-2 bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          <WifiSlash className="size-4" weight="bold" aria-hidden />
          You&apos;re offline. Showing the latest saved information.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
