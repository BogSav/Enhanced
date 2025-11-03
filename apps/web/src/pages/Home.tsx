import { Stack } from "@mui/material";
import { useEffect, useState } from "react";

import AboutMeSection from "../components/AboutMeSection";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";
import HeroSection from "../components/HeroSection";
import ProjectsSection from "../components/ProjectsSection";
import { getProjectMetadata } from "../content/ProjectsLoader";

import type { ProjectMetadata } from "../components/ProjectCard";

export default function Home(): React.ReactElement {
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);

  useEffect(() => {
    // call and intentionally ignore the returned promise using `void` so ESLint
    // doesn't report an unhandled/floating promise. Errors are expected to be
    // handled inside `getProjectMetadata` or can be added here if desired.
    void getProjectMetadata().then(setProjects);
  }, []);

  return (
    <Stack spacing={3}>
      {/* Hero section - first part of the page */}
      <HeroSection />

      {/* About me section */}
      <AboutMeSection />

      {/* Projects section */}
      <ProjectsSection projects={projects} />

      {/* Blogs section */}
      <BlogSection />

      {/* Contact area - message and mail */}
      <ContactSection />
    </Stack>
  );
}
