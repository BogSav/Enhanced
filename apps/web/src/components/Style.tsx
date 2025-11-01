import { createTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { ThemeKey } from "../App";

/** Dark = inspirat de GitHub/Primer + Linear: fond foarte închis, neutrali reci, accent albastru serios */
const darkThemePalette = {
  primary: "#2563EB", // blue 600 (accent) – call-to-action
  primaryContrast: "#FFFFFF", // text pe butoane primare
  secondary: "#5E6AD2", // indigo “Linear Magic Blue”
  secondaryContrast: "#FFFFFF",
  background: "#0D1117", // near-black (GitHub dark family)
  surface: "#111827", // slate 900-ish, pentru carduri/panouri
  accent: "#60A5FA", // albastru mai deschis pt. iconițe/chips
  accentContrast: "#0B1220", // pentru icon pe accent deschis (dacă ai badge-uri)
  border: "#1F2937", // slate 800 – delimitări discrete
  textPrimary: "#E6EDF3", // text principal pe dark
  textSecondary: "#9BA3AF", // text secundar pe dark
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#22C55E",
};

/** Light = inspirat de Stripe/Primer: fond aproape alb-albăstrui, text aproape-negru, accent albastru */
const whiteThemePalette = {
  primary: "#2563EB", // menține identitatea butoanelor
  primaryContrast: "#FFFFFF",
  secondary: "#5E6AD2",
  secondaryContrast: "#FFFFFF",
  background: "#F6F8FA", // soft gray-blue (GitHub-like)
  surface: "#FFFFFF",
  accent: "#2563EB",
  accentContrast: "#FFFFFF",
  border: "#E5E7EB", // gray-300
  textPrimary: "#0B1220", // aproape-negru, citibil
  textSecondary: "#475569", // slate 600
  error: "#E11D48",
  warning: "#F59E0B",
  success: "#22C55E",
};

// Glass style (ușor temperat, fără glow agresiv; funcționează pe ambele teme)
export const getGlassStyle = (themeKey: ThemeKey): Record<string, unknown> => {
  const p = themeKey === "dark" ? darkThemePalette : whiteThemePalette;
  return {
    borderRadius: 999,
    px: 1,
    py: 0.75,
    border: `1px solid ${alpha(
      themeKey === "dark" ? p.textSecondary : "#1F2937",
      themeKey === "dark" ? 0.18 : 0.1
    )}`,
    bgcolor: alpha(themeKey === "dark" ? p.surface : p.background, 0.72),
    backgroundImage: `linear-gradient(135deg, ${alpha(
      p.primary,
      0.12
    )}, ${alpha(p.secondary, 0.08)})`,
    backdropFilter: "saturate(160%) blur(14px)"
  };
};

export const getTheme = (themeKey: ThemeKey): ReturnType<typeof createTheme> =>
  createTheme({
    palette: {
      mode: themeKey,
      primary: {
        main:
          themeKey === "light"
            ? whiteThemePalette.primary
            : darkThemePalette.primary,
        contrastText:
          themeKey === "light"
            ? whiteThemePalette.primaryContrast
            : darkThemePalette.primaryContrast,
      },
      secondary: {
        main:
          themeKey === "light"
            ? whiteThemePalette.secondary
            : darkThemePalette.secondary,
        contrastText:
          themeKey === "light"
            ? whiteThemePalette.secondaryContrast
            : darkThemePalette.secondaryContrast,
      },
      background: {
        default:
          themeKey === "light"
            ? whiteThemePalette.background
            : darkThemePalette.background,
        paper:
          themeKey === "light"
            ? whiteThemePalette.surface
            : darkThemePalette.surface,
      },
      text: {
        primary:
          themeKey === "light"
            ? whiteThemePalette.textPrimary
            : darkThemePalette.textPrimary,
        secondary:
          themeKey === "light"
            ? whiteThemePalette.textSecondary
            : darkThemePalette.textSecondary,
      },
      error: {
        main:
          themeKey === "light"
            ? whiteThemePalette.error
            : darkThemePalette.error,
      },
      warning: {
        main:
          themeKey === "light"
            ? whiteThemePalette.warning
            : darkThemePalette.warning,
      },
      success: {
        main:
          themeKey === "light"
            ? whiteThemePalette.success
            : darkThemePalette.success,
      },
      divider:
        themeKey === "light"
          ? whiteThemePalette.border
          : darkThemePalette.border,
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
      h1: { fontWeight: 800, letterSpacing: -0.5 },
      h2: { fontWeight: 700, letterSpacing: -0.25 },
      h3: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: { root: { boxShadow: `0 10px 30px ${alpha(
          themeKey === "light" ? whiteThemePalette.textPrimary : darkThemePalette.textPrimary,
          0.08
        )}` } },
      },
      MuiCard: { styleOverrides: { root: { borderRadius: 20 } } },
    },
  });
