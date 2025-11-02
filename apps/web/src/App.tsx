import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { useMemo, useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import { getTheme } from "./components/Style";
import { getFromLocalStorage, setToLocalStorage } from "./components/Utility";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export type ThemeKey = "light" | "dark";

const THEME_KEY = "enhanced.theme";
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));

export default function App(): React.ReactElement {
  // We create a react state to hold the current theme key and initialize it from localStorage
  const [themeKey, keyThemeSetter] = useState<ThemeKey>(() =>
    getFromLocalStorage<ThemeKey>(THEME_KEY, "dark")
  );

  // Function to toggle between light and dark themes and save preference to localStorage
  // We use the state setter we got from the previous useState to update the theme key
  const toggleTheme = (): void => {
    keyThemeSetter((prevThemeKey) => {
      const nextThemeKey = prevThemeKey === "light" ? "dark" : "light";
      setToLocalStorage(THEME_KEY, nextThemeKey);
      return nextThemeKey;
    });
  };

  const theme = useMemo(() => getTheme(themeKey), [themeKey]);
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      {/* Include global styles and layout - this resets CSS with the MUI's own styles */}
      <CssBaseline />

      {/* Create the main layout container - here we are going to include the header, main content, and footer */}
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* First, we include the header - the sticky nav with the theme/language switch */}
        <Header
          themeKey={themeKey}
          onToggleTheme={toggleTheme}
          onLogoClick={() => navigate("/")}
        />

        {/* Second, we include the main content area. The main content will be rendered based on the URL path though the react router */}
        <Container sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
          {/* We use Suspense to handle lazy loading of the project pages */}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
              <Route path="/privacy" element={<InfoPage slug="privacy" />} />
              <Route path="/cookies" element={<InfoPage slug="cookies" />} />
              <Route path="/licenses" element={<InfoPage slug="licenses" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Container>

        {/* Finally, we include the footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
