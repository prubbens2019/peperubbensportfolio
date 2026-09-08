export type Locale = "nl" | "en";

export interface SiteConfig {
  name: string;
  profile: string;
  profile_en: string;
  profilePhoto: string;
  birthdate: string;
  translationHash: string;
  social: {
    linkedin: string;
    email: string;
    phone: string;
    joseLogistics: string;
  };
}

export interface CategoryMeta {
  slug: string;
  title: string;
  title_en: string;
  subtitle: string;
  subtitle_en: string;
  cover: string | null;
  order: number;
  visible: boolean;
  translationHash: string;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  title_en: string;
  subtitle: string;
  subtitle_en: string;
  category: string;
  visible: boolean;
  order: number;
  role: string;
  year: string;
  tools: string[];
  externalLink: string;
  translationHash: string;
}

export interface Project extends ProjectMeta {
  content: string;
  content_en: string;
  banner: string | null;
  images: string[];
}

export interface Subportfolio {
  slug: string;
  title: string;
  title_en: string;
  /** Project slugs per fixed subportfolio section (see lib/subportfolio-sections.ts). */
  assignments: Record<string, string[]>;
}
