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
import { useTranslation } from "react-i18next";
import { useParams, Link as RouterLink } from "react-router-dom";

import type { ReactNode } from "react";

type ProjectLayoutProps = {
  children: ReactNode;
  frontmatter: {
    title: string;
    description: string;
    tags?: string[];
    image?: string;
  };
};

// ProjectImage component
export function ProjectImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}): React.ReactElement {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: "100%",
        height: "auto",
        maxHeight: 400,
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
}: ProjectLayoutProps): React.ReactElement {
  const { i18n } = useTranslation();
  const { slug } = useParams();

  return (
    <Stack spacing={3}>
      <Breadcrumbs>
        <Link component={RouterLink} to="/">
          Home
        </Link>
        <Typography color="text.primary">{frontmatter.title}</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight={800}>
            {frontmatter.title}
          </Typography>

          {/* Render tags from frontmatter */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <Box>
              {frontmatter.tags.map((tag) => (
                <ProjectTag key={tag}>{tag}</ProjectTag>
              ))}
            </Box>
          )}

          {frontmatter.image && (
            <Box
              component="img"
              src={frontmatter.image}
              alt={frontmatter.title}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: 400,
                borderRadius: 3,
                objectFit: "cover",
              }}
            />
          )}

          <Typography variant="body1" color="text.secondary">
            {frontmatter.description}
          </Typography>

          <Box>{children}</Box>

          <Box mt={2}>
            <Link
              component={RouterLink}
              to={`/projects/${slug ?? ""}?lang=${
                i18n.language === "en" ? "ro" : "en"
              }`}
            >
              {i18n.language === "en" ? "Vezi în română" : "View in English"}
            </Link>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
