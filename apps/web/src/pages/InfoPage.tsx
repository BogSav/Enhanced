import { useTranslation } from "react-i18next";

import MDXLoader, { type ModulesMap } from "../components/MDXLoader";

// Prepare modules map and pass to shared MDXLoader
// There is no eager loading here, only lazy loading by path
const roPages = import.meta.glob("../locales/ro/legal/*.mdx");
const enPages = import.meta.glob("../locales/en/legal/*.mdx");

export default function InfoPage({
  slug,
}: {
  slug: string;
}): React.ReactElement {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const modules = (language.startsWith("ro") ? roPages : enPages) as ModulesMap;

  return (
    <MDXLoader
      slug={slug}
      language={language}
      modules={modules}
      pathPrefix={"legal/"}
      errorTitle={"Page not available"}
    />
  );
}
