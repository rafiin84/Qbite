"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { QBiteWordmark } from "@/components/branding/qbite-wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  consumerLoginSchema,
  consumerSignUpSchema,
  type ConsumerLoginValues,
  type ConsumerSignUpValues,
} from "@/lib/validation/auth";
import { useConsumerLogin, useConsumerSignUp } from "@/features/auth/hooks";
import { consumers } from "@/lib/mock/seed-users";
import { cn } from "@/lib/utils";
import Link from "next/link";

const demoAccounts = consumers.map((c) => ({ name: c.name.split(" ")[0], email: c.email }));

export default function ConsumerAuthPage() {
  const router = useRouter();
  const login = useConsumerLogin();
  const signUp = useConsumerSignUp();

  const loginForm = useForm<ConsumerLoginValues>({
    resolver: zodResolver(consumerLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<ConsumerSignUpValues>({
    resolver: zodResolver(consumerSignUpSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  function handleLogin(values: ConsumerLoginValues) {
    login.mutate(values.email, { onSuccess: () => router.replace("/home") });
  }

  function handleSignUp(values: ConsumerSignUpValues) {
    signUp.mutate(values, { onSuccess: () => router.replace("/home") });
  }

  function fillDemo(email: string) {
    loginForm.setValue("email", email, { shouldValidate: true });
    loginForm.setValue("password", "demopass", { shouldValidate: true });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex w-full max-w-sm flex-col gap-8"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <QBiteWordmark size={36} />
          <p className="text-sm text-muted-foreground">
            Sign in with your institution account to order from your canteen.
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-5">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-email">College email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@abc.edu"
                  autoComplete="email"
                  {...loginForm.register("email")}
                />
                <FieldError message={loginForm.formState.errors.email?.message} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...loginForm.register("password")}
                />
                <FieldError message={loginForm.formState.errors.password?.message} />
              </div>

              {login.isError ? <FormAlert message={login.error.message} /> : null}

              <Button type="submit" disabled={login.isPending} className="mt-1 h-11">
                {login.isPending ? "Signing in…" : "Log in"}
              </Button>

              <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-3.5">
                <p className="text-xs font-medium text-muted-foreground">Demo accounts · password: demopass</p>
                <div className="flex flex-col gap-1.5">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => fillDemo(account.email)}
                      className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-left text-xs transition-colors hover:bg-accent"
                    >
                      <span className="font-medium text-foreground">{account.name}</span>
                      <span className="text-muted-foreground">{account.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-5">
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-name">Full name</Label>
                <Input id="signup-name" placeholder="Ananya Iyer" autoComplete="name" {...signUpForm.register("name")} />
                <FieldError message={signUpForm.formState.errors.name?.message} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-email">College email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@abc.edu"
                  autoComplete="email"
                  {...signUpForm.register("email")}
                />
                <FieldError message={signUpForm.formState.errors.email?.message} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-phone">Phone number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="9876543210"
                  autoComplete="tel"
                  {...signUpForm.register("phone")}
                />
                <FieldError message={signUpForm.formState.errors.phone?.message} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...signUpForm.register("password")}
                />
                <FieldError message={signUpForm.formState.errors.password?.message} />
              </div>

              <p className="text-xs text-muted-foreground">
                You&apos;ll be added to <span className="font-medium text-foreground">ABC College · Main Canteen</span>.
              </p>

              <Button type="submit" disabled={signUp.isPending} className="mt-1 h-11">
                {signUp.isPending ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground">
          Canteen staff?{" "}
          <Link href="/staff-login" className="font-medium text-foreground underline-offset-2 hover:underline">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className={cn("flex items-center gap-1 text-xs text-destructive")} role="alert">
      <WarningCircle className="size-3.5" weight="fill" aria-hidden />
      {message}
    </p>
  );
}

function FormAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
      <WarningCircle className="size-4 shrink-0" weight="fill" aria-hidden />
      {message}
    </div>
  );
}
