/// <reference types="vite/client" />
declare module "*.mdx" {
  import React from "react";
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
