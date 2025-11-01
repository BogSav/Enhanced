import DarkModeIcon from "@mui/icons-material/DarkMode";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

import logoImage from "/LogoEnhancedV2.png";
import { getGlassStyle } from "./Style";

export default function Header({
  themeKey,
  onToggleTheme,
  onLogoClick,
}: {
  themeKey: "light" | "dark";
  onToggleTheme: () => void;
  onLogoClick?: () => void;
}): React.ReactElement {
  // Get the translation function and current language from i18n
  const { t, i18n } = useTranslation();

  // Get the glass style based on the current theme for the header background
  const glassStyle = getGlassStyle(themeKey);
  const toggleLanguage = (): void => {
    void i18n.changeLanguage(i18n.language === "en" ? "ro" : "en");
  };

  // Reusable style for the navigation buttons - this is a descriptor compatible with MUI's sx prop
  const chipStyle = {
    borderRadius: 999,
    fontWeight: 600,
    px: 1.5,
    height: 36,
  } as const;

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ p: 1 }}>
      <Container maxWidth="lg">
        {/* This box contains the header content - logo, title, and navigation links */}
        <Box sx={glassStyle}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            {/*==========================================================================*/}
            {/* This stack contains the logo and title of the project */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              onClick={onLogoClick}
              sx={{ cursor: "pointer", pl: 1 }}
            >
              <Box
                component="img"
                src={logoImage}
                alt="Enhanced"
                sx={{ width: 28, height: 28, borderRadius: 1 }}
              />
              <Typography variant="subtitle1" fontWeight={800}>
                Enhanced
              </Typography>
            </Stack>

            {/*==========================================================================*/}
            {/* This stack contains the navigation links: HomePage, Projects, Blogs */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                sx={chipStyle}
              >
                {t("header.home")}
              </Button>
              <Button
                component={RouterLink}
                to="/#projects"
                color="inherit"
                sx={chipStyle}
              >
                {t("header.projects")}
              </Button>
              <Button href="#about" color="inherit" sx={chipStyle}>
                {t("header.about")}
              </Button>
              <Button href="#blogs" color="inherit" sx={chipStyle}>
                {t("header.blogs")}
              </Button>
            </Stack>

            {/*==========================================================================*/}
            {/* This stack contains the language toggle, theme switch and GitHub link */}
            <Stack direction="row" alignItems="center" spacing={0.5} pr={1}>
              {/* This tooltip toggles the language */}
              <Tooltip
                title={
                  i18n.language === "en"
                    ? t("lang.switchToRo")
                    : t("lang.switchToEn")
                }
              >
                <IconButton
                  onClick={toggleLanguage}
                  size="small"
                  sx={chipStyle}
                >
                  {i18n.language === "en" ? t("lang.ro") : t("lang.en")}
                </IconButton>
              </Tooltip>
              {/* This tooltip toggles the theme */}
              <Tooltip
                title={themeKey === "dark" ? "Light mode" : "Dark mode"}
                arrow
              >
                <IconButton
                  onClick={onToggleTheme}
                  color="inherit"
                  size="small"
                  sx={{ borderRadius: 999 }}
                >
                  {themeKey === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              {/* This icon button links to the GitHub repository */}
              <IconButton
                color="inherit"
                href="https://github.com/BogSav"
                target="_blank"
                size="small"
                sx={{ borderRadius: 999 }}
              >
                <GitHubIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </AppBar>
  );
}
