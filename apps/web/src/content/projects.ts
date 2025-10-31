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

// Eagerly import only the named `frontmatter` export to avoid pulling full components
const enFrontmatter = import.meta.glob("../locales/en/projects/*.mdx", {
  eager: true,
  import: "frontmatter",
});
const roFrontmatter = import.meta.glob("../locales/ro/projects/*.mdx", {
  eager: true,
  import: "frontmatter",
});

// Lazily import the MDX modules for rendering
const enModulesLazy = import.meta.glob("../locales/en/projects/*.mdx");
const roModulesLazy = import.meta.glob("../locales/ro/projects/*.mdx");

function langKey(language: string): "en" | "ro" {
  return language && language.toLowerCase().startsWith("ro") ? "ro" : "en";
}

function slugFromPath(path: string): string {
  const file = path.split("/").pop() || "";
  return file.replace(/\.mdx$/i, "");
}

// Extract project metadata from frontmatter for displaying the project cards, and add slug for routing
// This function returns an array of ProjectMetadata objects
export function getProjectMetadata(language: string): ProjectMetadata[] {
  const fmDict = langKey(language) === "ro" ? roFrontmatter : enFrontmatter;

  return Object.entries(fmDict).map(([path, fmUnknown]) => {
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
export function getProjectModules(language: string): ModulesMap {
  const dict = langKey(language) === "ro" ? roModulesLazy : enModulesLazy;
  const out: ModulesMap = {};
  
  for (const [path, loader] of Object.entries(dict)) {
    const slug = slugFromPath(path);
    out[slug] = loader as ModulesMap[string];
  }
  return out;
}
