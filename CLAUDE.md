# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

Angular 16 single-page app that walks the user through their Amazing Marvin "inbox" one item at a time, letting them assign labels (status, topic, context, duration, energy, priority), goals, and a parent project, then save the changes back to Marvin via its HTTP API. The "thought" being processed is whatever inbox item Marvin returns next.

## Commands

- `npm start` / `ng serve` — dev server on http://localhost:4200 with proxy active
- `npm run build` — production build to `docs/` with `--base-href /processThoughtsForMarvin/` (GitHub Pages publishes from `docs/`)
- `npm run watch` — incremental dev build
- `npm test` / `ng test` — Karma + Jasmine
- Single test: `ng test --include='**/marvin.service.spec.ts'`
- `process-thoughts.bat` is a convenience wrapper that runs `ng serve` from the built `docs/` folder; do not use for development

## Required configuration

`marvin-configs.json` is gitignored and **must exist at the repo root** before the app can start — it is imported as a TypeScript module ([src/app/services/marvin.service.ts:1](src/app/services/marvin.service.ts#L1), [src/app/services/auth.service.ts:1](src/app/services/auth.service.ts#L1), [src/app/app.component.ts:1](src/app/app.component.ts#L1)). Copy [marvin-configs.template.json](marvin-configs.template.json) and fill in:
- `apiToken` / `fullAccessToken` — Marvin API tokens (different endpoints require different tokens; see service)
- `urlLocal` (`http://localhost:4200/api/`, used in dev to hit the proxy) vs `urlPublic` (direct Marvin URL)
- `googleAuth.clientId` and `allowedUserIds` — only whitelisted Google IDs are treated as logged in ([app.component.ts:23](src/app/app.component.ts#L23))

## Architecture

- **CORS proxy** ([src/proxy.conf.js](src/proxy.conf.js)) forwards `/api/*` to `https://serv.amazingmarvin.com/`. `MarvinService.apiUrl` is set from `marvinConfigs.urlLocal` so dev hits the proxy; switch to `urlPublic` for direct calls. The proxy is wired into `ng serve` via [angular.json](angular.json#L69).
- **Marvin API auth** uses two different headers depending on the endpoint: `X-API-Token` for read-mostly endpoints (`labels`, `categories`, `children`, `markDone`) and `X-Full-Access-Token` for writes/reads of arbitrary docs (`addProject`, `doc`, setter-based updates). Pick the right one per [marvin.service.ts](src/app/services/marvin.service.ts) — getting it wrong returns auth errors from Marvin.
- **Project tree** — Marvin returns categories/projects as a flat list with `parentId`. [TreeBuilder](src/app/types/tree.ts) reassembles them into the nested `Project.children` shape consumed by `MatTreeNestedDataSource` in [process-thought.component.ts](src/app/components/process-thought/process-thought.component.ts).
- **Single primary view** — `ProcessThoughtComponent` is the whole UI. Routing is empty ([app-routing.module.ts](src/app/app-routing.module.ts)). Adding new screens means adding routes here.
- **Inbox is `parentId: 'unassigned'`** in Marvin terms; "Single Action" project ID is hard-coded in [constants.ts](src/app/types/constants.ts#L1) and used as a default parent.
- **Auth** is Google Sign-In via `@abacritt/angularx-social-login`. There is no server-side session — login state is purely client-side and only gates UI, not API calls (Marvin tokens come from the config file).

## Conventions (from .cursorrules and tsconfig)

- TS is `strict` with `strictTemplates`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`. **Avoid `any`, the non-null assertion `!`, and `as unknown as T` casts** — define proper types in [src/app/types/interfaces.ts](src/app/types/interfaces.ts) instead.
- Prettier: single quotes, 4-space indent, semicolons, 80-col print width ([.prettierrc](.prettierrc)). The `.cursorrules` file says double quotes — Prettier wins; follow `.prettierrc`.
- Styles: SCSS + Angular Material (`indigo-pink` prebuilt theme) + Tailwind ([tailwind.config.js](tailwind.config.js)).
- Production build budget: 1 MB initial bundle error, 4 KB per-component-style error.

## Deployment

Built artifacts live in `docs/` and are served via GitHub Pages at `/processThoughtsForMarvin/`. The `gh-pages` branch tracks built output; the `master` branch holds source. Re-running `npm run build` regenerates `docs/main.<hash>.js` — old hashed files in `docs/` should be removed before committing to avoid bloat.
