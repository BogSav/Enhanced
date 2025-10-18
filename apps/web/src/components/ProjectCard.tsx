import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// This structure is supposed to store all the metadata about a project extracted from the MDX frontmatter
// and is used to render the project cards on the home page
export type ProjectMetadata = {
  slug: string; // unique identifier, used in the URL
  title: string;
  description: string;
  tags?: string[];
  status: string;
};

export default function ProjectCard({
  projectMetadata,
}: {
  projectMetadata: ProjectMetadata;
}): React.ReactElement {
  const navigate = useNavigate();

  return (
    // The card component that displays project information
    <Card
      sx={{
        height: "100%",
        // Here we use a gradient background and shadow for a modern look
        background: (t) =>
          `linear-gradient(-45deg, ${t.palette.background.default} 40%, ${t.palette.secondary.main} 180%)`,
        borderRadius: 1.5,
        boxShadow: (t) =>
          `5px 5px 10px ${alpha(t.palette.text.secondary, 0.2)}`,
      }}
    >
      {/* We define the clickable area of the card that navigates to the project details page as the entire area of the card */}
      <CardActionArea
        onClick={() => navigate(`/projects/${projectMetadata.slug}`)}
        sx={{ height: "100%" }}
      >
        {/* First is the card header - which is the title of the project */}
        <CardHeader title={projectMetadata.title} sx={{ pb: 0 }} />

        {/* Then the card content - description, tags and status */}
        <CardContent>
          {/* Description of the project */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {projectMetadata.description}
          </Typography>

          {/* Tags associated with the project */}
          {/* We process all the available tags and dispaly them with a stack object */}
          {projectMetadata.tags && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {projectMetadata.tags.map((t) => (
                <Chip key={t} label={t} size="small" variant="filled" />
              ))}
            </Stack>
          )}

          {/* Status chip with special styling */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1, mt: 3 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                fontSize: "0.8rem",
                color: (t) => t.palette.text.primary,
              }}
            >
              Status:
            </Typography>
            <Chip
              label={projectMetadata.status}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "0.7rem",
                height: 24,
              }}
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
