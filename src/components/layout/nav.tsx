"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const links = [
  { href: "", label: "home" },
  { href: "/extension", label: "extension" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[var(--spacing-xl)] py-[var(--spacing-md)] backdrop-blur-[6.25px] max-sm:px-[var(--spacing-md)]">
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] text-[var(--text-nav)] text-[var(--color-content)] tracking-[-0.246857px]"
      >
        GTimer
      </Link>
      <div className="flex items-center gap-[var(--spacing-lg)]">
        {links.map(({ href, label }) => {
          const isActive =
            href === ""
              ? pathname === `/${href}` || pathname === `/${href}/`
              : pathname.includes(href);
          return (
            <Link
              key={href}
              href={href || "/"}
              className={cn(
                "font-[family-name:var(--font-body)] text-[var(--text-nav)] transition-colors",
                isActive
                  ? "text-[var(--color-content)]"
                  : "text-[var(--color-content-secondary)] hover:text-[var(--color-content)]",
              )}
            >
              {t(label)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
