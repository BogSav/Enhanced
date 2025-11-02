import { parse } from "toml";

// Import TOML file as raw string via Vite's ?raw import
// eslint-disable-next-line import/no-unresolved
import raw from "../toml/about.toml?raw";

export type Skill = { label: string; level: number; hint?: string };
export type Stat = { title: string; value: number; emoji?: string };
export type Highlight = { title: string; desc: string };
export type Chip = {
  label: string;
  icon?: string;
  variant?: "filled" | "outlined";
};

export type AboutData = {
  // Top-level textual content for AboutMe (parser will provide defaults)
  title: string;
  subtitle: string;
  bio: string;
  // Section titles and hints
  statsTitle: string;
  skillsTitle: string;
  radarTitle: string;
  radarHint: string;
  highlightsTitle: string;
  stats: Stat[];
  skills: Skill[];
  radar: { labels: string[]; values: number[] };
  highlights: Highlight[];
  chips: Chip[];
};

const parsed = parse(raw) as any;

// sensible defaults so consumers don't need to provide fallbacks
const about: AboutData = {
  title: "About me",
  subtitle:
    "Engineer blending graphics, low-level systems, and quantum computing.",
  bio: "I design and build performant software — from CNC toolpath algorithms at ModuleWorks to experimental quantum-classical ideas under the Enhanced label. I love clean APIs, measurable performance, and thoughtful UX.",
  statsTitle: "Snapshot",
  skillsTitle: "Core skills",
  radarTitle: "Tech focus",
  radarHint: "Higher = deeper involvement right now",
  highlightsTitle: "Recent highlights",
  stats: [],
  skills: [],
  radar: { labels: [], values: [] },
  highlights: [],
  chips: [
    { label: "Systems & Architectures", icon: "code", variant: "filled" },
    { label: "Quantum-Computing", icon: "memory", variant: "outlined" },
    { label: "Graphics and AI", icon: "public", variant: "outlined" },
  ],
};

// Top-level strings (optional)
if (parsed && typeof parsed === "object") {
  const p: any = parsed;
  if (typeof p.title === "string") about.title = p.title;
  if (typeof p.subtitle === "string") about.subtitle = p.subtitle;
  if (typeof p.bio === "string") about.bio = p.bio;
  if (typeof p.statsTitle === "string") about.statsTitle = p.statsTitle;
  if (typeof p.skillsTitle === "string") about.skillsTitle = p.skillsTitle;
  if (typeof p.radarTitle === "string") about.radarTitle = p.radarTitle;
  if (typeof p.radarHint === "string") about.radarHint = p.radarHint;
  if (typeof p.highlightsTitle === "string")
    about.highlightsTitle = p.highlightsTitle;
}

// Stats: expect the modern array schema ([[stats]])
if (Array.isArray(parsed.stats)) {
  about.stats = parsed.stats as Stat[];
}

// Skills
if (Array.isArray(parsed.skills)) about.skills = parsed.skills as Skill[];

// Radar
if (parsed.radar && typeof parsed.radar === "object") {
  about.radar = {
    labels: Array.isArray(parsed.radar.labels)
      ? (parsed.radar.labels as string[])
      : [],
    values: Array.isArray(parsed.radar.values)
      ? (parsed.radar.values as number[])
      : [],
  };
}

// Highlights
if (Array.isArray(parsed.highlights))
  about.highlights = parsed.highlights as { title: string; desc: string }[];

// Chips (optional)
if (Array.isArray(parsed.chips))
  about.chips = parsed.chips as {
    label: string;
    icon?: string;
    variant?: "filled" | "outlined";
  }[];

export default about;
