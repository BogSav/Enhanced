import Section from "../components/Section";
import ProjectCard from "../components/ProjectCard";

import { Box, Typography } from "@mui/material";

import ui from "../content/parsers/UiTomlParser";
import type { ProjectMetadata } from "../components/ProjectCard";

export default function ProjectsSection({
  projects,
}: {
  projects: ProjectMetadata[];
}): React.ReactElement {
  return (
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
        {(projects || []).map((p) => (
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
  );
}
