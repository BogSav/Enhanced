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
import { alpha, useTheme } from "@mui/material/styles";
import logo from "/LogoEnhancedV2.png";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

export default function Header({
  mode,
  onToggleMode,
  onLogoClick,
}: {
  mode: "light" | "dark";
  onToggleMode: () => void;
  onLogoClick?: () => void;
}): React.ReactElement {
  const theme = useTheme();
  const { i18n } = useTranslation();

  const toggleLanguage = (): void => {
    void i18n.changeLanguage(i18n.language === "en" ? "ro" : "en");
  };

  const glass = {
    borderRadius: 999,
    px: 1,
    py: 0.75,
    border: `1px solid ${alpha(
      theme.palette.common.white,
      mode === "dark" ? 0.08 : 0.12
    )}`,
    bgcolor: alpha(mode === "dark" ? "#0f141b" : "#ddddddff", 0.6),
    backgroundImage: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.12
    )}, ${alpha(theme.palette.secondary.main, 0.12)})`,
    backdropFilter: "saturate(180%) blur(14px)",
    boxShadow:
      mode === "dark"
        ? "0 6px 30px rgba(0,0,0,.35)"
        : "0 6px 24px rgba(0,0,0,.08)",
  } as const;

  const chip = {
    borderRadius: 999,
    fontWeight: 600,
    px: 1.5,
    height: 36,
  } as const;

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ p: 1 }}>
      <Container maxWidth="lg">
        <Box sx={glass}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            {/* Brand */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              onClick={onLogoClick}
              sx={{ cursor: "pointer", pl: 1 }}
            >
              <Box
                component="img"
                src={logo}
                alt="Enhanced"
                sx={{ width: 28, height: 28, borderRadius: 1 }}
              />
              <Typography variant="subtitle1" fontWeight={800}>
                Enhanced
              </Typography>
            </Stack>

            {/* Nav links */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button href="#features" color="inherit" sx={chip}>
                Features
              </Button>
              <Button href="#testimonials" color="inherit" sx={chip}>
                Testimonials
              </Button>
              <Button href="#highlights" color="inherit" sx={chip}>
                Highlights
              </Button>
              <Button
                component={RouterLink}
                to="/projects/quantum-hybrid-arch"
                color="inherit"
                sx={chip}
              >
                Projects
              </Button>
              <Button href="#pricing" color="inherit" sx={chip}>
                Pricing
              </Button>
              <Button href="#faq" color="inherit" sx={chip}>
                FAQ
              </Button>
              <Button href="#blog" color="inherit" sx={chip}>
                Blog
              </Button>
            </Stack>

            {/* Actions (no auth buttons) */}
            <Stack direction="row" alignItems="center" spacing={0.5} pr={1}>
              {/* Add Language Toggle */}
              <Tooltip
                title={
                  i18n.language === "en"
                    ? "Switch to Romanian"
                    : "Switch to English"
                }
              >
                <IconButton onClick={toggleLanguage} size="small" sx={chip}>
                  {i18n.language === "en" ? "RO" : "EN"}
                </IconButton>
              </Tooltip>
              <Tooltip
                title={mode === "dark" ? "Light mode" : "Dark mode"}
                arrow
              >
                <IconButton
                  onClick={onToggleMode}
                  color="inherit"
                  size="small"
                  sx={{ borderRadius: 999 }}
                >
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <IconButton
                color="inherit"
                href="https://github.com/"
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
