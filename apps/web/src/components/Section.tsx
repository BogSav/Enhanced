import { Container, Paper, Typography, Box, Grow } from "@mui/material";
import React from "react";

import type { SxProps, Theme } from "@mui/material";

export default function Section({
  id,
  title,
  children,
  sx,
  index = 0,
}: {
  id?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  index?: number;
}): React.ReactElement {
  return (
    <Container id={id} maxWidth="lg">
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <Grow
          in
          timeout={500}
          style={{
            transformOrigin: "top center",
            transitionDelay: `${String(index * 150)}ms`,
          }}
        >
          <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, ...(sx as object) }}
          >
            {title ? (
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                {title}
              </Typography>
            ) : null}

            {children}
          </Paper>
        </Grow>
      </Box>
    </Container>
  );
}
