import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={800}>
        404
      </Typography>
      <Typography color="text.secondary">
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Go Home
      </Button>
    </Stack>
  );
}
