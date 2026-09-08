import fs from "fs";
import path from "path";
import type {
  CategoryMeta,
  Locale,
  Project,
  ProjectMeta,
  SiteConfig,
  Subportfolio,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CATEGORIES_DIR = path.join(CONTENT_DIR, "categories");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const CONFIG_DIR = path.join(CONTENT_DIR, "config");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(fallback)) return parsed as T;
  if (typeof fallback === "object" && fallback !== null) {
    return { ...fallback, ...parsed } as T;
  }
  return parsed as T;
}

function readTextIfExists(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8").trim();
}

function listSubdirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** Lists image files in a project sub-folder (e.g. `banner`, `bijfoto`), returned as
 * public URLs under `/content/...` — see scripts/sync-content-images.mjs. */
function listImages(projectSlug: string, subfolder: string): string[] {
  const dir = path.join(PROJECTS_DIR, projectSlug, subfolder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => `/content/projects/${projectSlug}/${subfolder}/${file}`);
}

function findCategoryCover(categorySlug: string, cover: string | null): string | null {
  if (!cover) return null;
  const filePath = path.join(CATEGORIES_DIR, categorySlug, cover);
  if (!fs.existsSync(filePath)) return null;
  return `/content/categories/${categorySlug}/${cover}`;
}

export function pickLocalized(nl: string, en: string, locale: Locale): string {
  if (locale === "en" && en && en.trim().length > 0) return en;
  return nl;
}

export function getSiteConfig(): SiteConfig {
  const site = readJson<SiteConfig>(path.join(CONFIG_DIR, "site.json"), {
    name: "",
    profile: "",
    profile_en: "",
    profilePhoto: "",
    birthdate: "",
    translationHash: "",
    social: { linkedin: "", email: "", phone: "", joseLogistics: "" },
  });

  if (site.profilePhoto) {
    const publicPath = path.join(process.cwd(), "public", site.profilePhoto);
    if (!fs.existsSync(publicPath)) site.profilePhoto = "";
  }

  return site;
}

interface CategoryVisibility {
  slug: string;
  visible: boolean;
}

function getCategoriesVisibility(): CategoryVisibility[] {
  return readJson<CategoryVisibility[]>(path.join(CONFIG_DIR, "categories.json"), []);
}

export function getAllCategories(): CategoryMeta[] {
  const visibility = new Map(getCategoriesVisibility().map((c) => [c.slug, c.visible]));

  const categories = listSubdirectories(CATEGORIES_DIR).map((slug): CategoryMeta => {
    const meta = readJson<Omit<CategoryMeta, "visible" | "slug">>(
      path.join(CATEGORIES_DIR, slug, "meta.json"),
      {
        title: slug,
        title_en: "",
        subtitle: "",
        subtitle_en: "",
        cover: null,
        order: 999,
        translationHash: "",
      }
    );
    return {
      slug,
      title: meta.title,
      title_en: meta.title_en,
      subtitle: meta.subtitle,
      subtitle_en: meta.subtitle_en,
      cover: findCategoryCover(slug, meta.cover),
      order: meta.order,
      visible: visibility.get(slug) ?? true,
      translationHash: meta.translationHash,
    };
  });

  return categories.sort((a, b) => a.order - b.order);
}

export function getVisibleCategories(): CategoryMeta[] {
  return getAllCategories().filter((c) => c.visible);
}

export function getCategory(slug: string): CategoryMeta | null {
  return getAllCategories().find((c) => c.slug === slug) ?? null;
}

export function getAllProjects(): Project[] {
  const projects = listSubdirectories(PROJECTS_DIR).map((slug): Project | null => {
    const projectJsonPath = path.join(PROJECTS_DIR, slug, "project.json");
    if (!fs.existsSync(projectJsonPath)) return null;

    const meta = readJson<ProjectMeta>(projectJsonPath, {
      slug,
      title: slug,
      title_en: "",
      subtitle: "",
      subtitle_en: "",
      category: "",
      visible: true,
      order: 999,
      role: "",
      year: "",
      tools: [],
      externalLink: "",
      translationHash: "",
    });

    return {
      ...meta,
      slug,
      content: readTextIfExists(path.join(PROJECTS_DIR, slug, "content.md")),
      content_en: readTextIfExists(path.join(PROJECTS_DIR, slug, "content.en.md")),
      banner: listImages(slug, "banner")[0] ?? null,
      images: listImages(slug, "bijfoto"),
    };
  });

  return (projects.filter(Boolean) as Project[]).sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | null {
  return getAllProjects().find((p) => p.slug === slug) ?? null;
}

export function getProjectsByCategory(
  categorySlug: string,
  { includeHidden = false }: { includeHidden?: boolean } = {}
): Project[] {
  return getAllProjects().filter(
    (p) => p.category === categorySlug && (includeHidden || p.visible)
  );
}

export function getSubportfolios(): Record<string, Omit<Subportfolio, "slug">> {
  return readJson<Record<string, Omit<Subportfolio, "slug">>>(
    path.join(CONFIG_DIR, "subportfolios.json"),
    {}
  );
}

export function getSubportfolio(slug: string): Subportfolio | null {
  const all = getSubportfolios();
  const entry = all[slug];
  if (!entry) return null;
  return { slug, ...entry };
}

export function getSubportfolioSlugs(): string[] {
  return Object.keys(getSubportfolios());
}
