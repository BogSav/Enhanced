import { Container, Link, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link as RouterLink } from "react-router-dom";

import MDXLoader, { type ModulesMap } from "../components/MDXLoader";

// Prepare modules map and pass to shared MDXLoader - same as in InfoPage.tsx
const roModules = import.meta.glob("../locales/ro/projects/*.mdx");
const enModules = import.meta.glob("../locales/en/projects/*.mdx");

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
    language.startsWith("ro") ? roModules : enModules
  ) as ModulesMap;

  return (
    <MDXLoader
      slug={slug}
      language={language}
      modules={modules}
      pathPrefix={"projects/"}
      useErrorBoundary
      errorBoundaryFallback={
        <Typography>Failed to render project content</Typography>
      }
    />
  );
}
