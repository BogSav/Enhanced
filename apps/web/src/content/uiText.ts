import { parse } from "toml";
// Import TOML file as raw string via Vite's ?raw import
// eslint-disable-next-line import/no-unresolved
import raw from "./ui.toml?raw";

export type UI = {
  header: {
    home: string;
    projects: string;
    about: string;
    blogs: string;
    lightTooltip: string;
    darkTooltip: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    ctaExplore: string;
    ctaContact: string;
    projectsTitle: string;
    blogsTitle: string;
    collab: string;
    emailButton: string;
  };
  blog: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    subtitle: string;
    bio: string;
    code: string;
    quantum: string;
    open: string;
    statsTitle: string;
    years: number;
    projects: number;
    talks: number;
    yearsLabel: string;
    projectsLabel: string;
    talksLabel: string;
    skillsTitle: string;
    radarTitle: string;
    radarHint: string;
    highlightsTitle: string;
    highlight1Title: string;
    highlight1Desc: string;
    highlight2Title: string;
    highlight2Desc: string;
    highlight3Title: string;
    highlight3Desc: string;
  };
  notFound: {
    code: string;
    message: string;
    backHome: string;
  };
  infoPage: {
    errorTitle: string;
  };
  projectPage: {
    notFoundTitle: string;
    backHome: string;
  };
  mdxLoader: {
    errorTitleDefault: string;
    backHome: string;
    errorRenderFallback: string;
  };
};

const ui = parse(raw) as UI;

export default ui;
