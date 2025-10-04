# Enhanced

## Introduction

Enhanced is a personal platform that acts as an interactive project portfolio and (future) blog hub. It began as a purely static frontend focused on showcasing programming skills, but the layout and repository are intentionally prepared for expansion into a microservice-based system. At present only the web application (apps/web) is active; the API layer (apps/api) is a placeholder for future dynamic capabilities like content management, authentication, analytics, and authoring tools.

## Architecture & Project Structure

The repository follows a workspace-style layout to keep future services isolated yet consistent.

```
.
├─ apps/
│  ├─ web/                Frontend React application (currently the whole platform)
│  └─ api/                Reserved for backend / microservices (not implemented yet)
├─ docker-compose.yml     Orchestration for dev and prod profiles
├─ README.md              Documentation
└─ (Dockerfile[s])        One per service
```

Inside `apps/web`, the current structure is:

**Source files (`src/`)**:

- `components/` — reusable UI elements (Header, Footer, ProjectCard, MDXProvider, ErrorBoundary)
- `pages/` — route-level views (Home, ProjectPage, NotFound)
- `locales/` — translation resources (en/, ro/ with common.json + MDX content)
- `assets/` — static resources (images, icons)
- `App.tsx` — root component with routing logic
- `main.tsx` — React app entry point and DOM mounting
- `i18n.ts` — i18next initialization and configuration
- `index.css` / `App.css` — global and component-level styles
- `vite-env.d.ts` — ambient type declarations for Vite + MDX

**Configuration files**:

- `package.json` — dependencies, scripts, Node.js engine requirements
- `vite.config.ts` — build tool configuration (React, MDX, dev server)
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — TypeScript compilation settings
- `eslint.config.js` — linting rules and code quality enforcement
- `index.html` — HTML shell and app entry point
- `Dockerfile` / `Dockerfile.dev` — containerization for prod/dev environments
- `nginx.conf` / `nginx.app.conf` — web server configuration for production

This separation keeps presentation, routing, content, and configuration understandable and allows an eventual API service to plug in without restructuring the frontend.

## Technologies

- **React 19**: Core UI library for the single‑page application; functional components + hooks, React Router integration for client routing, future‑ready for streaming/concurrent features.
- **TypeScript**: Strict typing across the codebase; incremental project build (`tsc -b`) runs before production bundling to surface type errors early.
- **Vite**: Development server with fast cold starts and HMR; production bundler producing optimized ESM output; `@vitejs/plugin-react` enables fast refresh + JSX transform.
- **Material UI (v7) + Icons**: Design system, accessible component primitives, theme customization (palette/typography/spacing), icon set via `@mui/icons-material` for consistent visual language.
- **Emotion**: Styling engine used implicitly by Material UI and explicitly for custom styled components and `sx` shortcuts; enables theme token reuse.
- **i18next** (browser language detector + HTTP backend): Centralized translation management; auto‑detects user locale; backend adapter pre‑configured for future server‑served resource loading.
- **MDX Toolchain**: `@mdx-js/react` plus remark/rehype plugins (frontmatter, GFM, syntax highlighting) to author hybrid content (blog posts, project pages) with metadata (title, date, tags).
- **ESLint + typescript-eslint**: Linting pipeline enforcing consistency, best practices, and preventing common React/TypeScript pitfalls (`npm run lint`).
- **Node.js (>=18)**: Execution environment for the toolchain (Vite, TypeScript, ESLint) and base for container images; leverages modern language features (ES modules, fetch API).
- **Docker**: Containerizes the frontend for parity between local and deployed environments; image can be promoted without rebuild drift.
- **Docker Compose**: Orchestrates development (live reload mount) vs production (immutable build) profiles; simplifies multi‑service expansion (future API).
- **Nginx** (production testing / proxy layer): Serves the built static assets and can act as a reverse proxy entry point once backend services are introduced (planned integration).
- **npm + npm-check-updates**: Package management and scripted dependency upgrading; lockfile ensures deterministic installs.

## Development & Commands

The `docker-compose.yml` defines two profiles:

- `dev` → live reload / HMR (`web-dev`) plus on‑demand lint helpers (`web-lint`, `web-lint-fix`)
- `prod` → production image (`web`) served via Nginx

### 1. Start the development environment

Start only the live‑reloading frontend (recommended – avoids auto‑starting the lint containers):

```
docker compose --profile dev up web-dev
```

If you really want every service in the `dev` profile (will also build images for `web-lint` and `web-lint-fix`):

```
docker compose --profile dev up
```

The `web-dev` service mounts `src`, `public`, and `index.html` as read‑only plus `package.json` / `package-lock.json` read‑write so dependency changes persist on the host. It exposes Vite on http://localhost:5173.

### 2. Lint tasks (on demand)

Run lint (read‑only, reports issues):

```
docker compose --profile dev run --rm web-lint
```

Run lint with auto‑fix (writes changes back to your working tree):

```
docker compose --profile dev run --rm web-lint-fix
```

### 3. Production build + serve locally

Build (if needed) and start the optimized production image:

```
docker compose --profile prod up --build web
```

Subsequent restarts without forcing a rebuild:

```
docker compose --profile prod up web
```

The production image performs the TypeScript project build (`tsc -b`) and Vite production bundling inside the container, then Nginx serves the static assets on http://localhost (port 80).

### 4. Executing package scripts inside the dev container

For an interactive shell (PowerShell users: the container uses sh):

```
docker compose --profile dev run --rm web-dev sh -lc "npm run build"
```

Common scripts (can also be run with `exec` if the container is already up):

```
docker compose exec web-dev npm run dev
docker compose exec web-dev npm run build
docker compose exec web-dev npm run preview
docker compose exec web-dev npm run lint
```

`npm run build` first type‑checks (`tsc -b`) then produces the optimized bundle. `npm run preview` serves an already‑built bundle for a quick production sanity check (different from the Nginx container approach above).

### 5. Stopping & cleaning

Stop and remove running containers:

```
docker compose down
```

Rebuild images without cache (only the services whose Dockerfiles changed are rebuilt unless you specify one explicitly):

```
docker compose build --no-cache web-dev
```

Or all services:

```
docker compose build --no-cache
```

Remove containers plus locally built images (fresh start scenario):

```
docker compose down --rmi local
```

Remove everything (containers, networks, volumes – DATA LOSS for anonymous volumes):

```
docker compose down --volumes --remove-orphans
```

### 6. One‑off dependency install / audit inside dev profile

If you added or updated dependencies directly in `package.json`, sync the lock file deterministically:

```
docker compose --profile dev run --rm web-dev npm install
```

To run an ad‑hoc script (example: check outdated packages):

```
docker compose --profile dev run --rm web-dev npx npm-check-updates
```

### 7. Troubleshooting tips

- Port 5173 already in use → stop previous dev session (`docker compose down`) or change Vite port via env `VITE_PORT` and map it in `docker-compose.yml`.
- Changes not reflecting → ensure the file is within a mounted path (`src`, `public`, `index.html`). Non‑mounted additions require rebuilding or adding a new volume mapping.
- Lint auto‑fix didn’t persist → confirm you used `web-lint-fix` (the read‑only lint service cannot write changes) and that Git shows modifications.
- Permission issues on Windows → Git line‑ending conversions can affect container caching; set `core.autocrlf=input` for consistent LF inside containers if needed.

---

## Updating Dependencies

A single command can update npm itself and bump all dependencies to their latest versions (including potential breaking changes). Run this in a one-off dev container:

```
docker compose --profile dev run --rm web-dev sh -lc "npm install -g npm@latest && npm outdated || true && npx npm-check-updates -u && npm install && npm audit fix || true"
```

Afterwards verify integrity:

```
docker compose --profile dev run --rm web-dev npm run build
```

If stable:

```
docker compose --profile prod up --build
```

# Roadmap & Future Work

Enhanced will evolve from a static portfolio into a hosting platform for a family of “Enhanced” web projects. Each larger project will be delivered as an independently deployable microservice (API service, background worker, scheduled job, edge/SSR function, or standalone static UI). The current web app becomes the aggregation shell: global navigation, authentication boundary, user preferences, documentation, marketing, and consolidated project status dashboards.

Planned expansion highlights:

1. Core backend foundation: gateway/API layer, identity (JWT + scoped roles), content service for MDX/metadata, project registry (service name, version, health, exposure level).
2. Hosting approaches chosen per project scope:
   - Pure static micro‑sites: stored in Amazon S3 + fronted by a CDN (CloudFront or similar).
   - Low/medium complexity APIs: container images orchestrated first via Docker Compose (local), later promoted to a lightweight Kubernetes (k3s) or managed cluster (EKS) when cross‑service scaling or rolling deploys are needed.
   - Compute / batch / indexing tasks: background workers pulling from a queue (SQS or Redis streams).
   - Real‑time or push features: WebSocket / SSE service or edge functions where latency matters.
   - Edge logic (headers, redirects, lightweight personalization): optional Cloudflare Workers / Lambda@Edge.
3. Storage tiers:
   - Object storage (S3) for media, compiled MDX artifacts, static exports.
   - Relational (PostgreSQL) for canonical data (projects, users, content metadata).
   - Redis for caching, rate limiting, ephemeral session state.
   - Event / log indexing (OpenSearch or alternative) for search + observability.
4. Observability & governance: central log aggregation, metrics/traces via OpenTelemetry collector, health checks exposed in the platform UI, SBOM + vulnerability scanning in CI, dependency license review.
5. Deployment workflow: bi‑monthly release branching (YYYY.MM) triggers pipeline stages (build, test, security scan, image publish, migrations, CDN invalidation). Emergency hotfixes follow a controlled release branch merge with redeploy.
6. Internationalization backend: transition from bundled static resource files to a translation service with versioned locale packs, cache headers, and fallback chains; future inline editing for maintainers.
7. Content pipeline: MDX ingestion → frontmatter extraction → normalized metadata store → search index → cached HTML/AST fragments for fast rendering.
8. Extensibility layer: plugin/module registration to add new micro‑frontends (module federation or dynamic import manifests) and surface routes, nav items, or settings panels without modifying the core shell.
9. Security posture: per‑service API keys, signed internal calls (mTLS or HMAC), rate limiting at gateway, automated secret rotation, periodic dependency audit.
10. Progressive orchestration: remain in simple container stack until service count, scaling patterns, or isolation requirements justify Kubernetes; avoid premature complexity.

Approach selection is pragmatic: small static experiment → S3 + CDN; interactive API prototype → container service; high‑throughput or horizontally scaling workload → Kubernetes; ultra‑low latency path → edge worker. Each service advertises metadata (status, latency budget, last deploy hash) surfaced inside the platform to communicate maturity.

# Contributing & Branch Strategy

There are three main long‑lived branches: trunk, master, and the release branch.

- **trunk** is the experimental stream. Unstable, partially implemented, or breaking refactors land here first. It may be in a non‑functional state at any time; its purpose is velocity and exploration.

- **master** receives only stabilized snapshots from trunk after all stability / regression tests are executed and accepted. If you want to clone the project locally, explore the architecture, or experiment with technologies without hitting unfinished breakage, prefer master.

- The **release** branch is the deployment source used by Render. Direct pushes are blocked and it remains hidden during its active lifecycle. A new release branch is created every two months following the naming convention year_month as YYYY.MM (examples: 2025.08 for the late‑summer cycle, 2025.12 for the December cycle). When a newer release branch goes live, the older one becomes public (read‑only) until the subsequent release window, at which point the older branch is deleted. Integrations (merges) into the active release branch are intentionally rare and each triggers a redeploy; they are performed only by (or with explicit approval from) the maintainer.

Typical contribution flow:

1. Branch from trunk for new features or experiments.
2. Open a PR into trunk; iterate until approved.
3. Maintainer periodically promotes trunk -> master after validation.
4. At the bi‑monthly cadence the maintainer cuts a release branch from master for deployment.

# License & Disclaimer

The project is intentionally source‑available: you may read the code, clone it locally for personal evaluation, and open issues or propose changes only with explicit maintainer approval. No permission is granted to redistribute, publish modified copies, create derivative projects, or deploy the code (in whole or part) publicly. All project ideas and “Enhanced” branded sub‑projects remain exclusively owned by the maintainer.

A custom source‑available license (see **LICENSE** file) defines:

- Permitted: read, local private clone, security review, issue reporting.
- Restricted: modification, redistribution, sublicensing, public hosting, commercial or derivative use without written consent.
- Contributions: accepted only after explicit approval; by contributing you grant the maintainer the right to use and relicense your contribution as part of the project.

If you need a different form of usage (e.g., showcasing a small snippet), request written permission first.

No warranty is provided; use at your own risk. For any ambiguity, the maintainer’s interpretation prevails. This is not legal advice—consult a legal professional for formal compliance questions.

---

Focused, modular, and expansion-ready: Enhanced begins as a static portfolio yet is architected to grow into a service-backed personal platform.
