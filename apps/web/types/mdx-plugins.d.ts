// Ambient module declarations for MDX-related remark/rehype plugins without bundled types.
// Keeps TypeScript (in bundler moduleResolution mode) from flagging missing declarations.
// If official @types packages are later added, this file can be removed.

declare module "remark-frontmatter";
declare module "remark-gfm";
declare module "remark-mdx-frontmatter";
declare module "rehype-highlight";
