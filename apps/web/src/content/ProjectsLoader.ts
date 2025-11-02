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

// Lazy loaders for the full MDX components - single source of truth
const lazyModules = import.meta.glob("../content/projects/*.mdx");

function slugFromPath(path: string): string {
  const file = path.split("/").pop() || "";
  return file.replace(/\.mdx$/i, "");
}

// Cache for loaded frontmatter to avoid multiple dynamic imports
let metadataCache: ProjectMetadata[] | null = null;

// Extract project metadata from frontmatter for displaying the project cards
// This now loads frontmatter dynamically on first call, then caches the result
export async function getProjectMetadata(): Promise<ProjectMetadata[]> {
  if (metadataCache) {
    return metadataCache;
  }

  const metadataPromises = Object.entries(lazyModules).map(
    async ([path, loader]) => {
      const slug = slugFromPath(path);

      // Load the module to access frontmatter
      const module = (await loader()) as { frontmatter?: ProjectFrontmatter };
      const fm = module.frontmatter ?? {};

      return {
        slug,
        title: fm.title ?? slug,
        description: fm.description ?? "",
        tags: Array.isArray(fm.tags) ? fm.tags.slice() : [],
        status: fm.status ?? "",
      } satisfies ProjectMetadata;
    }
  );

  metadataCache = await Promise.all(metadataPromises);
  return metadataCache;
}

// Build a ModulesMap keyed by slug -> lazy loader function
export function getProjectModules(): ModulesMap {
  const out: ModulesMap = {};

  for (const [path, loader] of Object.entries(lazyModules)) {
    const slug = slugFromPath(path);
    out[slug] = loader as ModulesMap[string];
  }
  return out;
}
