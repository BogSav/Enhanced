import { Container, Link, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link as RouterLink } from "react-router-dom";

import MDXLoader from "../components/MDXLoader";
import { getProjectModules } from "../content/projects";

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

  const modules = getProjectModules(language);

  return (
    <MDXLoader
      slug={slug}
      language={language}
      modules={modules}
      pathPrefix="projects/"
      useErrorBoundary
      errorBoundaryFallback={
        <Typography>Failed to render project content</Typography>
      }
    />
  );
}
