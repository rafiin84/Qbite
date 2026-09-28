"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { WarningCircle, Storefront } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { QBiteLogo } from "@/components/branding/qbite-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staffLoginSchema, type StaffLoginValues } from "@/lib/validation/auth";
import { useStaffLogin } from "@/features/auth/hooks";
import { staffMembers } from "@/lib/mock/seed-users";

export default function StaffLoginPage() {
  const router = useRouter();
  const login = useStaffLogin();

  const form = useForm<StaffLoginValues>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  function handleSubmit(values: StaffLoginValues) {
    login.mutate(values.email, { onSuccess: () => router.replace("/staff/dashboard") });
  }

  function fillDemo(email: string) {
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", "demopass", { shouldValidate: true });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-foreground px-4 py-10 dark:bg-background">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex w-full max-w-sm flex-col gap-8 rounded-3xl bg-background p-7 shadow-xl"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Storefront className="size-7 text-primary" weight="fill" aria-hidden />
          </div>
          <div className="flex items-center gap-2">
            <QBiteLogo size={22} />
            <span className="font-heading text-lg font-semibold text-foreground">QBite Staff</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Canteen operations console. Manage incoming orders and the live queue.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-email">Staff email</Label>
            <Input
              id="staff-email"
              type="email"
              placeholder="you@abccanteen.in"
              autoComplete="email"
              {...form.register("email")}
            />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-password">Password</Label>
            <Input
              id="staff-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...form.register("password")}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>

          {login.isError ? (
            <div role="alert" className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              <WarningCircle className="size-4 shrink-0" weight="fill" aria-hidden />
              {login.error.message}
            </div>
          ) : null}

          <Button type="submit" disabled={login.isPending} className="mt-1 h-11">
            {login.isPending ? "Signing in…" : "Sign in to console"}
          </Button>

          <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-3.5">
            <p className="text-xs font-medium text-muted-foreground">Demo staff accounts · password: demopass</p>
            <div className="flex flex-col gap-1.5">
              {staffMembers.map((staff) => (
                <button
                  key={staff.email}
                  type="button"
                  onClick={() => fillDemo(staff.email)}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-left text-xs transition-colors hover:bg-accent"
                >
                  <span className="font-medium text-foreground">{staff.name}</span>
                  <span className="text-muted-foreground">{staff.email}</span>
                </button>
              ))}
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Ordering food?{" "}
          <Link href="/auth" className="font-medium text-foreground underline-offset-2 hover:underline">
            Go to consumer login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-destructive" role="alert">
      <WarningCircle className="size-3.5" weight="fill" aria-hidden />
      {message}
    </p>
  );
}
