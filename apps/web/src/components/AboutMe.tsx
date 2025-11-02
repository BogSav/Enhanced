import * as React from "react";
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
  Grow,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Code, Memory, Public } from "@mui/icons-material";
import about from "../content/aboutData";

/**
 * Mic utilitar pentru counters animate (0 -> target) atunci când intră în viewport.
 */
function useCountUp(target: number, durationMs = 1200, start = false) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return value;
}

import { useInView } from "../hooks/useInView";

type Skill = { label: string; level: number; hint?: string };

// Card individual pentru un item din stats (emoji + titlu + counter animat)
function StatCard({
  title,
  value,
  emoji,
  start,
  index,
}: {
  title: string;
  value: number;
  emoji?: string;
  start: boolean;
  index: number;
}) {
  const count = useCountUp(value, 900 + index * 120, start);
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", md: "center" },
        textAlign: { xs: "center", md: "center" },
        justifyContent: "center",
        minHeight: { xs: "4.5rem", md: "auto" },
      }}
    >
      <Typography variant="body1" align="center" sx={{ p: 1 }}>
        {emoji ? (
          <Box
            component="span"
            aria-hidden
            sx={{ fontSize: 18, lineHeight: 1 }}
          >
            {emoji}
          </Box>
        ) : null}
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
        {count}
      </Typography>
    </Paper>
  );
}

export default function AboutMe(): React.ReactElement {
  const theme = useTheme();
  const { ref, inView } = useInView<HTMLDivElement>();

  // ======== Content from TOML ========
  const title = about.title ?? "About me";
  const subtitle = about.subtitle ?? "";
  const bio = about.bio ?? "";

  // Use Vite's base URL so the path works in dev and when deployed under a subpath
  const avatarSrc = `${import.meta.env.BASE_URL}ProfilePic.jpg`;

  const skills: Skill[] = about.skills as Skill[];

  // Stats list (from TOML): title/value/emoji and any count
  type Stat = { title: string; value: number; emoji?: string };
  const stats = about.stats as Stat[];

  // Un mic “radar” SVG minimalist (fără deps) — se animă pe intrare
  const radarValues = about.radar.values; // corresponds to radar labels
  const radarAnimated = radarValues.map((v) => (inView ? v : 0));

  // extract the inner content so we can render it either inside the local Paper (boxed)
  // or as raw content (when a parent Section provides the Paper).
  const inner = (
    <>
      {/* Header: avatar + titlu + tagline */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 6 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grow in={inView} timeout={700}>
          <Avatar
            src={avatarSrc}
            alt="Profile"
            sx={(t) => ({
              // responsive rem-based sizes (rem is relative to root font-size)
              width: { xs: "5.5rem", md: "10rem" },
              height: { xs: "5.5rem", md: "10rem" },
              // use rem for border thickness and theme divider color
              border: `0.2rem solid ${t.palette.divider}`,
              boxShadow: 3,
              flexShrink: 0,
            })}
          />
        </Grow>

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
            {about.chips && about.chips.length > 0 ? (
              about.chips.map((c, idx) => {
                const icon = (() => {
                  switch ((c.icon || "").toLowerCase()) {
                    case "code":
                      return <Code />;
                    case "memory":
                      return <Memory />;
                    case "public":
                      return <Public />;
                    default:
                      return undefined;
                  }
                })();
                const variant =
                  c.variant === "outlined" ? "outlined" : "filled";
                return (
                  <Chip
                    key={`${c.label}-${idx}`}
                    icon={icon}
                    label={c.label}
                    variant={variant as any}
                  />
                );
              })
            ) : (
              <>
                <Chip icon={<Code />} label="Systems & Graphics" />
                <Chip
                  icon={<Memory />}
                  label="Quantum-curious"
                  variant="outlined"
                />
                <Chip
                  icon={<Public />}
                  label="Open-source"
                  variant="outlined"
                />
              </>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Bio */}
      <Box sx={{ mt: 4 }}>
        <Fade in={inView} timeout={900}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: { xs: "100%", md: "56rem" } }}
          >
            {bio}
          </Typography>
        </Fade>
      </Box>

      <Divider sx={{ my: { xs: 3, md: 5 } }} />

      {/* Stats + Tech Snapshot */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
        {/* Stats */}
        <Stack flex={1} spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {about.statsTitle ?? "Snapshot"}
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
                key={`${s.title}-${idx}`}
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
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
              {about.skillsTitle ?? "Core skills"}
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
            {about.radarTitle ?? "Tech focus"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {about.radarHint ?? "Higher = deeper involvement right now"}
          </Typography>

          <Box
            sx={{
              mt: 2,
              display: "grid",
              placeItems: "center",
              // keep it within viewport width on phones; square via aspect-ratio
              width: { xs: "min(80vw, 16rem)", md: "18rem" },
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
              {/* axes */}
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
                        key={`l${i}`}
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
          {about.highlightsTitle ?? "Recent highlights"}
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ "& > *": { flex: 1 } }}
        >
          {about.highlights.map((h, idx) => (
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
    </>
  );

  return (
    <Box ref={ref} sx={{ scrollMarginTop: { xs: "5rem", md: "6.25rem" } }}>
      <Box sx={{ py: 1 }}>{inner}</Box>
    </Box>
  );
}
