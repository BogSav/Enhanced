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
import { Code, Memory, ShowChart, Public, Bolt } from "@mui/icons-material";

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

/**
 * Hook simplu pentru a ști când componenta e în viewport (pornește animațiile).
 */
function useInView<T extends Element>(margin = "0px 0px -20% 0px") {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { root: null, rootMargin: margin, threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [margin]);
  return { ref, inView } as const;
}

type Skill = { label: string; level: number; hint?: string };

export default function AboutMe({ boxed = true }: { boxed?: boolean }): React.ReactElement {
  const theme = useTheme();
  const { ref, inView } = useInView<HTMLDivElement>();

  // ======== English-only content (i18n removed) ========
  const title = "About me";
  const subtitle = "Engineer blending graphics, low-level systems, and quantum computing.";
  const bio = "I design and build performant software — from CNC toolpath algorithms at ModuleWorks to experimental quantum-classical ideas under the Enhanced label. I love clean APIs, measurable performance, and thoughtful UX.";

  // Use Vite's base URL so the path works in dev and when deployed under a subpath
  const avatarSrc = `${import.meta.env.BASE_URL}ProfilePic.jpg`;

  const defaultSkills: Skill[] = [
    { label: "C++20/23 • toolchains", level: 92, hint: "CMake, clang-cl, MSVC, presets" },
    { label: "GPU & Graphics", level: 88, hint: "DX12, compute, RT, pipelines" },
    { label: "Algorithms & CNC", level: 86, hint: "Links, deburring, geometry" },
    { label: "TypeScript/React", level: 84, hint: "MUI, Vite, SSR/CSR patterns" },
    { label: "Quantum (QC/QML)", level: 70, hint: "Hybrid architectures, oracles" },
  ];
  const skills: Skill[] = defaultSkills;

  // “Stats” – inspirat din profil (poți adapta din i18n: about.stats.*)
  const statYears = useCountUp(5, 1000, inView);
  const statProjects = useCountUp(25, 1200, inView);
  const statTalks = useCountUp(6, 1000, inView);

  // Un mic “radar” SVG minimalist (fără deps) — se animă pe intrare
  const radarValues = [0.92, 0.88, 0.86, 0.84, 0.7]; // corespunde cu skills
  const radarAnimated = radarValues.map((v) => (inView ? v : 0));

  // extract the inner content so we can render it either inside the local Paper (boxed)
  // or as raw content (when a parent Section provides the Paper).
  const inner = (
    <>
      {/* Header: avatar + titlu + tagline */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 3 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grow in={inView} timeout={700}>
          <Avatar
            src={avatarSrc}
            alt="Profile"
            sx={(t) => ({
              // responsive rem-based sizes (rem is relative to root font-size)
              width: { xs: "5.5rem", md: "7rem" },
              height: { xs: "5.5rem", md: "7rem" },
              // use rem for border thickness and theme divider color
              border: `0.2rem solid ${t.palette.divider}`,
              boxShadow: 3,
              flexShrink: 0,
            })}
          />
        </Grow>

        <Box sx={{
          width: { xs: "100%", md: "auto" },
          mt: { xs: 1, md: 0 },
          textAlign: { xs: "center", md: "left" },
        }}>
          <Fade in={inView} timeout={800}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}
            >
              {title}
            </Typography>
          </Fade>
          <Fade in={inView} timeout={1000}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: { xs: 0.5, md: 1 }, fontSize: { xs: "0.9rem", md: "1rem" } }}
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
            }}
          >
            <Chip icon={<Code />} label={"Systems & Graphics"} />
            <Chip icon={<Memory />} label={"Quantum-curious"} variant="outlined" />
            <Chip icon={<Public />} label={"Open-source"} variant="outlined" />
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
            {"Snapshot"}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 2, md: 2.5 },
              alignItems: "stretch",
            }}
          >
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
                justifyContent: "center",
                minHeight: { xs: "6.5rem", md: "auto" },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: "center", md: "flex-start" } }}>
                <Bolt fontSize="small" />
                <Typography variant="overline">Years exp.</Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {statYears}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
                justifyContent: "center",
                minHeight: { xs: "6.5rem", md: "auto" },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: "center", md: "flex-start" } }}>
                <ShowChart fontSize="small" />
                <Typography variant="overline">Projects</Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {statProjects}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
                justifyContent: "center",
                minHeight: { xs: "6.5rem", md: "auto" },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: "center", md: "flex-start" } }}>
                <Public fontSize="small" />
                <Typography variant="overline">Talks/Posts</Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {statTalks}
              </Typography>
            </Paper>
          </Box>

          {/* Skill bars */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
              {"Core skills"}
            </Typography>

            <Stack spacing={1.2}>
              {skills.map((s, idx) => (
                <Tooltip key={idx} title={s.hint ?? ""}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {s.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round((inView ? s.level : 0))}
                        %
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={inView ? s.level : 0}
                      sx={{
                        height: "0.5rem",
                        borderRadius: 999,
                        [`& .MuiLinearProgress-bar`]: {
                          transition: "transform 1200ms cubic-bezier(.2,.8,.2,1)",
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
            {"Tech focus"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {"Higher = deeper involvement right now"}
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
            <svg width="100%" height="100%" viewBox="0 0 260 260" role="img" aria-label="tech radar">
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
              <line x1="130" y1="10" x2="130" y2="250" stroke={theme.palette.primary.dark} strokeDasharray="4 6" />
              <line x1="10" y1="130" x2="250" y2="130" stroke={theme.palette.primary.dark} strokeDasharray="4 6" />

              {/* polygon (animated by recompute) */}
              {(() => {
                const labels = ["C++/Tooling", "Graphics", "CNC/Algo", "Web/TS", "Quantum"];
                const pts = radarAnimated.map((v, i) => {
                  const angle = (-90 + i * (360 / radarAnimated.length)) * (Math.PI / 180);
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
                        <circle cx={x} cy={y} r={4} fill={theme.palette.primary.main} />
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
          {"Recent highlights"}
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ "& > *": { flex: 1 } }}
        >
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {"CNC deburring & links"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {"Worked on robust clearance and deburring settings (UI + core), focusing on correctness and DX for complex toolpaths."}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {"RTXplore engine"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {"Exploring a high-performance open engine with ray tracing and compute-heavy pipelines."}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {"Hybrid quantum-classical"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {"Designing an OS/ISA concept to orchestrate quantum instructions alongside classical workloads."}
            </Typography>
          </Paper>
        </Stack>
      </Box>
    </>
  );

  return (
  <Box id="about" ref={ref} sx={{ scrollMarginTop: { xs: "5rem", md: "6.25rem" } }}>
      <Box sx={{ py: { xs: 4, md: 4 } }}>
        {boxed ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              background: (t) =>
                t.palette.mode === "dark"
                  ? `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.10)}, transparent 40%), radial-gradient(62.5rem 31.25rem at 100% 0%, ${alpha(
                      t.palette.secondary.main,
                      0.10
                    )}, transparent)`
                  : `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.10)}, transparent 40%), radial-gradient(62.5rem 31.25rem at 100% 0%, ${alpha(
                      t.palette.secondary.main,
                      0.08
                    )}, transparent)`,
            }}
          >
            {inner}
          </Paper>
        ) : (
          <Box>{inner}</Box>
        )}
      </Box>
    </Box>
  );
}
