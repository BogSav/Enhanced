import { parse } from "toml";
// eslint-disable-next-line import/no-unresolved
import raw from "./about.toml?raw";

export type Skill = { label: string; level: number; hint?: string };
export type AboutData = {
  stats: { years: number; projects: number; talks: number };
  skills: Skill[];
  radar: { labels: string[]; values: number[] };
  highlights: { title: string; desc: string }[];
};

const about = parse(raw) as AboutData;

// Basic runtime guards (non-throwing): fall back to safe shapes if needed
if (!about.stats) about.stats = { years: 0, projects: 0, talks: 0 } as any;
if (!Array.isArray(about.skills)) about.skills = [] as any;
if (!about.radar) about.radar = { labels: [], values: [] } as any;
if (!Array.isArray(about.highlights)) about.highlights = [] as any;

export default about;
