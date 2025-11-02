import {
  Avatar,
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  Fade,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import * as React from "react";

import about from "../content/parsers/AboutTomlParser";
import { useInView } from "../hooks/useInView";

import { StatCard, LinkedinLink } from "./CommonComponents";
import { getIconComponent } from "./IconHelpers";

import type {
  Skill,
  Stat,
  Highlight,
  Chip as ChipType,
} from "../content/parsers/AboutTomlParser";
import Section from "./Section";

export default function AboutMeSection(): React.ReactElement {
  const theme = useTheme();
  const { ref, inView } = useInView<HTMLDivElement>();

  // Extract content from TOML files (parser provides sensible defaults)
  const title: string = about.title;
  const subtitle: string = about.subtitle;
  const bio: string = about.bio;
  const skills: Skill[] = about.skills;
  const stats: Stat[] = about.stats;
  const chips: ChipType[] = about.chips;

  // A small minimalist "radar" SVG (no deps) — animates on entry
  const radarValues: number[] = about.radar.values; // corresponds to radar labels
  const radarAnimated = radarValues.map((v) => (inView ? v : 0));

  const avatarSrc = `${import.meta.env.BASE_URL}ProfilePic.jpg`;
  const avatarSrcSet = [
    `${import.meta.env.BASE_URL}ProfilePic-88.jpg 88w`,
    `${import.meta.env.BASE_URL}ProfilePic-176.jpg 176w`,
    `${import.meta.env.BASE_URL}ProfilePic-320.jpg 320w`,
  ].join(", ");

  // extract the inner content so we can render it either inside the local Paper (boxed)
  // or as raw content (when a parent Section provides the Paper).
  const inner = (
    <Section id="about" index={1}>
      {/* Header: avatar + title + tagline */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 6 }}
        alignItems="center"
        justifyContent="center"
      >
        {/* Avatar with border and shadow - no animation to prevent compositing blur */}
        <Avatar
          src={avatarSrc}
          alt="Profile"
          slotProps={{
            img: {
              loading: "eager",
              decoding: "async",
              fetchPriority: "high",
              srcSet: avatarSrcSet,
              sizes: "(min-width: 900px) 160px, 88px",
              style: {
                objectFit: "cover",
                imageRendering: "-webkit-optimize-contrast",
              },
            },
          }}
          sx={(t) => ({
            width: { xs: 88, md: 160 },
            height: { xs: 88, md: 160 },
            border: `0.2rem solid ${t.palette.divider}`,
            boxShadow: 3,
            flexShrink: 0,
            // Force GPU rendering with sharp text/image hints
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            WebkitFontSmoothing: "subpixel-antialiased",
          })}
        />

        {/* Title, subtitle, and chips */}
        <Box
          sx={{
            width: { xs: "100%", md: "auto" },
            mt: { xs: 1, md: 0 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Fade in={inView} timeout={800}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              {title}
            </Typography>
          </Fade>
          <Fade in={inView} timeout={1000}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mt: { xs: 0.5, md: 1 },
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {subtitle}
            </Typography>
          </Fade>

          {/* Tag chips */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 2,
              justifyContent: { xs: "center", md: "flex-start" },
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {chips.length > 0
              ? chips.map((c: ChipType, idx: number) => {
                  const icon = getIconComponent(c.icon);
                  return (
                    <Chip
                      key={`${c.label}-${String(idx)}`}
                      icon={icon}
                      label={c.label}
                      variant={c.variant as "filled" | "outlined"}
                    />
                  );
                })
              : null}
          </Stack>
        </Box>
      </Stack>

      {/* Bio - (short summary - descriptive subtitle) */}
      <Box sx={{ mt: 4 }}>
        <Fade in={inView} timeout={900}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: { xs: "100%", md: "56rem" }, mb: 2 }}
          >
            {bio}
          </Typography>
        </Fade>
        <LinkedinLink
          url="https://www.linkedin.com/in/bogdan-sava-613212177"
          label="Check my Linkedin"
          iconSize="medium"
        />
      </Box>

      <Divider sx={{ my: { xs: 3, md: 5 } }} />

      {/* Stats + Tech Snapshot */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
        {/* Stats */}
        <Stack flex={1} spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {about.statsTitle}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(auto-fit, minmax(160px, 1fr))",
                md: "repeat(3, minmax(200px, 1fr))",
              },
              gap: { xs: 2, md: 3 },
              alignItems: "stretch",
            }}
          >
            {stats.map((s, idx) => (
              <StatCard
                key={`${s.title}-${String(idx)}`}
                title={s.title}
                emoji={s.emoji}
                value={s.value}
                start={inView}
                index={idx}
              />
            ))}
          </Box>

          {/* Skill bars */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">{about.skillsTitle}</Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1.5, fontWeight: 700 }}
            >
              {about.skillsSubtitle}
            </Typography>

            <Stack spacing={1.2}>
              {skills.map((s, idx) => (
                <Tooltip key={idx} title={s.hint ?? ""}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {s.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(inView ? s.level : 0)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={inView ? s.level : 0}
                      sx={{
                        height: "0.5rem",
                        borderRadius: 999,
                        [`& .MuiLinearProgress-bar`]: {
                          transition:
                            "transform 1200ms cubic-bezier(.2,.8,.2,1)",
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Tech Radar (mini) */}
        <Paper
          sx={{
            flexBasis: { xs: "100%", lg: 380 },
            flexGrow: 0,
            width: "100%",
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {about.radarTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {about.radarHint}
          </Typography>

          {/* Radar polygon */}
          <Box
            sx={{
              mt: 7,
              display: "grid",
              placeItems: "center",
              // keep it within viewport width on phones; square via aspect-ratio
              width: { xs: "min(80vw, 17rem)", md: "17rem" },
              aspectRatio: "1 / 1",
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 260 260"
              role="img"
              aria-label="tech radar"
            >
              {/* grid rings */}
              {[40, 70, 100].map((r) => (
                <circle
                  key={r}
                  cx="130"
                  cy="130"
                  r={r}
                  fill="none"
                  stroke={theme.palette.primary.dark}
                  strokeDasharray="4 6"
                />
              ))}
              {/* axes - X and Y */}
              <line
                x1="130"
                y1="10"
                x2="130"
                y2="250"
                stroke={theme.palette.primary.dark}
                strokeDasharray="4 6"
              />
              <line
                x1="10"
                y1="130"
                x2="250"
                y2="130"
                stroke={theme.palette.primary.dark}
                strokeDasharray="4 6"
              />

              {/* polygon (animated by recompute) */}
              {(() => {
                const labels = about.radar.labels;

                // For each value, we compute an initial position on the unit circle
                // (all the values are equidistributed based on the number of labels)
                // and then displace them using the value scaled to the radar radius
                const pts = radarAnimated.map((v, i) => {
                  const angle =
                    (-90 + i * (360 / radarAnimated.length)) * (Math.PI / 180);
                  const r = 110 * v;
                  return [130 + r * Math.cos(angle), 130 + r * Math.sin(angle)];
                });
                const path = pts.map((p) => p.join(",")).join(" ");
                return (
                  <>
                    <polygon
                      points={path}
                      fill={alpha(theme.palette.primary.main, 0.18)}
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                    />
                    {pts.map(([x, y], i) => (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r={4}
                          fill={theme.palette.primary.main}
                        />
                      </g>
                    ))}
                    {/* labels around */}
                    {pts.map(([x, y], i) => (
                      <text
                        key={`l${String(i)}`}
                        x={x}
                        y={y}
                        dx={x < 130 ? -8 : 8}
                        dy={y < 130 ? -8 : 12}
                        fontSize="10"
                        textAnchor={x < 130 ? "end" : "start"}
                        fill={theme.palette.text.secondary}
                      >
                        {labels[i]}
                      </text>
                    ))}
                  </>
                );
              })()}
            </svg>
          </Box>
        </Paper>
      </Stack>

      {/* Highlights */}
      <Divider sx={{ my: { xs: 3, md: 5 } }} />
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          {about.highlightsTitle}
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ "& > *": { flex: 1 } }}
        >
          {about.highlights.map((h: Highlight, idx: number) => (
            <Paper key={idx} sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {h.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {h.desc}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Section>
  );

  return (
    <Box ref={ref} sx={{ scrollMarginTop: { xs: "5rem", md: "6.25rem" } }}>
      <Box sx={{ py: 1 }}>{inner}</Box>
    </Box>
  );
}
