# OpenCMS Webapp — Claude Code Guidelines

See `readme.md` for project overview, setup, and the full list of libraries used.

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

## Notifications (Status Bar)

User-facing notifications (success/info/warning/error toasts) are shown through the global `statusBarStore` (`src/stores/StatusBarStore.ts`), rendered by `src/components/layout/StatusBar.tsx`. There is no separate toast/snackbar component — this is the only notification mechanism.

- **Show a notification** from any store or component:
  ```ts
  import i18next from 'i18next';
  import { stores } from '../../stores'; // or `this.statusBarStore` inside a store that received it via constructor

  stores.statusBarStore.showSuccess(i18next.t('asset.errors.createSucceeded'));
  stores.statusBarStore.showError(i18next.t('asset.errors.createFailed'));
  stores.statusBarStore.showWarning(i18next.t('some.warning.key'));
  stores.statusBarStore.showInfo(i18next.t('some.info.key'));
  ```
  - Message text must always come from i18next (see Internationalisation section) — never hardcode the string.
  - Each `show*` method accepts an optional second `icon` param (a `lucide-react` icon) to override the default icon for that level.
- **Auto-clear:** every `show*` call resets a 5s timer; after it elapses the bar fades out (300ms) and resets to the idle `"Ready"` state. Calling `clear()` manually triggers the same fade-out early.
- **Wiring pattern:** domain stores (`AssetStore`, `AgentStore`, `OperationStore`, ...) receive the shared `statusBarStore` instance via their constructor (see `src/stores/index.ts`) and call `this.statusBarStore.showX(...)` after async operations (typically `showSuccess` on success, `showError` in the `catch`/failure branch). Follow this pattern for new stores instead of importing `stores` directly inside store classes.
- Components (not stores) should import the singleton via `import { stores } from '.../stores'` and call `stores.statusBarStore.showX(...)` directly, as seen in `OperationCommandBar.tsx`.

## Forms (Formik + Yup)

All forms use **Formik** for state/submission and **Yup** for validation, driven through the shared `Form` / `FormItem` / `Input` / `Dropdown` primitives in `src/components/ui/`. Reference implementation: `src/components/features/assets/AssetCreate.tsx`.

- **Never build a form with raw `useState`/manual `onChange` handlers.** Always use `useFormik`.
- **Define a `FormValues` type** derived from the relevant API request type, e.g. `type FormValues = Omit<AssetApi.Create.Request, never>;`.
- **Build the Yup schema as `Yup.ObjectSchema<FormValues>`** so it's checked against the values type. Validation messages must come from i18next (`common.validation.required`, `common.validation.nonNegative`, etc. — reuse existing keys under `common.validation` before adding new ones).
- **`useFormik<FormValues>`** takes `initialValues`, `validationSchema`, and an async `onSubmit` that calls the domain store (e.g. `await assetStore.createItem(values)`) — do not call the API layer directly from the component.
- **Wrap the component with `observer`** (it's reading/writing store state) and structure it as:
  ```tsx
  <Form formik={formik} mode={FormMode.Create /* or FormMode.Update */}>
      <h4>{t('feature.create.title')}</h4>

      <FormItem<FormValues> name="fieldName" label={t('feature.fields.fieldName')}>
          <Input<FormValues> id="fieldName" name="fieldName" />
      </FormItem>

      {/* numeric fields: add type="number" */}

      <FormItem label={t('feature.fields.enumField')}>
          <Dropdown<FormValues> name="enumField" options={enumFieldOptions} />
      </FormItem>

      <ButtonStack>
          <Button type="submit" disabled={formik.isSubmitting}>
              <Save size={16} />
              {formik.isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
          <Button type="button" variant="outline" onClick={() => /* return to detail/list view */}>
              <CircleX size={16} />
              {t('common.cancel')}
          </Button>
      </ButtonStack>
  </Form>
  ```
  - `FormItem` reads Formik's `touched`/`errors` from context via `name` and renders the error message automatically — don't render validation errors manually.
  - `Input` and `Dropdown` read/write Formik values through the same `Form` context — don't pass `value`/`onChange` yourself unless overriding.
  - For enum/select fields, define a `DropdownOption[]` constant next to the enum (see `src/types/enums/AssetTypes.ts` for the pattern: an i18n-backed label map plus an `Object.values(...).map(...)` options array) rather than inlining options in the component.
- **i18n keys**: add `<feature>.create.title`, `<feature>.update.title`, and `<feature>.fields.*` under the feature's namespace in `src/i18n/locales/en.ts` (see the `asset` namespace), plus `<feature>.errors.createSucceeded` / `createFailed` for the store's status-bar notifications on submit.
- **Update forms** follow the same structure with `mode={FormMode.Update}`, `onSubmit` calling the store's update method, and initial values pre-populated from the existing item.

## Adding a New Component

1. Create `src/components/MyComponent.tsx` with a named, typed props interface.
2. Export the component as default.
3. Import it where needed.
4. Save — the dev server hot-reloads automatically.

No configuration changes are needed when adding components; TypeScript and Webpack discover files under `src/` automatically.
