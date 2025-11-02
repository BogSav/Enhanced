import { parse } from "toml";
// eslint-disable-next-line import/no-unresolved
import raw from "./about.toml?raw";

export type Skill = { label: string; level: number; hint?: string };
export type Stat = { title: string; value: number; emoji?: string };
export type AboutData = {
  // Top-level textual content for AboutMe
  title?: string;
  subtitle?: string;
  bio?: string;
  // Section titles and hints
  statsTitle?: string;
  skillsTitle?: string;
  radarTitle?: string;
  radarHint?: string;
  highlightsTitle?: string;
  stats: Stat[];
  skills: Skill[];
  radar: { labels: string[]; values: number[] };
  highlights: { title: string; desc: string }[];
  chips?: { label: string; icon?: string; variant?: "filled" | "outlined" }[];
};

let parsed: any;
try {
  parsed = parse(raw) as any;
} catch (err) {
  // Some TOML parsers can throw on duplicate keys like repeated `[[stats]]` in
  // certain edge cases or parser versions. Provide a tolerant fallback that
  // extracts the small known schema we need so the app can continue running.
  // This keeps behavior stable without adding a dependency.
  // eslint-disable-next-line no-console
  console.warn("TOML parse failed, using fallback parser:", err);

  const fallbackParse = (s: string) => {
    const out: any = {};

    // parse [[stats]] blocks
    const statsParts = s.split(/\n\s*\[\[stats\]\]/i).slice(1);
    out.stats = statsParts.map((part) => {
      const block = part.split(/\n\s*\[\[/)[0];
      const titleMatch = block.match(/title\s*=\s*"([^"]+)"/i);
      const valueMatch = block.match(/value\s*=\s*([0-9.]+)/i);
      const emojiMatch = block.match(/emoji\s*=\s*"([^"]+)"/i);
      return {
        title: titleMatch ? titleMatch[1] : "",
        value: valueMatch ? Number(valueMatch[1]) : 0,
        emoji: emojiMatch ? emojiMatch[1] : undefined,
      };
    });

    // parse [[skills]] blocks
    const skillsParts = s.split(/\n\s*\[\[skills\]\]/i).slice(1);
    out.skills = skillsParts.map((part) => {
      const block = part.split(/\n\s*\[\[/)[0];
      const labelMatch = block.match(/label\s*=\s*"([^"]+)"/i);
      const levelMatch = block.match(/level\s*=\s*([0-9.]+)/i);
      const hintMatch = block.match(/hint\s*=\s*"([^"]+)"/i);
      return {
        label: labelMatch ? labelMatch[1] : "",
        level: levelMatch ? Number(levelMatch[1]) : 0,
        hint: hintMatch ? hintMatch[1] : undefined,
      };
    });

    // parse [radar]
    const radarMatch = s.match(/\[radar\]([\s\S]*?)(?:\n\s*\[|$)/i);
    out.radar = { labels: [], values: [] };
    if (radarMatch) {
      const body = radarMatch[1];
      const labelsMatch = body.match(/labels\s*=\s*\[([^\]]*)\]/i);
      const valuesMatch = body.match(/values\s*=\s*\[([^\]]*)\]/i);
      if (labelsMatch) {
        out.radar.labels = Array.from(
          labelsMatch[1].matchAll(/"([^"]+)"/g)
        ).map((m: any) => m[1]);
      }
      if (valuesMatch) {
        out.radar.values = valuesMatch[1]
          .split(/,/)
          .map((v: string) => Number(v.trim()))
          .filter((n: number) => !Number.isNaN(n));
      }
    }

    // parse [[highlights]]
    const highlightsParts = s.split(/\n\s*\[\[highlights\]\]/i).slice(1);
    out.highlights = highlightsParts.map((part) => {
      const block = part.split(/\n\s*\[\[/)[0];
      const titleMatch = block.match(/title\s*=\s*"([^"]+)"/i);
      const descMatch = block.match(/desc\s*=\s*"([^"]+)"/i);
      return {
        title: titleMatch ? titleMatch[1] : "",
        desc: descMatch ? descMatch[1] : "",
      };
    });

    // parse [[chips]] (optional)
    const chipsParts = s.split(/\n\s*\[\[chips\]\]/i).slice(1);
    out.chips = chipsParts.map((part) => {
      const block = part.split(/\n\s*\[\[/)[0];
      const labelMatch = block.match(/label\s*=\s*\"([^\"]+)\"/i);
      const iconMatch = block.match(/icon\s*=\s*\"([^\"]+)\"/i);
      const variantMatch = block.match(/variant\s*=\s*\"([^\"]+)\"/i);
      return {
        label: labelMatch ? labelMatch[1] : "",
        icon: iconMatch ? iconMatch[1] : undefined,
        variant: variantMatch ? variantMatch[1] : undefined,
      };
    });

    return out;
  };

  parsed = fallbackParse(raw);
}
const about: AboutData = {
  title: undefined,
  subtitle: undefined,
  bio: undefined,
  statsTitle: undefined,
  skillsTitle: undefined,
  radarTitle: undefined,
  radarHint: undefined,
  highlightsTitle: undefined,
  stats: [],
  skills: [],
  radar: { labels: [], values: [] },
  highlights: [],
  chips: [],
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

// Stats: support new schema ([[stats]]) and gracefully map old object schema
if (Array.isArray(parsed.stats)) {
  about.stats = parsed.stats as Stat[];
} else if (parsed.stats && typeof parsed.stats === "object") {
  const s = parsed.stats as {
    years?: number;
    projects?: number;
    talks?: number;
  };
  const tmp: Stat[] = [];
  if (typeof s.years === "number")
    tmp.push({ title: "Years", value: s.years, emoji: "⚡" });
  if (typeof s.projects === "number")
    tmp.push({ title: "Projects", value: s.projects, emoji: "📈" });
  if (typeof s.talks === "number")
    tmp.push({ title: "Talks", value: s.talks, emoji: "🌍" });
  about.stats = tmp;
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
