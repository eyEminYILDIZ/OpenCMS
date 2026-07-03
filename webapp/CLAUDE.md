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
- **Icon Library** Use `lucide-react` for all icons. It is already installed. Do not use inline SVGs unless explicitly told to.
- **State management: MobX.** Use `mobx-react-lite` (`observer`) for reactive components. Do not use Redux, Zustand, Jotai, or other state libraries.
- **MobX rules:** Wrap components that read observable store values with `observer`. Never memoize observable-derived values with an empty dependency array (`useMemo(() => ..., [])`) — MobX tracks reads at render time and memoizing with `[]` breaks reactivity.
- **npm only** — do not generate `yarn.lock` or `pnpm-lock.yaml`.
- TypeScript `strict` mode is enabled. All new code must pass `npm run type-check`.
- **Every directory must have an `index.ts` barrel file.** Export all items in the directory from it, e.g.:
  ```ts
  export * from "./icons"
  export * from "./AssetHeader"
  ```
  Missing barrel files cause bad/inconsistent imports — always create or update `index.ts` when adding a file or subdirectory.

## Internationalisation (i18n)

**Never hardcode user-visible strings.** All UI text must go through i18next.

- Config: `src/i18n/index.ts` — initialised once, imported in `src/index.tsx` before `<App />` renders.
- Translations: `src/i18n/locales/en.ts` — single English source of truth, organised by feature namespace.
- Usage in components: `const { t } = useTranslation();` → `t('namespace.key')`.

### Adding a new string

1. Add the key under the appropriate namespace in `src/i18n/locales/en.ts`:
   ```ts
   // existing namespace
   menu: {
     myNewLabel: 'My New Label',
   }
   // or a new namespace
   myFeature: {
     title: 'My Feature',
   }
   ```
2. Use it in the component:
   ```tsx
   const { t } = useTranslation();
   <span>{t('myFeature.title')}</span>
   ```

No other config changes are needed.

## Adding a New Component

1. Create `src/components/MyComponent.tsx` with a named, typed props interface.
2. Export the component as default.
3. Import it where needed.
4. Save — the dev server hot-reloads automatically.

No configuration changes are needed when adding components; TypeScript and Webpack discover files under `src/` automatically.
