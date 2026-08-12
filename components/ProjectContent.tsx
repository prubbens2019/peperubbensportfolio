"use client";

import ReactMarkdown from "react-markdown";
import { useLocalized } from "@/lib/locale-context";

export function ProjectContent({ contentNl, contentEn }: { contentNl: string; contentEn: string }) {
  const content = useLocalized(contentNl, contentEn);

  if (!content) return null;

  return (
    <div className="prose prose-headings:font-display prose-headings:text-wood-dark prose-p:text-wood-dark/85 mt-8 max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
