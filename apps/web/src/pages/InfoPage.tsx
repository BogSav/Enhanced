import MDXLoader, { type ModulesMap } from "../components/MDXLoader";

// English-only legal pages
const legalPages = import.meta.glob("../content/legal/*.mdx");

export default function InfoPage({
  slug,
}: {
  slug: string;
}): React.ReactElement {
  const modules = legalPages as ModulesMap;

  return (
    <MDXLoader
      slug={slug}
      modules={modules}
      pathPrefix={"legal/"}
      errorTitle={"Page not available"}
    />
  );
}
