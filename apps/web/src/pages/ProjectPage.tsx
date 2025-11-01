import { Container, Link, Typography } from "@mui/material";
import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";

import MDXLoader from "../components/MDXLoader";
import { getProjectModules } from "../content/projects";

export default function ProjectPage(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();

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

  const modules = getProjectModules();

  return (
    <MDXLoader
      slug={slug}
      modules={modules}
      pathPrefix="projects/"
      useErrorBoundary
      errorBoundaryFallback={
        <Typography>Failed to render project content</Typography>
      }
    />
  );
}
