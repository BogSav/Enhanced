import { parse } from "toml";

// Import TOML file as raw string via Vite's ?raw import
// eslint-disable-next-line import/no-unresolved
import raw from "../toml/ui.toml?raw";

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
  };
  projects: {
    title: string;
    subtitle: string;
  };
  blog: {
    title: string;
    subtitle: string;
    cta: string;
  };
  contact: {
    collab: string;
    emailButton: string;
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

const parsed = parse(raw) as any;

// sensible defaults so consumers across the app don't need to guard
const ui: UI = {
  header: {
    home: "Home",
    projects: "Projects",
    about: "About",
    blogs: "Blogs",
    lightTooltip: "Switch to light theme",
    darkTooltip: "Switch to dark theme",
  },
  home: {
    badge: "",
    title: "",
    subtitle: "",
    ctaExplore: "",
    ctaContact: "",
  },
  projects: {
    title: "",
    subtitle: "",
  },
  blog: {
    title: "",
    subtitle: "",
    cta: "",
  },
  contact: {
    collab: "",
    emailButton: "",
  },
  notFound: {
    code: "404",
    message: "Page not found",
    backHome: "Back to home",
  },
  infoPage: {
    errorTitle: "Error",
  },
  projectPage: {
    notFoundTitle: "Not found",
    backHome: "Back to home",
  },
  mdxLoader: {
    errorTitleDefault: "Unable to load content",
    backHome: "Back to home",
    errorRenderFallback: "An error occurred while rendering",
  },
};

// Validate and copy values from parsed TOML into our typed UI object
if (parsed && typeof parsed === "object") {
  const p: any = parsed;

  if (p.header && typeof p.header === "object") {
    if (typeof p.header.home === "string") ui.header.home = p.header.home;
    if (typeof p.header.projects === "string")
      ui.header.projects = p.header.projects;
    if (typeof p.header.about === "string") ui.header.about = p.header.about;
    if (typeof p.header.blogs === "string") ui.header.blogs = p.header.blogs;
    if (typeof p.header.lightTooltip === "string")
      ui.header.lightTooltip = p.header.lightTooltip;
    if (typeof p.header.darkTooltip === "string")
      ui.header.darkTooltip = p.header.darkTooltip;
  }

  if (p.home && typeof p.home === "object") {
    const h = p.home;
    if (typeof h.badge === "string") ui.home.badge = h.badge;
    if (typeof h.title === "string") ui.home.title = h.title;
    if (typeof h.subtitle === "string") ui.home.subtitle = h.subtitle;
    if (typeof h.ctaExplore === "string") ui.home.ctaExplore = h.ctaExplore;
    if (typeof h.ctaContact === "string") ui.home.ctaContact = h.ctaContact;
  }

  if (p.projects && typeof p.projects === "object") {
    if (typeof p.projects.title === "string")
      ui.projects.title = p.projects.title;
    if (typeof p.projects.subtitle === "string")
      ui.projects.subtitle = p.projects.subtitle;
  }

  if (p.blog && typeof p.blog === "object") {
    if (typeof p.blog.title === "string") ui.blog.title = p.blog.title;
    if (typeof p.blog.subtitle === "string") ui.blog.subtitle = p.blog.subtitle;
    if (typeof p.blog.cta === "string") ui.blog.cta = p.blog.cta;
  }

  if (p.contact && typeof p.contact === "object") {
    if (typeof p.contact.collab === "string")
      ui.contact.collab = p.contact.collab;
    if (typeof p.contact.emailButton === "string")
      ui.contact.emailButton = p.contact.emailButton;
  }

  if (p.notFound && typeof p.notFound === "object") {
    if (typeof p.notFound.code === "string") ui.notFound.code = p.notFound.code;
    if (typeof p.notFound.message === "string")
      ui.notFound.message = p.notFound.message;
    if (typeof p.notFound.backHome === "string")
      ui.notFound.backHome = p.notFound.backHome;
  }

  if (p.infoPage && typeof p.infoPage === "object") {
    if (typeof p.infoPage.errorTitle === "string")
      ui.infoPage.errorTitle = p.infoPage.errorTitle;
  }

  if (p.projectPage && typeof p.projectPage === "object") {
    if (typeof p.projectPage.notFoundTitle === "string")
      ui.projectPage.notFoundTitle = p.projectPage.notFoundTitle;
    if (typeof p.projectPage.backHome === "string")
      ui.projectPage.backHome = p.projectPage.backHome;
  }

  if (p.mdxLoader && typeof p.mdxLoader === "object") {
    if (typeof p.mdxLoader.errorTitleDefault === "string")
      ui.mdxLoader.errorTitleDefault = p.mdxLoader.errorTitleDefault;
    if (typeof p.mdxLoader.backHome === "string")
      ui.mdxLoader.backHome = p.mdxLoader.backHome;
    if (typeof p.mdxLoader.errorRenderFallback === "string")
      ui.mdxLoader.errorRenderFallback = p.mdxLoader.errorRenderFallback;
  }
}

export default ui;
