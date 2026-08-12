import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { CategoryHeading } from "@/components/CategoryHeading";
import { EmptyState } from "@/components/EmptyState";
import { getAllCategories, getCategory, getProjectsByCategory } from "@/lib/content";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: PageProps<"/categorie/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const projects = getProjectsByCategory(slug);

  return (
    <Container className="flex flex-col gap-10">
      <CategoryHeading category={category} />

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState nl="Nog geen projecten in deze categorie." en="No projects in this category yet." />
      )}
    </Container>
  );
}
