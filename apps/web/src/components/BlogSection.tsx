import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function BlogSection(): React.ReactElement {
  return (
    <Box id="blogs">
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>From the blog</Typography>
        <Typography color="text.secondary">
          Short summaries of recent posts will appear here. For now, visit the blog index to see older posts.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button variant="contained" href="/blog">Browse posts</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
