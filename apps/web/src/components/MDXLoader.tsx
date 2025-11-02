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

import ui from "../content/parsers/UiTomlParser";

import { isLoader, hasDefault } from "./ComponentUtilities";
import ErrorBoundary from "./ErrorBoundary";

// An entry in `modules` can be either a lazy loader (the function returning a promise)
// or an already-loaded module. For the already-loaded module, I created the LoadedModule type.
type LoadedModule = { default: React.ComponentType<Record<string, unknown>> };
type ModuleEntry = LoadedModule | (() => Promise<LoadedModule>);

// Generic map for MDX modules (lazy or eager).
export type ModulesMap = Record<string, ModuleEntry | undefined>;

// These props should correspond to the frontmatter and structure of your MDX files
type MDXLoaderProps = {
  slug: string;
  modules: ModulesMap;
  /** optional subfolder inside locales e.g. "legal/" */
  pathPrefix?: string;
  /** Title shown when there is an error */
  errorTitle?: string;
  /** Wrap rendered MDX in ErrorBoundary */
  useErrorBoundary?: boolean;
  errorBoundaryFallback?: React.ReactNode;
};

// Component: loads and renders MDX based on slug + language.
export default function MDXLoader({
  slug,
  modules,
  pathPrefix = "",
  errorTitle = ui.mdxLoader.errorTitleDefault,
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

        // Lookup by slug (for the eager variant indexed by slug)
        let entry: ModuleEntry | undefined = modules[slug];

        // Fallback: lookup by literal path (for the lazy-by-path variant)
        if (!entry) {
          const path = `../content/${pathPrefix}${slug}.mdx`;
          entry = modules[path];
        }

        // If still not found, error out
        if (!entry) {
          setError(`Content "${slug}" not found`);
          return;
        }

        // We either have a loader function or an already-loaded module.
        // We first check which one it is, then load if needed.
        const mod = isLoader(entry) ? await entry() : entry;

        if (cancelledRef.current) {
          return;
        }

        // Each MDX module must have a default export (the component itself).
        // If no default component is detected we error out.
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
  }, [slug, modules, pathPrefix]);

  // If an error occurred, show error message and link back home
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
          {ui.mdxLoader.backHome}
        </Link>
      </Container>
    );
  }

  // While loading, show a spinner
  if (loading || !Content) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render the loaded MDX content, optionally wrapped in an ErrorBoundary to catch any rendering errors
  if (useErrorBoundary) {
    return (
      <ErrorBoundary
        fallback={
          errorBoundaryFallback ?? (
            <Typography>{ui.mdxLoader.errorRenderFallback}</Typography>
          )
        }
      >
        <Content />
      </ErrorBoundary>
    );
  }

  return <Content />;
}
