"use client";

import Image from "next/image";
import { useLocale, useLocalized } from "@/lib/locale-context";
import type { SiteConfig } from "@/lib/types";
import { Button } from "./Button";

function formatBirthdate(iso: string, locale: "nl" | "en"): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function calculateAge(iso: string): number | null {
  const birth = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export function Profile({
  site,
  titleNl,
  titleEn,
}: {
  site: SiteConfig;
  titleNl?: string;
  titleEn?: string;
}) {
  const { locale } = useLocale();
  const profile = useLocalized(site.profile, site.profile_en);
  const paragraphs = profile.split(/\n{2,}/).filter(Boolean);
  const title = useLocalized(titleNl ?? site.name, titleEn ?? site.name);
  const yearsLabel = useLocalized("jaar", "yrs");
  const age = site.birthdate ? calculateAge(site.birthdate) : null;

  const hasPhoto = Boolean(site.profilePhoto);
  const { linkedin, email, phone, joseLogistics } = site.social;

  return (
    <div className="border-b border-wood/15 pb-12">
      {hasPhoto && (
        <div className="relative mb-6 h-28 w-28 overflow-hidden border border-wood/15 bg-sand sm:h-32 sm:w-32">
          <Image src={site.profilePhoto} alt={site.name} fill className="object-cover" />
        </div>
      )}

      <p className="label-mono flex items-center gap-2 text-terracotta">
        <span className="h-1.5 w-1.5 bg-terracotta" />
        01 / Profiel
      </p>

      <div className="mt-3 flex gap-4 sm:gap-6">
        <span className="mt-1 hidden w-2 shrink-0 bg-terracotta sm:block" />
        <div>
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          {paragraphs.length > 0 && (
            <div className="mt-4 max-w-xl space-y-3 text-wood-dark/70">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {(email || phone || site.birthdate) && (
        <div className="label-mono mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-wood/60">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {site.birthdate && (
            <span>
              {formatBirthdate(site.birthdate, locale)}
              {age !== null && ` · ${age} ${yearsLabel}`}
            </span>
          )}
        </div>
      )}

      {(linkedin || email || phone || joseLogistics) && (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          {linkedin && (
            <Button href={linkedin} variant="ghost">
              LinkedIn
            </Button>
          )}
          {email && (
            <Button href={`mailto:${email}`} variant="ghost">
              E-mail
            </Button>
          )}
          {phone && (
            <Button href={`tel:${phone.replace(/[^+\d]/g, "")}`} variant="ghost">
              Bel
            </Button>
          )}
          {joseLogistics && (
            <Button href={joseLogistics} variant="ghost">
              Jose Logistics
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
