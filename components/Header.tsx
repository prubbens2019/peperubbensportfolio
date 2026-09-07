import Link from "next/link";
import { Container } from "./Container";
import { LanguageToggle } from "./LanguageToggle";

export function Header({ linkHome = true }: { linkHome?: boolean }) {
  return (
    <header className="py-6">
      <Container className="flex items-center justify-between">
        {linkHome ? (
          <Link href="/" className="font-display text-xl font-semibold text-wood-dark">
            Pepe Rubbens
          </Link>
        ) : (
          <span className="font-display text-xl font-semibold text-wood-dark">Pepe Rubbens</span>
        )}
        <LanguageToggle />
      </Container>
    </header>
  );
}
