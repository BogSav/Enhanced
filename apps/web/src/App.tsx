import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { useMemo, useState, lazy, Suspense } from "react";
import { getTheme } from "./components/Style";
import { Routes, Route, useNavigate } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export type ThemeKey = "light" | "dark";

const THEME_KEY = "enhanced.theme";
const ProjectPage = lazy(() => import("./pages/ProjectPage"));

function getInitialThemeKey(): ThemeKey {
  // Try to read the saved theme from localStorage
  if (typeof window !== "undefined") {
    try {
      const savedThemeKey = localStorage.getItem(THEME_KEY) as ThemeKey | null;
      if (savedThemeKey === "light" || savedThemeKey === "dark") {
        return savedThemeKey;
      }
    } catch {
      // We ignore errors reading localStorage and simply fallback to the default dark
    }
  }
  return "dark";
}

export default function App(): React.ReactElement {
  // State to hold the current theme, initialized from localStorage or default
  const [themeKey, keyThemeSetter] = useState<ThemeKey>(() =>
    getInitialThemeKey()
  );

  // Function to toggle between light and dark themes and save preference to localStorage - is used only in header
  const toggleTheme = (): void => {
    keyThemeSetter((prevThemeKey) => {
      const nextThemeKey = prevThemeKey === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, nextThemeKey);
      return nextThemeKey;
    });
  };

  const theme = useMemo(() => getTheme(themeKey), [themeKey]);
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header
          themeKey={themeKey}
          onToggleTheme={toggleTheme}
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
