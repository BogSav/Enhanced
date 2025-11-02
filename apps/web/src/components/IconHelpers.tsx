import { Code, Memory, SportsEsports } from "@mui/icons-material";
import * as React from "react";

/**
 * Helper that maps icon name strings to MUI Icon components.
 * Returns the corresponding icon component or undefined.
 *
 * This file intentionally exports only non-component helpers so components can
 * live in separate files (fast refresh friendly).
 */
export function getIconComponent(
  iconName?: string
): React.ReactElement | undefined {
  if (!iconName) {
    return undefined;
  }

  switch (iconName.toLowerCase()) {
    case "code":
      return <Code />;
    case "memory":
      return <Memory />;
    case "public":
      return <SportsEsports />;
    default:
      return undefined;
  }
}
