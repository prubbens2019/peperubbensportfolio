import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-150";

const variants = {
  primary: "bg-terracotta text-cream-soft hover:bg-terracotta-dark",
  ghost: "border border-wood/30 text-wood-dark hover:bg-sand/60",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
