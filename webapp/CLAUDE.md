# OpenCMS Webapp — Claude Code Guidelines

## Commands

```bash
npm install       # install dependencies
npm start         # start dev server at http://localhost:3000 (hot reload active)
npm run build     # production bundle → webapp/dist/
npm run type-check  # TypeScript type check without emitting files
```

## Project Structure

```
webapp/
├── public/index.html         # HTML template (do not add <script> tags manually)
├── src/
│   ├── index.tsx              # Entry point — mounts <App />
│   ├── App.tsx                # Root component
│   └── components/            # All React components go here
└── dist/                      # Build output — git-ignored, do not edit
```

## Conventions

- **One component per file.** File name matches the component name (PascalCase).
- **No `any` types.** Fix the underlying type instead of using `any`.
- **No `as` type assertions** to silence compiler errors. Fix the type.
- **UI Library** Shadcn, consider using prebuilt components. Tailwind not allowed.
- **No state management libraries** (no Redux, MobX, Zustand, Jotai, etc.).
- **npm only** — do not generate `yarn.lock` or `pnpm-lock.yaml`.
- TypeScript `strict` mode is enabled. All new code must pass `npm run type-check`.

## Adding a New Component

1. Create `src/components/MyComponent.tsx` with a named, typed props interface.
2. Export the component as default.
3. Import it where needed.
4. Save — the dev server hot-reloads automatically.

No configuration changes are needed when adding components; TypeScript and Webpack discover files under `src/` automatically.
