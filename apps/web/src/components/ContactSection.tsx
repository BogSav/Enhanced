import { Box, Button, Typography } from "@mui/material";

import Section from "../components/Section";
import ui from "../content/parsers/UiTomlParser";

export default function ContactSection(): React.ReactElement {
  return (
    <Section index={4} id="contact">
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 700, whiteSpace: "pre-line" }}
        >
          {ui.contact.collab}
        </Typography>
        <Button
          size="large"
          variant="contained"
          href="mailto:bogdansava59@yahoo.com"
        >
          {ui.contact.emailButton}
        </Button>
      </Box>
    </Section>
  );
}
