import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

async function createProject() {
  const slug = await askQuestion("Project slug (e.g. quantum-computing): ");
  const title = {
    en: await askQuestion("English title: "),
    ro: await askQuestion("Romanian title: "),
  };
  const description = {
    en: await askQuestion("English description: "),
    ro: await askQuestion("Romanian description: "),
  };
  const tagsInput = await askQuestion("Tags (comma separated): ");
  const tags = tagsInput.split(",").map((tag) => tag.trim());

  // Create directories for assets
  const assetsDir = path.join("src", "assets", "projects", slug);
  fs.mkdirSync(assetsDir, { recursive: true });

  // Create MDX files for both languages
  const languages = ["en", "ro"];
  for (const lang of languages) {
    const contentDir = path.join("src", "content", "projects", lang);
    fs.mkdirSync(contentDir, { recursive: true });

    const mdxContent = `---
title: ${title[lang]}
description: ${description[lang]}
tags: ${JSON.stringify(tags)}
image: "/src/assets/projects/${slug}/hero.jpg"
---
import ProjectLayout from '../../../components/ProjectLayout';

# ${title[lang]}

${tags.map((tag) => `<ProjectTag>${tag}</ProjectTag>`).join("\n")}

## Overview

Your content here...

export default ({ children }) => <ProjectLayout frontmatter={{
  title: "${title[lang]}",
  description: "${description[lang]}",
  tags: ${JSON.stringify(tags)},
  image: "/src/assets/projects/${slug}/hero.jpg"
}}>{children}</ProjectLayout>`;

    fs.writeFileSync(path.join(contentDir, `${slug}.mdx`), mdxContent);
  }

  console.log(`
Project files created successfully!
- MDX files created at:
  - src/content/projects/en/${slug}.mdx
  - src/content/projects/ro/${slug}.mdx
- Asset directory created at:
  - src/assets/projects/${slug}/
`);

  rl.close();
}

createProject();
