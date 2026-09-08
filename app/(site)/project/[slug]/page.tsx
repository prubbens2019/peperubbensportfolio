import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ProjectHeader } from "@/components/ProjectHeader";
import { ProjectContent } from "@/components/ProjectContent";
import { Carousel } from "@/components/Carousel";
import { BackLink } from "@/components/BackLink";
import { getAllProjects, getProject } from "@/lib/content";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: PageProps<"/project/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <Container className="max-w-3xl">
      <BackLink href={`/categorie/${project.category}`} />

      {project.banner && (
        <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden border border-wood/15 bg-sand">
          <Image src={project.banner} alt={project.title} fill priority className="object-cover" />
        </div>
      )}

      <ProjectHeader project={project} />
      <ProjectContent contentNl={project.content} contentEn={project.content_en} />

      {project.images.length > 0 && <Carousel images={project.images} alt={project.title} />}
    </Container>
  );
}
