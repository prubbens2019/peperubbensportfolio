import { PepbackendDashboard } from "@/components/pepbackend/PepbackendDashboard";
import { getAllCategories, getAllProjects, getSubportfolios } from "@/lib/content";

export default function PepbackendPage() {
  const categories = getAllCategories();
  const projects = getAllProjects();
  const subportfolios = getSubportfolios();

  return (
    <PepbackendDashboard
      categories={categories}
      projects={projects}
      subportfolios={subportfolios}
    />
  );
}
