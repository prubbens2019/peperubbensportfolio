import Link from "next/link";
import type { ReactNode } from "react";

const base = "inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150";

const variants = {
  primary: "bg-terracotta px-5 py-2.5 text-cream-soft hover:bg-terracotta-dark",
  ghost: "text-wood-dark hover:text-terracotta",
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
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const classes = `${base} ${variants[variant]} ${className}`;
  const content =
    variant === "ghost" ? (
      <>
        <span className="text-wood/40">[</span>
        <span>{children}</span>
        <span className="text-wood/40">]</span>
      </>
    ) : (
      children
    );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
