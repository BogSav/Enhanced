import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ui from "../content/parsers/HomeTomlParser";

export default function NotFound(): React.ReactElement {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={800}>
        {ui.notFound.code}
      </Typography>
      <Typography color="text.secondary">{ui.notFound.message}</Typography>
      <Button component={RouterLink} to="/" variant="contained">
        {ui.notFound.backHome}
      </Button>
    </Stack>
  );
}
