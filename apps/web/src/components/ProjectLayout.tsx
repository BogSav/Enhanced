import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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
import { Alert } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import type { ReactNode } from "react";

// Type for frontmatter, matching MDX frontmatter structure
type Frontmatter = {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
};

// Below we define some reusable components for the MDX project pages

// ProjectImage component - this component contains caption for the image, and a dialog to show the image in large format when clicked
// This components are designed to be used inside MDX files to display project images with captions and zoom functionality
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

  const handleOpen = React.useCallback((): void => {
    setOpen(true);
  }, []);
  const handleClose = React.useCallback((): void => {
    setOpen(false);
  }, []);

  React.useEffect(() => {
    // We add an event listener for keyboard input such that when the dialog is open, pressing Escape closes it
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.addEventListener("keydown", onKey);
    }

    // We remove the event listener on cleanup
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, handleClose]);

  return (
    <>
      {/* First we define the original image plus the caption, below you can find the big dialog for the image */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Clickable image that opens the dialog */}
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

        {/* Caption below the image */}
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

      {/* Then we define the dialog that shows the large image - here we also have to define the close button and the caption again*/}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        slotProps={{
          paper: { sx: { backgroundColor: "transparent", boxShadow: "none" } },
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
          {/* Close button */}
          <IconButton
            aria-label="close image"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              bgcolor: (t) => alpha(t.palette.common.black, 0.4),
              "&:hover": { bgcolor: (t) => alpha(t.palette.common.black, 0.6) },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* The actual image in big format */}
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

          {/* Caption below the large image */}
          {caption && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "common.white",
                textAlign: "center",
                textShadow: (t) => `0 1px 4px ${alpha(t.palette.common.black, 0.8)}`,
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

// This is the ProjectTag component
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

// Small reusable GitHub link with icon + text
export function GitHubLink({
  url,
  label = "View on GitHub",
  iconSize = "small",
}: {
  url: string;
  label?: string;
  iconSize?: "small" | "medium" | "large";
}): React.ReactElement {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <GitHubIcon fontSize={iconSize} aria-hidden="true" />
      <Typography variant="body2">{label}</Typography>
    </Link>
  );
}

// WarningBox: simple red/yellow warning box with an icon
export function WarningBox({
  title,
  severity,
}: {
  title?: string;
  severity?: "error" | "warning";
}): React.ReactElement {
  return (
    <Alert
      severity={severity || "warning"}
      icon={<WarningAmberIcon />}
      sx={{ mt: 2, mb: 2 }}
    >
      {title ? (
        <strong style={{ display: "block", marginBottom: 6 }}>{title}</strong>
      ) : null}
    </Alert>
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
