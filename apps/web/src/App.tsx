import { useMemo, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
} from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";

export type PaletteMode = "light" | "dark";

const THEME_KEY = "enhanced.theme";

export default function App() {
  const [mode, setMode] = useState<PaletteMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as PaletteMode | null;
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
