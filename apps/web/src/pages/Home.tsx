import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  Grow,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";

import ProjectCard from "../components/ProjectCard";
import AboutMe from "../components/AboutMe";
import Section from "../components/Section";
import BlogSection from "../components/BlogSection";
import { getProjectMetadata } from "../content/ProjectsLoader";
import ui from "../content/parsers/UiTomlParser";

import type { ProjectMetadata } from "../components/ProjectCard";

export default function Home(): React.ReactElement {
  const projects: ProjectMetadata[] = useMemo(() => getProjectMetadata(), []);

  return (
    <Stack spacing={3}>
      {/* First part of the home page - Hero section (animated) */}
      <Container maxWidth="lg" sx={{ pt: { xs: 0, md: 2 } }}>
        <Grow
          in
          timeout={500}
          style={{ transformOrigin: "top center", transitionDelay: `0ms` }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              background: (t) =>
                t.palette.mode === "dark"
                  ? `radial-gradient(1000px 500px at 0% 0%, ${alpha(
                      t.palette.primary.main,
                      0.15
                    )}, transparent), radial-gradient(800px 400px at 100% 0%, ${alpha(
                      t.palette.secondary.main,
                      0.12
                    )}, transparent)`
                  : `radial-gradient(1000px 500px at 0% 0%, ${alpha(
                      t.palette.primary.main,
                      0.12
                    )}, transparent), radial-gradient(800px 400px at 100% 0%, ${alpha(
                      t.palette.secondary.main,
                      0.1
                    )}, transparent)`,
            }}
          >
            {/* Title, description and tags */}
            <Stack spacing={2}>
              <Chip
                label={ui.home.badge}
                color="primary"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
              <Typography
                variant="h1"
                sx={{
                  color: "secondary.main",
                  fontWeight: 800,
                  // responsive font size so the title fits on phones
                  fontSize: { xs: "3rem", sm: "3.5rem", md: "4.5rem" },
                  lineHeight: 1.05,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Enhanced
              </Typography>
              <Typography variant="h4">{ui.home.title}</Typography>
              <Typography variant="h6" color="text.secondary" maxWidth={800}>
                {ui.home.subtitle}
              </Typography>
            </Stack>

            {/* Action buttons - projects and contact */}
            <Stack direction="row" spacing={2} sx={{ pt: 3 }}>
              <Button size="large" variant="contained" href="#projects">
                {ui.home.ctaExplore}
              </Button>
              <Button size="large" variant="outlined" href="#contact">
                {ui.home.ctaContact}
              </Button>
            </Stack>
          </Paper>
        </Grow>
      </Container>

      <Section id="about" index={1}>
        <AboutMe />
      </Section>

      {/* Render all the projects using the <ProjectCard /> component inside a consistent Section */}
      <Section id="projects" title={ui.projects.title} index={2}>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {ui.projects.subtitle}
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
      </Section>

      {/* Blogs section */}
      <Section id="blogs" title={ui.blog.title} index={3}>
        <BlogSection />
      </Section>

      {/* Contact area - message and mail */}
      <Section index={4}>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: 700, whiteSpace: "pre-line" }}
          >
            {ui.contact.collab}
          </Typography>
          <Button
            size="large"
            variant="contained"
            href="mailto:bogdansava59@yahoo.com"
          >
            {ui.contact.emailButton}
          </Button>
        </Box>
      </Section>
    </Stack>
  );
}
