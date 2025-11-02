// This is the hero section component for the homepage
// it includes the title, subtitle, summary, and call-to-action buttons.
// Its purpose is just to introduce the site and direct users to explore projects or contact.

import {
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  Grow,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import ui from "../content/parsers/UiTomlParser";

export default function HeroSection(): React.ReactElement {
  return (
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
            {/* Title - made explicitly responsive because of the h1 resizing issue */}
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
              {ui.home.title}
            </Typography>
            {/* Subtitle and summary */}
            <Typography variant="h4">{ui.home.subtitle}</Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={800}>
              {ui.home.summary}
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
  );
}
