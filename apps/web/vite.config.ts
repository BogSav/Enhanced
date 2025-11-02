// ---------------------------------------------------------------------------
// Vite configuration for the Enhanced web frontend
// ---------------------------------------------------------------------------
// Key responsibilities:
//   - Enable React Fast Refresh & modern JSX transform via @vitejs/plugin-react.
//   - Process MDX content with frontmatter extraction and GitHub-flavored markdown.
//   - Provide syntax highlighting in rendered MDX blocks via rehype-highlight.
//   - Configure reliable file watching in containerized environments (polling)
//     and explicit HMR endpoint settings.
//
// Notes:
//   - The MDX plugin is placed with `enforce: 'pre'` to ensure markdown/MDX is
//     transformed before React plugin handles JSX.
//   - Frontmatter is exposed under the key `frontmatter` (see remark-mdx-frontmatter config).
//   - If future performance tuning is needed, consider enabling Vite's `esbuild`
//     specific JSX options or adding a bundle visualize plugin in analyze mode.
//   - For production, most dev server options here are ignored (only build output matters).
// ---------------------------------------------------------------------------

import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeHighlight from "rehype-highlight";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // MDX processing pipeline (runs before React plugin)
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter, // Raw YAML frontmatter parsing
          [remarkMdxFrontmatter, { name: "frontmatter" }], // Export frontmatter as named data
          remarkGfm, // GitHub-flavored markdown (tables, strikethrough, task lists)
        ],
        rehypePlugins: [rehypeHighlight], // Syntax highlighting for fenced code blocks
      }),
    },
    // React + Fast Refresh
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and React DOM into their own chunk
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Material-UI core components
          "mui-core": ["@mui/material", "@mui/lab"],
          // Material-UI styling and icons
          "mui-icons": ["@mui/icons-material"],
          emotion: ["@emotion/react", "@emotion/styled"],
          // MDX and related plugins
          mdx: ["@mdx-js/react"],
        },
      },
    },
    // Increase chunk size warning limit to 600kb to avoid false positives
    chunkSizeWarningLimit: 600,
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      protocol: "ws", // Explicit WebSocket (can switch to wss behind secure proxy)
      host: "localhost", // Browser perspective host (adjust if remote tunneling)
      port: 5173,
    },
  },
});
