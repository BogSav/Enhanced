// -----------------------------------------------------------------------------
// Enhanced – Flat ESLint Configuration (ESM)
// -----------------------------------------------------------------------------
// Purpose:
//   Provide a single source of truth for code quality, type safety, import hygiene,
//   accessibility, and maintainability across the React + TypeScript frontend.
//
// Core objectives:
//   1. Strict TypeScript analysis (type-aware) using typescript-eslint recommended + strict layers.
//   2. Enforce correct React Hooks usage + support fast refresh dev patterns.
//   3. Deterministic, readable import ordering and dead import detection.
//   4. Baseline accessibility hints (jsx-a11y) for inclusive UI.
//   5. Complexity & code smell surfacing (sonarjs) before they accumulate.
//   6. Prevent common anti‑patterns (floating promises, misused async, unused vars).
//
// Notes:
//   - Flat config API (introduced in ESLint v9) replaces legacy extends-based cascading.
//   - Type-aware rules require explicit tsconfig project references (we pass both app + node configs).
//   - Unused imports are handled by eslint-plugin-unused-imports (faster, auto-fixable) instead of the
//     built-in no-unused-vars rule, which is disabled accordingly.
//   - Complexity limits are WARN-level: they guide refactoring without blocking quick experiments.
//   - All paths resolve correctly inside Docker by normalizing tsconfigRootDir.
//
// Possible future enhancements:
//   - Add rule overrides for test files (*.test.ts/tsx) to relax complexity and console usage.
//   - Integrate security-focused linting (eslint-plugin-security or eslint-plugin-no-secrets).
//   - Add import path alias verification once path mapping grows.
//   - Configure formatting to rely solely on a formatter (e.g. Prettier) and disable stylistic rules here.
// -----------------------------------------------------------------------------

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Resolve directory robustly (works both locally and inside container /app)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  // Ignore generated output / coverage artifacts globally (any depth)
  globalIgnores(["dist", "coverage"]),

  // Primary configuration targeting TypeScript & React source files
  {
    files: ["**/*.{ts,tsx}"],
    // Layered recommendations: baseline JS, then progressively stricter TS type checking & React hooks
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      sonarjs,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
      // Explicit list of TS project configs; avoids auto-detect false negatives in Docker
      parserOptions: {
        project: [
          path.join(__dirname, "tsconfig.app.json"),
          path.join(__dirname, "tsconfig.node.json"),
        ],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // ---------- General Code Quality ----------
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "object-shorthand": ["error", "always"],

      // ---------- TypeScript Specific ----------
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      "@typescript-eslint/no-unused-vars": "off", // gestionăm cu unused-imports
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      // ---------- Import Management ----------
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-cycle": "warn",
      "import/no-mutable-exports": "error",

      // ---------- Dead / Unused Imports & Variables ----------
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // React Hooks rules provided by react-hooks plugin config chain (no duplication needed)

      // ---------- Accessibility (baseline) ----------
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // ---------- Complexity / Maintainability ----------
      "sonarjs/cognitive-complexity": ["warn", 20],
      "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }],
    },
  },

  // Configuration overrides for Node-targeted build / tool scripts (if present later)
  {
    files: ["**/*.config.{js,cjs,mjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "import/no-extraneous-dependencies": "off", // Config scripts may import devDependencies legitimately
    },
  },
]);
