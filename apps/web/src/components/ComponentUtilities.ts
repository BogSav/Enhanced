import { alpha } from "@mui/material/styles";
import * as React from "react";

import type { ThemeKey } from "../App";

/**
 * Animation hook for numeric counters (0 -> target) when an element enters the viewport.
 * Uses an easeOutCubic curve for a smooth animation.
 *
 * @param target - Final value of the counter
 * @param durationMs - Duration of the animation in milliseconds (default: 1200ms)
 * @param start - Flag that starts the animation when true
 * @returns The current animated counter value
 *
 * @example
 * const count = useCountUp(100, 1000, inView);
 */
export function useCountUp(
  target: number,
  durationMs = 1200,
  start = false
): number {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!start) {
      return;
    }

    let raf = 0;
    const t0 = performance.now();

    const tick = (t: number): void => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs, start]);

  return value;
}

/**
 * Helper for a consistent glassmorphism style used by the header and other components.
 * Returns an MUI sx-compatible style object.
 *
 * @param themeKey - 'light' or 'dark' to adapt the style to the current theme
 * @returns Style object for a glassmorphism effect
 *
 * @example
 * const glassStyle = getGlassStyle(themeKey);
 * <Box sx={glassStyle}>...</Box>
 */
export function getGlassStyle(themeKey: ThemeKey): Record<string, unknown> {
  const darkPalette = {
    primary: "#2563EB",
    secondary: "#5E6AD2",
    surface: "#111827",
    textSecondary: "#9BA3AF",
  };

  const lightPalette = {
    primary: "#2563EB",
    secondary: "#5E6AD2",
    background: "#F6F8FA",
    textSecondary: "#1F2937",
    surface: "#F6F8FA",
  };

  const p = themeKey === "dark" ? darkPalette : lightPalette;

  return {
    borderRadius: 999,
    px: 1,
    py: 0.75,
    border: `1px solid ${alpha(
      p.textSecondary,
      themeKey === "dark" ? 0.18 : 0.1
    )}`,
    bgcolor: alpha(p.surface, 0.72),
    backgroundImage: `linear-gradient(135deg, ${alpha(
      p.primary,
      0.12
    )}, ${alpha(p.secondary, 0.08)})`,
    backdropFilter: "saturate(160%) blur(14px)",
  };
}

/**
 * Type guard to check whether an entry is a loader function (lazy module).
 * Used in MDXLoader to distinguish between already-loaded modules and lazy loaders.
 *
 * @param entry - Entry to check
 * @returns true if entry is a function that returns a Promise
 */
export function isLoader<T>(
  entry: T | (() => Promise<T>) | undefined
): entry is () => Promise<T> {
  return typeof entry === "function";
}

/**
 * Type guard to verify whether a module has a default export.
 *
 * @param mod - Module to check
 * @returns true if the module has a default export that is a function/component
 */
export function hasDefault(
  mod: unknown
): mod is { default: React.ComponentType } {
  const maybe = mod as { default?: unknown } | null | undefined;
  return !!maybe && typeof maybe.default === "function";
}

/**
 * Safe helper to read values from localStorage with a fallback.
 * Handles errors and returns the default value if anything goes wrong.
 *
 * @param key - localStorage key
 * @param defaultValue - default value to return on error
 * @returns The value from localStorage or the defaultValue
 *
 * @example
 * const theme = getFromLocalStorage<ThemeKey>("app.theme", "dark");
 */
export function getFromLocalStorage<T extends string>(
  key: string,
  defaultValue: T
): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const value = localStorage.getItem(key) as T | null;
    return value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safe helper to write values to localStorage.
 * Silently handles any errors (quota/security issues, etc.).
 *
 * @param key - localStorage key
 * @param value - value to save
 *
 * @example
 * setToLocalStorage("app.theme", "dark");
 */
export function setToLocalStorage(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore errors (QuotaExceededError, SecurityError, etc.)
  }
}
