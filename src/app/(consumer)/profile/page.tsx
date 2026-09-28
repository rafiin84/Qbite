"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignOut, Buildings, Storefront, EnvelopeSimple, Phone, Flask } from "@phosphor-icons/react/dist/ssr";
import { useSessionStore } from "@/store/session-store";
import { useCanteen } from "@/features/menu/hooks";
import { setCanteenStatusDemo } from "@/lib/api/canteen";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const consumer = useSessionStore((s) => s.consumer);
  const logout = useSessionStore((s) => s.logout);
  const canteenQuery = useCanteen();

  const initials = consumer?.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function toggleCanteenDemo(nextOpen: boolean) {
    await setCanteenStatusDemo(nextOpen ? "open" : "closed");
    await queryClient.invalidateQueries({ queryKey: queryKeys.canteen });
    toast.info(nextOpen ? "Canteen marked open" : "Canteen marked closed", {
      description: "Demo control -- lets you preview both ordering flows.",
    });
  }

  if (!consumer) return null;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Profile</h1>

      <div className="flex items-center gap-4 rounded-3xl border border-border bg-card px-5 py-5">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {initials}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="font-heading text-lg font-semibold text-foreground">{consumer.name}</p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <EnvelopeSimple className="size-4" aria-hidden />
            {consumer.email}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="size-4" aria-hidden />
            {consumer.phone}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card px-5 py-5">
        <h2 className="text-sm font-semibold text-muted-foreground">Institution</h2>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <Buildings className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{canteenQuery.data?.institution.name}</span>
            <span className="text-xs text-muted-foreground">{canteenQuery.data?.institution.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <Storefront className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{canteenQuery.data?.canteen.name}</span>
            <span className="text-xs text-muted-foreground">{canteenQuery.data?.canteen.location}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-border px-5 py-5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Flask className="size-4" aria-hidden />
          Demo controls
        </h2>
        <p className="text-xs text-muted-foreground">
          Phase 1 has no admin console yet -- use this to preview both the live-order and pre-order experiences.
        </p>
        <div className="flex items-center justify-between">
          <Label htmlFor="canteen-open-toggle" className="text-sm font-normal text-foreground">
            Canteen is open
          </Label>
          <Switch
            id="canteen-open-toggle"
            checked={canteenQuery.data?.canteen.status === "open"}
            onCheckedChange={toggleCanteenDemo}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          logout();
          router.replace("/auth");
        }}
        className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
      >
        <SignOut className="size-4" aria-hidden />
        Sign out
      </button>
    </div>
  );
}
