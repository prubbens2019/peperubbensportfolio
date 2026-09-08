import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Profile } from "@/components/Profile";
import { CategorySection } from "@/components/CategorySection";
import { getAllProjects, getCategory, getSiteConfig, getSubportfolio, getSubportfolioSlugs } from "@/lib/content";
import { SUBPORTFOLIO_SECTIONS } from "@/lib/subportfolio-sections";
import type { CategoryMeta, Project } from "@/lib/types";

export function generateStaticParams() {
  return getSubportfolioSlugs().map((slug) => ({ subportfolio: slug }));
}

export default async function SubportfolioPage({ params }: PageProps<"/[subportfolio]">) {
  const { subportfolio: slug } = await params;
  const subportfolio = getSubportfolio(slug);
  if (!subportfolio) notFound();

  const site = getSiteConfig();
  const allProjects = getAllProjects();

  const sections = SUBPORTFOLIO_SECTIONS.map(
    (sectionSlug): { category: CategoryMeta; projects: Project[] } | null => {
      const category = getCategory(sectionSlug);
      if (!category) return null;
      const slugs = subportfolio.assignments[sectionSlug] ?? [];
      const projects = slugs
        .map((s) => allProjects.find((p) => p.slug === s))
        .filter((p): p is Project => Boolean(p));
      if (projects.length === 0) return null;
      return { category, projects };
    }
  ).filter((section): section is { category: CategoryMeta; projects: Project[] } => section !== null);

  return (
    <Container className="flex flex-col gap-16">
      <Profile site={site} titleNl={subportfolio.title} titleEn={subportfolio.title_en} />

      {sections.map(({ category, projects }) => (
        <CategorySection
          key={category.slug}
          category={category}
          projects={projects}
          from={`/${slug}`}
        />
      ))}
    </Container>
  );
}
