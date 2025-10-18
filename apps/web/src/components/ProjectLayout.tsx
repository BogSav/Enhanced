import {
  Box,
  Breadcrumbs,
  Chip,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import type { ReactNode } from "react";

// Type for frontmatter, matching MDX frontmatter structure
type Frontmatter = {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
};

// Inline prop types for ProjectLayout to keep the file simple

// ProjectImage component
export function ProjectImage({ src }: { src: string }): React.ReactElement {
  return (
    <Box
      component="img"
      src={src}
      sx={{
        width: "60%",
        height: "auto",
        maxHeight: 600,
        borderRadius: 3,
        objectFit: "cover",
        my: 2,
      }}
    />
  );
}

// ProjectTag component
export function ProjectTag({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        mr: 1,
        mb: 1,
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        fontWeight: 500,
      }}
    />
  );
}

export default function ProjectLayout({
  children,
  frontmatter,
}: {
  children: ReactNode;
  frontmatter?: Frontmatter;
}): React.ReactElement {
  if (!frontmatter) {
    // Fallback: render children only if no frontmatter is found
    return <>{children}</>;
  }

  return (
    <Stack spacing={3}>
      {/* Navigation link */}
      <Breadcrumbs>
        <Link component={RouterLink} to="/">
          Home
        </Link>
        <Typography color="text.primary">{frontmatter.title}</Typography>
      </Breadcrumbs>

      {/* Main project content */}
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight={800}>
            {frontmatter.title}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {frontmatter.description}
          </Typography>

          {/* Render tags from frontmatter */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <Box>
              {frontmatter.tags.map((tag) => (
                <ProjectTag key={tag}>{tag}</ProjectTag>
              ))}
            </Box>
          )}

          {/* This is the actual MDX content of the project - it is stored in the children object*/}
          <Box>{children}</Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
