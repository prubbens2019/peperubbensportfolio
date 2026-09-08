"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocalized } from "@/lib/locale-context";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, from }: { project: Project; from?: string }) {
  const title = useLocalized(project.title, project.title_en);
  const subtitle = useLocalized(project.subtitle, project.subtitle_en);
  const href = from
    ? `/project/${project.slug}?from=${encodeURIComponent(from)}`
    : `/project/${project.slug}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden border border-wood/15 bg-cream-soft transition-colors duration-150 hover:border-terracotta"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
        {project.banner ? (
          <Image
            src={project.banner}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-wood/40">
            <span className="font-display text-2xl">{title.slice(0, 1)}</span>
          </div>
        )}
      </div>
      <div className="border-t border-wood/15 p-5">
        <h3 className="text-lg font-bold">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-wood/60">{subtitle}</p>}
      </div>
    </Link>
  );
}
