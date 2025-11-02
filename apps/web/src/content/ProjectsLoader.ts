// Centralized project content registry for MDX files
// - Exposes metadata (from MDX frontmatter) for listing
// - Exposes modules map (lazy loaders) for rendering

import type { ModulesMap } from "../components/MDXLoader";
import type { ProjectMetadata } from "../components/ProjectCard";

// Frontmatter shape as exported by remark-mdx-frontmatter plugin
export type ProjectFrontmatter = {
  title?: string;
  description?: string;
  tags?: string[];
  status?: string;
};

// Eagerly import only the named `frontmatter` export to avoid pulling full components (English-only)
const frontmatterAll = import.meta.glob("../content/projects/*.mdx", {
  eager: true,
  import: "frontmatter",
});

// Lazily import the MDX modules for rendering (English-only)
const modulesLazy = import.meta.glob("../content/projects/*.mdx");

function slugFromPath(path: string): string {
  const file = path.split("/").pop() || "";
  return file.replace(/\.mdx$/i, "");
}

// Extract project metadata from frontmatter for displaying the project cards, and add slug for routing
// This function returns an array of ProjectMetadata objects
export function getProjectMetadata(): ProjectMetadata[] {
  return Object.entries(frontmatterAll).map(([path, fmUnknown]) => {
    const slug = slugFromPath(path);
    const fm = (fmUnknown ?? {}) as ProjectFrontmatter;

    return {
      slug,
      title: fm.title ?? slug,
      description: fm.description ?? "",
      tags: Array.isArray(fm.tags) ? fm.tags.slice() : [],
      status: fm.status ?? "",
    } satisfies ProjectMetadata;
  });
}

// Build a ModulesMap keyed by slug -> lazy loader function
export function getProjectModules(): ModulesMap {
  const dict = modulesLazy;
  const out: ModulesMap = {};

  for (const [path, loader] of Object.entries(dict)) {
    const slug = slugFromPath(path);
    out[slug] = loader as ModulesMap[string];
  }
  return out;
}
