import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import ProjectCard from "../components/ProjectCard";

import type { ProjectMetadata } from "../components/ProjectCard";

// Dynamically load all MDX files from locales folders
const enModules = import.meta.glob("../locales/en/*.mdx", { eager: true });
const roModules = import.meta.glob("../locales/ro/*.mdx", { eager: true });

export default function Home(): React.ReactElement {
  const { t, i18n } = useTranslation();

  // Process the imported MDX modules to extract projects metadata
  const projects: ProjectMetadata[] = useMemo(() => {
    const modules = i18n.language === "ro" ? roModules : enModules;

    return Object.entries(modules).map(([path, module]) => {
      // Extract slug from the file path
      const slug = path.split("/").pop()?.replace(".mdx", "") || "";

      // Extract frontmatter metadata from the module
      const frontmatter = (module as any).frontmatter;

      // Create the project metadata object based on the frontmatter data and slug
      return {
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        tags: frontmatter.tags,
        status: frontmatter.status,
      };
    });
  }, [i18n.language]);

  return (
    <Stack spacing={6}>
      {/* Hero */}
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
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button size="large" variant="contained" href="#projects">
                {t("home.explore")}
              </Button>
              <Button size="large" variant="outlined" href="#contact">
                {t("home.contact")}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* Projects */}
      <Box id="projects">
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
          {t("home.proiecte")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {projects.map((p) => (
            <Box key={p.slug}>
              <ProjectCard projectMetadata={p} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* CTA */}
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
