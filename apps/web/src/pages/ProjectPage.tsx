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
import {
  useParams,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";

import ErrorBoundary from "../components/ErrorBoundary";

// Lista de proiecte disponibile cu importurile lor
const availableProjects = {
  "quantum-hybrid-arch": {
    en: () => import("../locales/en/quantum-hybrid-arch.mdx"),
    ro: () => import("../locales/ro/quantum-hybrid-arch.mdx"),
  },
  // Poți adăuga alte proiecte aici
};

type AvailableProjectKeys = keyof typeof availableProjects;

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

        // Verifică dacă proiectul există
        if (!(slug in availableProjects)) {
          setError(`Project "${slug}" not found`);
          setLoading(false);
          return;
        }

        const project = availableProjects[slug as AvailableProjectKeys];
        const languageKey = language as keyof typeof project;

        // Verifică dacă limba există pentru proiect
        if (!(languageKey in project)) {
          setError(
            `Language "${language}" not available for project "${slug}"`
          );
          setLoading(false);
          return;
        }

        // Încarcă modulul MDX
        const module = await project[languageKey]();
        setProjectContent(() => module.default);
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
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();

  // Determină limba din URL query sau folosește limba curentă
  const languageParam = searchParams.get("lang");
  const language = languageParam || i18n.language;

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
