"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ClipboardText, SquaresFour, User } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: House },
  { href: "/menu", label: "Menu", icon: SquaresFour },
  { href: "/orders", label: "Orders", icon: ClipboardText },
  { href: "/profile", label: "Profile", icon: User },
];

export function ConsumerBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon weight={isActive ? "fill" : "regular"} className="size-6" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
