/** Fixed set of categories used to organize content within a sub-portfolio,
 * independent of a project's real category on the main site. */
export const SUBPORTFOLIO_SECTIONS = [
  "relevante-werkervaring",
  "opleiding",
  "extra-activiteiten",
] as const;

export type SubportfolioSection = (typeof SUBPORTFOLIO_SECTIONS)[number];

export function emptyAssignments(): Record<SubportfolioSection, string[]> {
  return {
    "relevante-werkervaring": [],
    opleiding: [],
    "extra-activiteiten": [],
  };
}
