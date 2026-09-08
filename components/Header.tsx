import Link from "next/link";
import { Container } from "./Container";
import { LanguageToggle } from "./LanguageToggle";

export function Header({ linkHome = true }: { linkHome?: boolean }) {
  return (
    <header className="border-b border-wood/15 py-5">
      <Container className="flex items-center justify-between">
        {linkHome ? (
          <Link href="/" className="font-display text-lg font-extrabold tracking-tight text-wood-dark">
            Pepe Rubbens
          </Link>
        ) : (
          <span className="font-display text-lg font-extrabold tracking-tight text-wood-dark">
            Pepe Rubbens
          </span>
        )}
        <LanguageToggle />
      </Container>
    </header>
  );
}
