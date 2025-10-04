import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
};

export default function ProjectCard({
  project,
}: {
  project: Project;
}): React.ReactElement {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        height: "100%",
        background: (t) =>
          t.palette.mode === "dark"
            ? "linear-gradient(-90deg, #111d2fff 20%, #130a13a7 100%)"
            : "linear-gradient(-90deg, #dbdbdbff 0%, #f7f9fc 100%)",
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/projects/${project.slug}`)}
        sx={{ height: "100%" }}
      >
        <CardHeader title={project.title} sx={{ pb: 0 }} />
        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>
          {project.tags && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {project.tags.map((t) => (
                <Chip key={t} label={t} size="small" />
              ))}
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
