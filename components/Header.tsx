import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { LanguageToggle } from "./LanguageToggle";

const nameClass = "font-display text-lg font-extrabold tracking-tight text-wood-dark";

function Brand() {
  return (
    <span className="flex items-center gap-3">
      <Image src="/logo.png" alt="" width={58} height={28} unoptimized priority className="h-7 w-auto" />
      <span className={nameClass}>Pepe Rubbens</span>
    </span>
  );
}

export function Header({ linkHome = true }: { linkHome?: boolean }) {
  return (
    <header className="border-b border-wood/15 py-5">
      <Container className="flex items-center justify-between">
        {linkHome ? (
          <Link href="/" aria-label="Pepe Rubbens">
            <Brand />
          </Link>
        ) : (
          <Brand />
        )}
        <LanguageToggle />
      </Container>
    </header>
  );
}
