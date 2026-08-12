"use client";

import Image from "next/image";
import { useLocalized } from "@/lib/locale-context";
import type { SiteConfig } from "@/lib/types";
import { Button } from "./Button";

export function Profile({
  site,
  titleNl,
  titleEn,
}: {
  site: SiteConfig;
  titleNl?: string;
  titleEn?: string;
}) {
  const profile = useLocalized(site.profile, site.profile_en);
  const paragraphs = profile.split(/\n{2,}/).filter(Boolean);
  const title = useLocalized(titleNl ?? site.name, titleEn ?? site.name);

  const hasPhoto = Boolean(site.profilePhoto);
  const { linkedin, email, joseLogistics } = site.social;

  return (
    <div className="texture-grain flex flex-col items-center gap-6 rounded-3xl bg-cream-soft/70 px-6 py-12 text-center sm:px-12">
      {hasPhoto && (
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-sand shadow-sm sm:h-40 sm:w-40">
          <Image src={site.profilePhoto} alt={site.name} fill className="object-cover" />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {paragraphs.length > 0 && (
          <div className="mx-auto mt-4 max-w-xl space-y-3 text-balance text-wood-dark/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {(linkedin || email || joseLogistics) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
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
