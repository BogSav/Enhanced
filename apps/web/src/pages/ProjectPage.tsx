import {
  Box,
  CircularProgress,
  Container,
  Link,
  Typography,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link as RouterLink } from "react-router-dom";

import ErrorBoundary from "../components/ErrorBoundary";

// Dynamic imports for all MDX files
const enModules = import.meta.glob("../locales/en/*.mdx");
const roModules = import.meta.glob("../locales/ro/*.mdx");

const MDXProjectPage = ({
  slug,
  language,
}: {
  slug: string;
  language: string;
}): React.ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [ProjectContent, setProjectContent] =
    useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Select the appropriate modules based on language
        const modules = language.startsWith("ro") ? roModules : enModules;
        const langFolder = language.startsWith("ro") ? "ro" : "en";
        const path = `../locales/${langFolder}/${slug}.mdx`;

        // Check if the module exists
        const importer = modules[path];
        if (!importer) {
          setError(`Project "${slug}" not found`);
          setLoading(false);
          return;
        }

        // Load the MDX module
        const module = await importer();
        setProjectContent(() => (module as any).default);
        setError(null);
      } catch (err) {
        console.error("Error loading project:", err);
        setError(
          `Failed to load project content: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [slug, language]);

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Project not available
        </Typography>
        <Link component={RouterLink} to="/">
          Back to Home
        </Link>
      </Container>
    );
  }

  if (loading || !ProjectContent) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ErrorBoundary
      fallback={<Typography>Failed to render project content</Typography>}
    >
      <ProjectContent />
    </ErrorBoundary>
  );
};

export default function ProjectPage(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();

  // Folosește limba curentă din i18n
  const language = i18n.language;

  if (!slug) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Project not found
        </Typography>
        <Link component={RouterLink} to="/">
          Back to Home
        </Link>
      </Container>
    );
  }

  return <MDXProjectPage slug={slug} language={language} />;
}
