"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { hashText } from "./hash";
import { translateBatch, type TranslationItem } from "./translate";
import {
  getAllCategories,
  getAllProjects,
  getSiteConfig,
  getSubportfolios,
} from "./content";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CATEGORIES_DIR = path.join(CONTENT_DIR, "categories");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const CONFIG_DIR = path.join(CONTENT_DIR, "config");

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/pepbackend");
}

export async function toggleProjectVisibility(slug: string, visible: boolean) {
  const filePath = path.join(PROJECTS_DIR, slug, "project.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data.visible = visible;
  writeJson(filePath, data);
  revalidateAll();
}

export async function toggleCategoryVisibility(slug: string, visible: boolean) {
  const filePath = path.join(CONFIG_DIR, "categories.json");
  const list = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    slug: string;
    visible: boolean;
  }[];
  const entry = list.find((c) => c.slug === slug);
  if (entry) entry.visible = visible;
  else list.push({ slug, visible });
  writeJson(filePath, list);
  revalidateAll();
}

export interface SubportfolioInput {
  title: string;
  titleEn: string;
  categories: string[];
  projects: string[];
}

export async function saveSubportfolio(
  slug: string,
  input: SubportfolioInput,
  originalSlug?: string
) {
  const filePath = path.join(CONFIG_DIR, "subportfolios.json");
  const all = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (originalSlug && originalSlug !== slug) delete all[originalSlug];

  all[slug] = {
    title: input.title,
    title_en: input.titleEn,
    categories: input.categories,
    projects: input.projects,
  };

  writeJson(filePath, all);
  revalidateAll();
}

export async function deleteSubportfolio(slug: string) {
  const filePath = path.join(CONFIG_DIR, "subportfolios.json");
  const all = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  delete all[slug];
  writeJson(filePath, all);
  revalidateAll();
}

export interface TranslateSummary {
  translated: number;
  upToDate: number;
}

/** Scans all NL content and translates anything missing or stale since the last translation. */
export async function translateAllContent(): Promise<TranslateSummary> {
  let translated = 0;
  let upToDate = 0;

  const jobs: {
    kind: "site" | "category" | "project-fields" | "project-content";
    id: string;
    hash: string;
    items: TranslationItem[];
    write: (result: Record<string, string>) => void;
  }[] = [];

  const site = getSiteConfig();
  const siteSourceText = site.profile;
  const siteHash = hashText(siteSourceText);
  if (siteSourceText && (siteHash !== site.translationHash || !site.profile_en)) {
    jobs.push({
      kind: "site",
      id: "site",
      hash: siteHash,
      items: [{ id: "profile", text: site.profile }],
      write: (result) => {
        const filePath = path.join(CONFIG_DIR, "site.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        data.profile_en = result.profile ?? data.profile_en;
        data.translationHash = siteHash;
        writeJson(filePath, data);
      },
    });
  } else if (siteSourceText) {
    upToDate++;
  }

  for (const category of getAllCategories()) {
    const sourceText = `${category.title}\n${category.subtitle}`;
    const hash = hashText(sourceText);
    if (hash !== category.translationHash || !category.title_en) {
      jobs.push({
        kind: "category",
        id: category.slug,
        hash,
        items: [
          { id: "title", text: category.title },
          { id: "subtitle", text: category.subtitle },
        ],
        write: (result) => {
          const filePath = path.join(CATEGORIES_DIR, category.slug, "meta.json");
          const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          data.title_en = result.title ?? data.title_en;
          data.subtitle_en = result.subtitle ?? data.subtitle_en;
          data.translationHash = hash;
          writeJson(filePath, data);
        },
      });
    } else {
      upToDate++;
    }
  }

  for (const project of getAllProjects()) {
    const sourceText = `${project.title}\n${project.subtitle}\n${project.content}`;
    const hash = hashText(sourceText);
    if (hash !== project.translationHash || !project.title_en) {
      jobs.push({
        kind: "project-fields",
        id: project.slug,
        hash,
        items: [
          { id: "title", text: project.title },
          { id: "subtitle", text: project.subtitle },
          ...(project.content ? [{ id: "content", text: project.content }] : []),
        ],
        write: (result) => {
          const projectDir = path.join(PROJECTS_DIR, project.slug);
          const filePath = path.join(projectDir, "project.json");
          const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          data.title_en = result.title ?? data.title_en;
          data.subtitle_en = result.subtitle ?? data.subtitle_en;
          data.translationHash = hash;
          writeJson(filePath, data);

          if (result.content) {
            fs.writeFileSync(
              path.join(projectDir, "content.en.md"),
              result.content.trim() + "\n"
            );
          }
        },
      });
    } else {
      upToDate++;
    }
  }

  for (const job of jobs) {
    const result = await translateBatch(job.items);
    job.write(result);
    translated++;
  }

  if (translated > 0) revalidateAll();

  return { translated, upToDate };
}

export async function getSubportfoliosForAdmin() {
  return getSubportfolios();
}
