// ---------------------------------------------------------------------------
// Ambient Type Declarations – Vite + MDX
// ---------------------------------------------------------------------------
// Purpose:
//   Provide TypeScript context for:
//     1. Vite runtime types (import.meta.*, HMR client helpers, env vars).
//     2. Importing .mdx files as React components (default export = component).
//
// Why this exists:
//   - Without the module declaration, `import X from "./page.mdx"` would be inferred as `any`,
//     losing compile‑time safety and IntelliSense.
//   - The triple-slash reference pulls in `vite/client` types (e.g. `import.meta.env`).
//
// Extension notes:
//   If later you strongly type frontmatter (e.g. { title: string; date: string }) exposed by the
//   MDX processing pipeline, you can refine the component signature or add a named export like
//   `export const frontmatter: Frontmatter;`. Kept generic now for flexibility.
// ---------------------------------------------------------------------------
/// <reference types="vite/client" />

declare module "*.mdx" {
  // React component generated from MDX content.
  // `props` kept generic for now (no strict frontmatter-driven contract yet).
  const MDXComponent: (props: Record<string, unknown>) => JSX.Element;
  export default MDXComponent;
}
