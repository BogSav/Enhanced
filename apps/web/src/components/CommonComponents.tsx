import { LinkedIn } from "@mui/icons-material";
import { Paper, Typography, Box, Link } from "@mui/material";
import * as React from "react";

import { useCountUp } from "./ComponentUtilities";

/**
 * Statistic card component with an animated counter and optional emoji.
 *
 * @param title - Statistic title
 * @param value - Numeric value for the statistic
 * @param emoji - Optional emoji displayed next to the title
 * @param start - Flag to start the counter animation
 * @param index - Index used to stagger animation timings
 *
 * @example
 * <StatCard title="Projects" value={25} emoji="📈" start={inView} index={0} />
 */
export function StatCard({
  title,
  value,
  emoji,
  start,
  index,
}: {
  title: string;
  value: number;
  emoji?: string;
  start: boolean;
  index: number;
}): React.ReactElement {
  const count = useCountUp(value, 900 + index * 120, start);

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", md: "center" },
        textAlign: { xs: "center", md: "center" },
        justifyContent: "center",
        minHeight: { xs: "4.5rem", md: "auto" },
      }}
    >
      <Typography variant="body1" align="center" sx={{ p: 1 }}>
        {emoji ? (
          <Box
            component="span"
            aria-hidden
            sx={{ fontSize: 18, lineHeight: 1 }}
          >
            {emoji}
          </Box>
        ) : null}
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
        {count}
      </Typography>
    </Paper>
  );
}

/**
 * Helper that maps icon name strings to MUI Icon components.
 * Returns the corresponding icon component or undefined.
 *
 * @param iconName - Icon name (case-insensitive): 'code', 'memory', 'SportsEsports'
 * @returns React Icon component or undefined
 *
 * @example
 * const icon = getIconComponent('code'); // <Code />
 * <Chip icon={icon} label="Systems" />
 */
// Note: icon helper moved to IconHelpers.tsx to keep this file exporting only components

// Small reusable LinkedIn link with icon + text
export function LinkedinLink({
  url,
  label = "View on LinkedIn",
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
      <LinkedIn fontSize={iconSize} aria-hidden="true" />
      <Typography variant="body2">{label}</Typography>
    </Link>
  );
}
