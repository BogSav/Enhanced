import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
} from "@mui/material";
import { useMemo, useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const ProjectPage = lazy(() => import("./pages/ProjectPage"));

export type PaletteMode = "light" | "dark";

const THEME_KEY = "enhanced.theme";

function getInitialMode(): PaletteMode {
  // Citim din localStorage direct în initializerul lazy al useState pentru a evita un efect suplimentar
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(THEME_KEY) as PaletteMode | null;
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch {
      // ignorăm erorile (ex: acces blocat la storage) și cădem pe fallback
    }
  }
  return "dark";
}

export default function App(): React.ReactElement {
  const [mode, setMode] = useState<PaletteMode>(() => getInitialMode());

  const toggleMode = (): void => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const theme = useMemo(
    (): import("@mui/material/styles").Theme =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "light" ? "#0ea5e9" : "#38bdf8" },
          secondary: { main: mode === "light" ? "#7c3aed" : "#a78bfa" },
          background: {
            default: mode === "light" ? "#edededff" : "#0c1522ff",
            paper: mode === "light" ? "#fafafa81" : "#122135ff",
          },
        },
        shape: { borderRadius: 16 },
        typography: {
          fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
          h1: { fontWeight: 800, letterSpacing: -0.5 },
          h2: { fontWeight: 700, letterSpacing: -0.25 },
          h3: { fontWeight: 700 },
          button: { textTransform: "none", fontWeight: 600 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: { boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
            },
          },
          MuiCard: { styleOverrides: { root: { borderRadius: 20 } } },
        },
      }),
    [mode]
  );

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header
          mode={mode}
          onToggleMode={toggleMode}
          onLogoClick={() => navigate("/")}
        />
        <Container sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
