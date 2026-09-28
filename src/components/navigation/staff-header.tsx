"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SquaresFour, ClipboardText, Clock, Archive, SignOut } from "@phosphor-icons/react/dist/ssr";
import { QBiteLogo } from "@/components/branding/qbite-logo";
import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/staff/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: "/staff/queue", label: "Live Queue", icon: ClipboardText },
  { href: "/staff/upcoming", label: "Upcoming", icon: Clock },
  { href: "/staff/history", label: "History", icon: Archive },
];

export function StaffHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const staff = useSessionStore((s) => s.staff);
  const logout = useSessionStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <QBiteLogo size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-semibold text-foreground">QBite Staff</span>
            <span className="text-xs text-muted-foreground">Main Canteen</span>
          </div>
        </div>

        <nav aria-label="Staff" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon weight={isActive ? "fill" : "regular"} className="size-4" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {staff ? (
            <div className="hidden text-right text-xs leading-tight sm:block">
              <p className="font-medium text-foreground">{staff.name}</p>
              <p className="text-muted-foreground">{staff.title}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/staff-login");
            }}
            aria-label="Sign out"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <SignOut className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <nav aria-label="Staff" className="border-t border-border md:hidden">
        <ul className="flex items-stretch justify-between px-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 text-[11px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon weight={isActive ? "fill" : "regular"} className="size-5" aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
