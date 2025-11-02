import { Container, Link, Typography } from "@mui/material";
import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";

import MDXLoader from "../components/MDXLoader";
import ui from "../content/parsers/UiTomlParser";
import { getProjectModules } from "../content/ProjectsLoader";

export default function ProjectPage(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {ui.projectPage.notFoundTitle}
        </Typography>
        <Link component={RouterLink} to="/">
          {ui.projectPage.backHome}
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
        <Typography>{ui.mdxLoader.errorRenderFallback}</Typography>
      }
    />
  );
}
