import {
  Box,
  Breadcrumbs,
  Chip,
  Link,
  Paper,
  Stack,
  Typography,
  alpha,
  Dialog,
  IconButton,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";

import type { ReactNode } from "react";

// Type for frontmatter, matching MDX frontmatter structure
type Frontmatter = {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
};

// Inline prop types for ProjectLayout to keep the file simple

// ProjectImage component
export function ProjectImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          component="img"
          src={src}
          alt={alt ?? "project image"}
          onClick={handleOpen}
          sx={{
            width: "60%",
            height: "auto",
            maxHeight: 600,
            objectFit: "cover",
            my: 2,
            borderRadius: 1.5,
            boxShadow: (t) =>
              `7px 7px 10px ${alpha(t.palette.text.secondary, 0.2)}`,
            cursor: "zoom-in",
          }}
          role="button"
          aria-label="Open image in large view"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleOpen();
            }
          }}
        />

        {caption && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, textAlign: "center", maxWidth: "60%" }}
          >
            {caption}
          </Typography>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        PaperProps={{
          sx: { backgroundColor: "transparent", boxShadow: "none" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            p: 0.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="close image"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.4)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={src}
            alt={alt ?? "project image large"}
            sx={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
              borderRadius: 1,
            }}
          />

          {caption && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "common.white",
                textAlign: "center",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                maxWidth: "90vw",
              }}
            >
              {caption}
            </Typography>
          )}
        </Box>
      </Dialog>
    </>
  );
}

// ProjectTag component
export function ProjectTag({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        mr: 1,
        mb: 1,
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        fontWeight: 500,
      }}
    />
  );
}

export default function ProjectLayout({
  children,
  frontmatter,
}: {
  children: ReactNode;
  frontmatter?: Frontmatter;
}): React.ReactElement {
  if (!frontmatter) {
    // Fallback: render children only if no frontmatter is found
    return <>{children}</>;
  }

  return (
    <Stack spacing={3}>
      {/* Navigation link */}
      <Breadcrumbs>
        <Link component={RouterLink} to="/">
          Home
        </Link>
        <Typography color="text.primary">{frontmatter.title}</Typography>
      </Breadcrumbs>

      {/* Main project content */}
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight={800}>
            {frontmatter.title}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {frontmatter.description}
          </Typography>

          {/* Render tags from frontmatter */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <Box>
              {frontmatter.tags.map((tag) => (
                <ProjectTag key={tag}>{tag}</ProjectTag>
              ))}
            </Box>
          )}

          {/* This is the actual MDX content of the project - it is stored in the children object*/}
          <Box>{children}</Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
