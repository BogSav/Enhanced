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
import { getProjectMetadata } from "../content/projects";

import type { ProjectMetadata } from "../components/ProjectCard";

export default function Home(): React.ReactElement {
  const projects: ProjectMetadata[] = useMemo(() => getProjectMetadata(), []);

  return (
    <Stack spacing={3}>
      {/* First part of the home page - Hero section (animated) */}
      <Container maxWidth="lg" sx={{ pt: { xs: 0, md: 2 } }}>
        <Grow in timeout={500} style={{ transformOrigin: "top center", transitionDelay: `0ms` }}>
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
                          0.10
                        )}, transparent)`,
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
              <Typography variant="h1" sx={{ color: "secondary.main" }}>
                  Enhanced
              </Typography>
              <Typography variant="h3">Interactive portfolio</Typography>
              <Typography variant="h6" color="text.secondary" maxWidth={800}>
                Projects at the intersection of hardware accelerated computing, artificial intelligence, and quantum computing.
              </Typography>
            </Stack>

            {/* Action buttons - projects and contact */}
            <Stack direction="row" spacing={2} sx={{ pt: 3 }}>
              <Button size="large" variant="contained" href="#projects">Explore projects</Button>
              <Button size="large" variant="outlined" href="#contact">Contact me</Button>
            </Stack>
          </Paper>
        </Grow>
      </Container>

      <Section id="about" index={1}>
        <AboutMe boxed={false} />
      </Section>

      {/* Render all the projects using the <ProjectCard /> component inside a consistent Section */}
  <Section id="projects" title={"Featured Projects"} index={2}>
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
      <Section id="blogs" title={"From the blog"} index={3}>
        <BlogSection />
      </Section>

      {/* Contact area - message and mail */}
      <Section index={4}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, whiteSpace: "pre-line" }}>
            {"Open for collaborations & interesting problems.\n Feel free to reach out!"}
          </Typography>
          <Button
            size="large"
            variant="contained"
            href="mailto:bogdansava59@yahoo.com"
          >
            Email me
          </Button>
        </Box>
      </Section>
    </Stack>
  );
}
