import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import ProjectCard from "../components/ProjectCard";

import type { ProjectMetadata } from "../components/ProjectCard";

// Dynamically load all MDX files from locales folders
const enModules = import.meta.glob("../locales/en/projects/*.mdx", {
  eager: true,
});
const roModules = import.meta.glob("../locales/ro/projects/*.mdx", {
  eager: true,
});

export default function Home(): React.ReactElement {
  const { t, i18n } = useTranslation();

  // Process the imported MDX modules to extract projects metadata
  // Safely extract frontmatter from an imported MDX module (supports both `module.frontmatter` and `module.default.frontmatter` shapes)
  function extractFrontmatter(mod: unknown):
    | {
        title?: string;
        description?: string;
        tags?: string[];
        status?: string;
      }
    | undefined {
    if (!mod || typeof mod !== "object") {
      return undefined;
    }
    const m = mod as Record<string, unknown>;
    let maybe: unknown = undefined;
    if (m.frontmatter) {
      maybe = m.frontmatter;
    } else if (m.default && typeof m.default === "object") {
      const def = m.default as Record<string, unknown>;
      if (def.frontmatter) {
        maybe = def.frontmatter;
      }
    }
    if (!maybe || typeof maybe !== "object") {
      return undefined;
    }
    const fm = maybe as Record<string, unknown>;
    return {
      title: typeof fm.title === "string" ? fm.title : undefined,
      description:
        typeof fm.description === "string" ? fm.description : undefined,
      tags: Array.isArray(fm.tags)
        ? fm.tags.filter((x): x is string => typeof x === "string")
        : undefined,
      status: typeof fm.status === "string" ? fm.status : undefined,
    };
  }

  const projects: ProjectMetadata[] = useMemo(() => {
    const modules = i18n.language === "ro" ? roModules : enModules;

    return Object.entries(modules).map(([path, module]) => {
      // Extract slug from the file path
      const slug = path.split("/").pop()?.replace(".mdx", "") || "";

      // Extract frontmatter metadata safely
      const fm = extractFrontmatter(module) ?? {};

      // Create the project metadata object based on the frontmatter data and slug
      return {
        slug,
        title: fm.title ?? slug,
        description: fm.description ?? "",
        tags: fm.tags ?? [],
        status: fm.status ?? "",
      };
    });
  }, [i18n.language]);

  return (
    <Stack spacing={6}>
      {/* First part of the home page - Hero section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 0, md: 2 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            background: (t) =>
              t.palette.mode === "dark"
                ? "radial-gradient(1000px 500px at 0% 0%, rgba(56,189,248,.15), transparent), radial-gradient(800px 400px at 100% 0%, rgba(167,139,250,.12), transparent)"
                : "radial-gradient(1000px 500px at 0% 0%, rgba(14,165,233,.12), transparent), radial-gradient(800px 400px at 100% 0%, rgba(124,58,237,.10), transparent)",
          }}
        >
          {/* Title, description and tags */}
          <Stack spacing={2}>
            <Chip
              label="Portfolio & Lab"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: "flex-start" }}
            />
            <Typography variant="h2">
              <Box component="span" sx={{ color: "secondary.main" }}>
                Enhanced
              </Box>{" "}
              - {t("home.title")}
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={800}>
              {t("home.subtitle")}
            </Typography>
          </Stack>

          {/* Action buttons - projects and contact */}
          <Stack direction="row" spacing={2} sx={{ pt: 3 }}>
            <Button size="large" variant="contained" href="#projects">
              {t("home.explore")}
            </Button>
            <Button size="large" variant="outlined" href="#contact">
              {t("home.contact")}
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* Render all the projects using the <ProjectCard /> component */}
      <Box id="projects">
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
          {t("home.proiecte")}
        </Typography>

        {/* Projects masonry using CSS columns (no extra deps) */}
        <Box
          sx={{
            columnCount: { xs: 1, sm: 2, md: 3 },
            columnGap: 4,
          }}
        >
          {projects.map((p) => (
            <Box
              key={p.slug}
              sx={{
                breakInside: "avoid-column",
                mb: 3,
                display: "block",
              }}
            >
              <ProjectCard projectMetadata={p} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Contact area - message and mail */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: "center" }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 700, whiteSpace: "pre-line" }}
        >
          {t("home.colaborare")}
        </Typography>
        <Button
          size="large"
          variant="contained"
          href="mailto:bogdansava59@yahoo.com"
        >
          {t("home.email")}
        </Button>
      </Paper>
    </Stack>
  );
}
