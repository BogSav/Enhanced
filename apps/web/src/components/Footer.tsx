import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import {
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

export default function Footer(): React.ReactElement {
  return (
    <Box component="footer" id="contact" sx={{ mt: 6, py: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Container>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Enhanced
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Bogdan. All rights reserved.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton aria-label="email" href="mailto:hello@enhanced.com">
              <EmailIcon />
            </IconButton>
            <IconButton
              aria-label="linkedin"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              aria-label="x"
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
            >
              <XIcon />
            </IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Bucharest, RO
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
