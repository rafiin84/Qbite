"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ClipboardText, SquaresFour, User } from "@phosphor-icons/react/dist/ssr";
import { QBiteWordmark } from "@/components/branding/qbite-wordmark";
import { CartBadge } from "@/components/cart/cart-badge";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: House },
  { href: "/menu", label: "Menu", icon: SquaresFour },
  { href: "/orders", label: "Orders", icon: ClipboardText },
  { href: "/profile", label: "Profile", icon: User },
];

export function ConsumerHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/home" className="shrink-0">
          <QBiteWordmark size={30} />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
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

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <NotificationBell />
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
