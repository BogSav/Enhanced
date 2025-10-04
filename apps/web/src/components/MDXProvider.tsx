import { MDXProvider } from "@mdx-js/react";

import { ProjectImage, ProjectTag } from "./ProjectLayout";

import type { ReactNode } from "react";

const components = {
  ProjectImage,
  ProjectTag,
};

type MDXProviderWrapperProps = {
  children: ReactNode;
};

export default function MDXProviderWrapper({
  children,
}: MDXProviderWrapperProps): React.ReactElement {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
