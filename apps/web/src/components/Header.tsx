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
import { Link as RouterLink } from "react-router-dom";

import logoImage from "/LogoEnhancedV2.png";
import { getGlassStyle } from "./Style";
import ui from "../content/uiText";

export default function Header({
  themeKey,
  onToggleTheme,
  onLogoClick,
}: {
  themeKey: "light" | "dark";
  onToggleTheme: () => void;
  onLogoClick?: () => void;
}): React.ReactElement {
  // English-only UI (i18n removed)

  // Get the glass style based on the current theme for the header background
  const glassStyle = getGlassStyle(themeKey);
  // Language toggle removed

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
              <Button component={RouterLink} to="/" color="inherit" sx={chipStyle}>
                {ui.header.home}
              </Button>
              <Button
                component={RouterLink}
                to="/#projects"
                color="inherit"
                sx={chipStyle}
              >
                {ui.header.projects}
              </Button>
              <Button href="#about" color="inherit" sx={chipStyle}>{ui.header.about}</Button>
              <Button href="#blogs" color="inherit" sx={chipStyle}>{ui.header.blogs}</Button>
            </Stack>

            {/*==========================================================================*/}
            {/* This stack contains the theme switch and GitHub link */}
            <Stack direction="row" alignItems="center" spacing={0.5} pr={1}>
              {/* This tooltip toggles the theme */}
              <Tooltip title={themeKey === "dark" ? ui.header.lightTooltip : ui.header.darkTooltip} arrow>
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
