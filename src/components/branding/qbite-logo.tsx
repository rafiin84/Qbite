import { cn } from "@/lib/utils";

export function QBiteLogo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="QBite logo"
    >
      <rect width="40" height="40" rx="12" className="fill-primary" />
      <path
        d="M13 16.5C13 13.4624 15.4624 11 18.5 11H21.5C24.5376 11 27 13.4624 27 16.5V19.5C27 22.5376 24.5376 25 21.5 25H19.8L21.6 28.2C21.9 28.75 21.5 29.4 20.85 29.4H19.4C19.05 29.4 18.72 29.2 18.55 28.9L16.35 25H18.5C15.4624 25 13 22.5376 13 19.5V16.5Z"
        className="fill-primary-foreground"
      />
      <circle cx="18" cy="17.7" r="1.6" className="fill-primary" />
      <circle cx="22.2" cy="17.7" r="1.6" className="fill-primary" />
    </svg>
  );
}
