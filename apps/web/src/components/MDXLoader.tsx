import {
  Box,
  CircularProgress,
  Container,
  Link,
  Typography,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary";

type LoadedModule = { default: React.ComponentType<Record<string, unknown>> };
export type ModulesMap = Record<
  string,
  (() => Promise<LoadedModule>) | undefined
>;

type MDXLoaderProps = {
  slug: string;
  language: string;
  modules: ModulesMap;
  /** optional subfolder inside locales e.g. "legal/" */
  pathPrefix?: string;
  /** Title shown when there is an error */
  errorTitle?: string;
  /** Wrap rendered MDX in ErrorBoundary */
  useErrorBoundary?: boolean;
  errorBoundaryFallback?: React.ReactNode;
};

// This function is used to dynamically load and render MDX content based on the provided slug and language
// while asynchronously handling loading and error states.
export default function MDXLoader({
  slug,
  language,
  modules,
  pathPrefix = "",
  errorTitle = "Content not available",
  useErrorBoundary = false,
  errorBoundaryFallback,
}: MDXLoaderProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [Content, setContent] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        setContent(null);

        const langFolder = language.startsWith("ro") ? "ro" : "en";
        const path = `../locales/${langFolder}/${pathPrefix}${slug}.mdx`;

        const importer = modules[path];
        if (typeof importer !== "function") {
          setError(`Content "${slug}" not found`);
          setLoading(false);
          return;
        }

        // Start dynamic import by calling the importer function
        const mod = await importer();

        if (cancelled) {
          return;
        }

        if (typeof mod.default === "function") {
          setContent(() => mod.default);
          setError(null);
        } else {
          setError(
            `Loaded module for "${slug}" does not contain a default export`
          );
        }
      } catch (err) {
        console.error("Error loading MDX content:", err);
        setError(
          `Failed to load content: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug, language, modules, pathPrefix]);

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {errorTitle}
        </Typography>
        <Link component={RouterLink} to="/">
          Back to Home
        </Link>
      </Container>
    );
  }

  if (loading || !Content) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const rendered = <Content />;

  if (useErrorBoundary) {
    return (
      <ErrorBoundary
        fallback={
          errorBoundaryFallback ?? (
            <Typography>Failed to render content</Typography>
          )
        }
      >
        {rendered}
      </ErrorBoundary>
    );
  }

  return rendered;
}
