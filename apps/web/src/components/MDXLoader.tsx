import {
  Box,
  CircularProgress,
  Container,
  Link,
  Typography,
  Alert,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary";

type LoadedModule = { default: React.ComponentType<Record<string, unknown>> };

// An entry in `modules` can be either a lazy loader or an already-loaded module.
type ModuleEntry = LoadedModule | (() => Promise<LoadedModule>);

/** Generic map for MDX modules (lazy or eager). */
export type ModulesMap = Record<string, ModuleEntry | undefined>;

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

// Type guards
function isLoader(
  entry: ModuleEntry | undefined
): entry is () => Promise<LoadedModule> {
  return typeof entry === "function";
}

function hasDefault(mod: unknown): mod is LoadedModule {
  // Avoid `any`: use a partial structural type
  const maybe = mod as { default?: unknown } | null | undefined;
  return !!maybe && typeof maybe.default === "function";
}

// Component: loads and renders MDX based on slug + language.
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

  // Must be declared at component level, not inside the effect.
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        setContent(null);

        const langFolder = language.startsWith("ro") ? "ro" : "en";

        // 1) Lookup by slug (for the eager variant indexed by slug)
        let entry: ModuleEntry | undefined = modules[slug];

        // 2) Fallback: lookup by literal path (for the lazy-by-path variant)
        if (!entry) {
          const path = `../locales/${langFolder}/${pathPrefix}${slug}.mdx`;
          entry = modules[path];
        }

        if (!entry) {
          setError(`Content "${slug}" not found`);
          return;
        }

        // Support both modes: eager (direct module) or lazy (loader function).
        const mod = isLoader(entry) ? await entry() : entry;

        if (cancelledRef.current) {
          return;
        }

        if (hasDefault(mod)) {
          setContent(() => mod.default);
        } else {
          setError(
            `Loaded module for "${slug}" does not contain a default export`
          );
        }
      } catch (err) {
        console.error("Error loading MDX content:", err);
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to load content: ${msg}`);
      } finally {
        if (!cancelledRef.current) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelledRef.current = true;
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
