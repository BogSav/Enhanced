import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

import Section from "../components/Section";
import ui from "../content/parsers/UiTomlParser";

export default function BlogSection(): React.ReactElement {
  return (
    <Section id="blogs" title={ui.blog.title} index={3}>
      <Box id="blogs">
        <Stack spacing={2}>
          {/*Temporary placeholder until blogs are added*/}
          <Typography variant="h5" color="text.secondary">
            Coming soon...
          </Typography>

          <Typography color="text.secondary">{ui.blog.subtitle}</Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button variant="contained" href="/blog">
              {ui.blog.cta}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Section>
  );
}
