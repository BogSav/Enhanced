import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import ui from "../content/uiText";

export default function BlogSection(): React.ReactElement {
  return (
    <Box id="blogs">
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{ui.blog.title}</Typography>
        <Typography color="text.secondary">{ui.blog.subtitle}</Typography>

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button variant="contained" href="/blog">{ui.blog.cta}</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
