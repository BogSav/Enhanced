import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

export default function Footer(): React.ReactElement {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={(t) => ({
        mt: "auto",
        pt: 4,
        pb: 4,
        borderTop: `2px solid ${t.palette.divider}`,
      })}
    >
      {/* Main container for the footer content */}
      <Container>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          {/* Brand + copyright/licensing */}
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Enhanced
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © 2019–{year} Bogdan S. Code: MIT · Content: CC BY-NC 4.0
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Bucharest, RO
            </Typography>
          </Box>

          {/* Socials */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="bogdansava59@yahoo.com">
              <IconButton
                aria-label="Email"
                href="mailto:bogdansava59@yahoo.com"
              >
                <EmailIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <IconButton
                aria-label="LinkedIn"
                href="https://www.linkedin.com/in/bogdan-sava-613212177"
                target="_blank"
                rel="noopener noreferrer me"
              >
                <LinkedInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="GitHub">
              <IconButton
                aria-label="GitHub"
                href="https://github.com/BogSav"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Legal/utility links */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Link
              href="/privacy"
              underline="hover"
              variant="body2"
              color="text.secondary"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              underline="hover"
              variant="body2"
              color="text.secondary"
            >
              Cookies
            </Link>
            <Link
              href="/licenses"
              underline="hover"
              variant="body2"
              color="text.secondary"
            >
              Licenses
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
