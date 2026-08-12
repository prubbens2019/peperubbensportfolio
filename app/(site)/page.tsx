import { Container } from "@/components/Container";
import { Profile } from "@/components/Profile";
import { CategoryCard } from "@/components/CategoryCard";
import { getSiteConfig, getVisibleCategories } from "@/lib/content";

export default function HomePage() {
  const site = getSiteConfig();
  const categories = getVisibleCategories();

  return (
    <Container className="flex flex-col gap-16">
      <Profile site={site} />

      {categories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      )}
    </Container>
  );
}
