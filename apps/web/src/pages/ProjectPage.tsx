import { Container, Link, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link as RouterLink } from "react-router-dom";

import MDXLoader from "../components/MDXLoader";

// Load all MDX files from locales folders eagerly
const enDict = import.meta.glob("../locales/en/projects/*.mdx", {
  eager: true,
});
const roDict = import.meta.glob("../locales/ro/projects/*.mdx", {
  eager: true,
});

type EagerMdxModule = { default: React.ComponentType<Record<string, unknown>> };

function indexBySlug(
  dict: Record<string, unknown>
): Record<string, EagerMdxModule> {
  const out: Record<string, EagerMdxModule> = {};
  for (const [path, mod] of Object.entries(dict)) {
    const file = path.split("/").pop(); // "foo.mdx" or undefined

    if (!file) {
      continue;
    }

    const slug = file.replace(/\.mdx$/i, "");
    out[slug] = mod as EagerMdxModule;
  }
  return out;
}

const enIndexed = indexBySlug(enDict);
const roIndexed = indexBySlug(roDict);

export type EagerModulesMap = Record<string, EagerMdxModule | undefined>;

export default function ProjectPage(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const language = i18n.language;

  if (!slug) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Project not found
        </Typography>
        <Link component={RouterLink} to="/">
          Back to Home
        </Link>
      </Container>
    );
  }

  const modules = (
    language.startsWith("ro") ? roIndexed : enIndexed
  ) as EagerModulesMap;

  return (
    <MDXLoader
      slug={slug}
      language={language}
      modules={modules} // typed as EagerModulesMap
      pathPrefix="projects/"
      useErrorBoundary
      errorBoundaryFallback={
        <Typography>Failed to render project content</Typography>
      }
    />
  );
}
