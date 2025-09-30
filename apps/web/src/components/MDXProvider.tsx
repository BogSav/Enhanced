import { MDXProvider } from "@mdx-js/react";
import { ReactNode } from "react";
import { ProjectImage, ProjectTag } from "./ProjectLayout";

const components = {
  ProjectImage,
  ProjectTag,
};

interface MDXProviderWrapperProps {
  children: ReactNode;
}

export default function MDXProviderWrapper({
  children,
}: MDXProviderWrapperProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
