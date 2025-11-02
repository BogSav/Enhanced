import { parse } from "toml";

// Import TOML file as raw string via Vite's ?raw import

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

// Type guard helper to check if a value is a non-null object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const parsed = parse(raw);

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
if (isObject(parsed)) {
  const p = parsed;

  if (isObject(p.header)) {
    const header = p.header;
    if (typeof header.home === "string") {
      ui.header.home = header.home;
    }
    if (typeof header.projects === "string") {
      ui.header.projects = header.projects;
    }
    if (typeof header.about === "string") {
      ui.header.about = header.about;
    }
    if (typeof header.blogs === "string") {
      ui.header.blogs = header.blogs;
    }
    if (typeof header.lightTooltip === "string") {
      ui.header.lightTooltip = header.lightTooltip;
    }
    if (typeof header.darkTooltip === "string") {
      ui.header.darkTooltip = header.darkTooltip;
    }
  }

  if (isObject(p.home)) {
    const h = p.home;
    if (typeof h.badge === "string") {
      ui.home.badge = h.badge;
    }
    if (typeof h.title === "string") {
      ui.home.title = h.title;
    }
    if (typeof h.subtitle === "string") {
      ui.home.subtitle = h.subtitle;
    }
    if (typeof h.ctaExplore === "string") {
      ui.home.ctaExplore = h.ctaExplore;
    }
    if (typeof h.ctaContact === "string") {
      ui.home.ctaContact = h.ctaContact;
    }
  }

  if (isObject(p.projects)) {
    const projects = p.projects;
    if (typeof projects.title === "string") {
      ui.projects.title = projects.title;
    }
    if (typeof projects.subtitle === "string") {
      ui.projects.subtitle = projects.subtitle;
    }
  }

  if (isObject(p.blog)) {
    const blog = p.blog;
    if (typeof blog.title === "string") {
      ui.blog.title = blog.title;
    }
    if (typeof blog.subtitle === "string") {
      ui.blog.subtitle = blog.subtitle;
    }
    if (typeof blog.cta === "string") {
      ui.blog.cta = blog.cta;
    }
  }

  if (isObject(p.contact)) {
    const contact = p.contact;
    if (typeof contact.collab === "string") {
      ui.contact.collab = contact.collab;
    }
    if (typeof contact.emailButton === "string") {
      ui.contact.emailButton = contact.emailButton;
    }
  }

  if (isObject(p.notFound)) {
    const notFound = p.notFound;
    if (typeof notFound.code === "string") {
      ui.notFound.code = notFound.code;
    }
    if (typeof notFound.message === "string") {
      ui.notFound.message = notFound.message;
    }
    if (typeof notFound.backHome === "string") {
      ui.notFound.backHome = notFound.backHome;
    }
  }

  if (isObject(p.infoPage)) {
    const infoPage = p.infoPage;
    if (typeof infoPage.errorTitle === "string") {
      ui.infoPage.errorTitle = infoPage.errorTitle;
    }
  }

  if (isObject(p.projectPage)) {
    const projectPage = p.projectPage;
    if (typeof projectPage.notFoundTitle === "string") {
      ui.projectPage.notFoundTitle = projectPage.notFoundTitle;
    }
    if (typeof projectPage.backHome === "string") {
      ui.projectPage.backHome = projectPage.backHome;
    }
  }

  if (isObject(p.mdxLoader)) {
    const mdxLoader = p.mdxLoader;
    if (typeof mdxLoader.errorTitleDefault === "string") {
      ui.mdxLoader.errorTitleDefault = mdxLoader.errorTitleDefault;
    }
    if (typeof mdxLoader.backHome === "string") {
      ui.mdxLoader.backHome = mdxLoader.backHome;
    }
    if (typeof mdxLoader.errorRenderFallback === "string") {
      ui.mdxLoader.errorRenderFallback = mdxLoader.errorRenderFallback;
    }
  }
}

export default ui;
