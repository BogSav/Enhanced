import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "../components/ProjectCard";
import { useTranslation } from "react-i18next";

const projects: Project[] = [
  {
    slug: "quantum-hybrid-arch",
    title: "Hybrid Quantum–Classical Architecture",
    description:
      "Research notes, kernels & simulators exploring CPU+QPU orchestration, qRAM, and teleportation channels.",
    tags: ["Research", "Quantum", "Systems"],
  },
  {
    slug: "enhanced-ai-platform",
    title: "Enhanced AI Platform",
    description:
      "Containerized microservices for LLM inference, routing, and multi‑tenant chat with audit trails.",
    tags: ["AI", "Docker", "TypeScript"],
  },
  {
    slug: "cnc-linking",
    title: "CNC Linking Algorithms",
    description:
      "Advanced toolpath linking, arc trimming, and lead optimization for high‑speed machining.",
    tags: ["C++", "Geometry", "Manufacturing"],
  },
  {
    slug: "unconventional-research",
    title: "Unconventional Research Blog",
    description:
      "Wild hypotheses, careful reasoning, and playful experiments to stretch imagination.",
    tags: ["Writing", "Science"],
  },
];

export default function Home() {
  const { t } = useTranslation();

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
              Enhanced — building the future of{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                AI
              </Box>{" "}
              ×{" "}
              <Box component="span" sx={{ color: "secondary.main" }}>
                Quantum
              </Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={800}>
              {t("hero.subtitle")}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button size="large" variant="contained" href="#projects">
                {t("hero.explore")}
              </Button>
              <Button size="large" variant="outlined" href="#contact">
                {t("cta.contact")}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* Projects */}
      <Box id="projects">
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
          Featured Projects
        </Typography>
        <Grid container spacing={2}>
          {projects.map((p) => (
            <Grid key={p.slug} item xs={12} sm={6} md={4}>
              <ProjectCard project={p} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: "center" }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Open for collaborations & interesting problems.
        </Typography>
        <Button
          size="large"
          variant="contained"
          href="mailto:hello@enhanced.com"
        >
          Email me
        </Button>
      </Paper>
    </Stack>
  );
}
