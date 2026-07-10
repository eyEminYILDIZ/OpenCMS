# OpenCMS Mobile — Claude Code Guidelines

## Commands

```bash
npm install       # install dependencies
npm start         # start Metro bundler
npm run android   # build and run on Android (emulator/device)
npm run ios       # build and run on iOS (simulator/device)
npm run lint      # run ESLint
npm test          # run Jest tests
```

## Project Structure

```
mobileapp/
├── App.tsx                    # Root component
├── index.js                   # Entry point — registers App with React Native
├── android/                   # Native Android project — do not hand-edit generated files
├── ios/                       # Native iOS project — do not hand-edit generated files
└── src/
    ├── api/                   # Axios setup and generated/typed API models
    ├── components/            # Reusable components, grouped by feature subfolder where relevant
    ├── hooks/                 # Custom React hooks
    ├── i18n/                  # i18next config and locale files
    ├── navigation/            # React Navigation navigators
    ├── screens/                # Top-level screen components (one per tab/route)
    ├── services/               # Non-React services (sockets, date utils, etc.)
    ├── stores/                 # MobX stores
    ├── theme/                  # Design tokens (colors, etc.)
    └── types/                  # Shared TypeScript types and enums
```

## Conventions

- **One component per file.** File name matches the component name (PascalCase).
- **No `any` types.** Fix the underlying type instead of using `any`.
- **No `as` type assertions** to silence compiler errors. Fix the type.
- **Styling:** Use `StyleSheet.create` with tokens from `src/theme/colors.ts`. No Tailwind, no Shadcn (those are webapp-only) — `colors.ts` is mirrored from the webapp's CSS palette, keep it in sync if the web palette changes.
- **Icon Library:** Use `react-native-vector-icons`. Do not use inline SVGs unless explicitly told to (`react-native-svg` is available for that case only).
- **State management: MobX.** Use `mobx-react-lite` (`observer`) for reactive components, and `makeAutoObservable` in stores. Do not use Redux, Zustand, Jotai, or other state libraries.
- **MobX rules:** Wrap components that read observable store values with `observer`. Never memoize observable-derived values with an empty dependency array (`useMemo(() => ..., [])`) — MobX tracks reads at render time and memoizing with `[]` breaks reactivity.
- **Navigation:** Use `@react-navigation` (`@react-navigation/native`, `@react-navigation/bottom-tabs`). Register new screens in `src/navigation/BottomTabNavigator.tsx`.
- **Networking:** Use the shared Axios instance from `src/api/axios_setup.ts`. Add new request/response shapes to `src/api/ApiModels.ts`.
- **Persistence:** Use `@react-native-async-storage/async-storage` for local persistence (see `src/stores/SettingsStore.ts` for the load/save pattern).
- **npm only** — do not generate `yarn.lock` or `pnpm-lock.yaml`.
- TypeScript `strict` mode is enabled (via `@react-native/typescript-config`). All new code must pass `npx tsc --noEmit`.
- **Every directory must have an `index.ts` barrel file.** Export all items in the directory from it, e.g.:
  ```ts
  export * from "./icons"
  export * from "./AssetHeader"
  ```
  Missing barrel files cause bad/inconsistent imports — always create or update `index.ts` when adding a file or subdirectory.

## Internationalisation (i18n)

**Never hardcode user-visible strings.** All UI text must go through i18next.

- Config: `src/i18n/index.ts` — initialised once, imported in `App.tsx` before navigation renders.
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
   <Text>{t('myFeature.title')}</Text>
   ```

No other config changes are needed.

## Toast Messages

Use `StatusBarStore` (`src/stores/StatusBarStore.ts`) for all toast/status feedback — do not call `react-native-toast-message` directly. It wraps `Toast.show` with four levels: `showSuccess`, `showInfo`, `showWarning`, `showError`, each with a preset `visibilityTime`. The `<Toast />` renderer is mounted once in `App.tsx`.

- Inject `statusBarStore` into a store's constructor (see `DispatchStore`, `OperationStore`, `AssetStore`, `AgentStore`) or read it off `stores` in a component (see `OrdersScreen.tsx`).
- Always pass a translated string via `i18next.t(...)` (in stores) or `t(...)` (in components) — never a hardcoded string. Add the key under the relevant namespace's `errors` object in `src/i18n/locales/en.ts`.
- Use `showSuccess` for completed actions (create/update/delete succeeded), `showError` for failed API calls or invalid state, and `showWarning` for recoverable/non-fatal issues (e.g. a previous selection no longer being available). `showInfo` is available but not yet used in a store.

## Adding a New Screen

1. Create `src/screens/MyScreen.tsx` with a named, typed props interface.
2. Register it in `src/navigation/BottomTabNavigator.tsx`.
3. Add any new icon via `react-native-vector-icons`.
4. Add user-visible strings to `src/i18n/locales/en.ts` first, then reference them with `t(...)`.

## Adding a New Component

1. Create `src/components/MyComponent.tsx` (or under a feature subfolder, e.g. `src/components/map/`) with a named, typed props interface.
2. Export the component as default, unless it is small/shared like `TextBox`, in which case a named export is fine — match the existing pattern in the target folder.
3. Import it where needed.

## Forms & Validation

Any form with more than one field or with real validation rules uses **Formik + Yup**, wired through the shared context components in `src/components/ui/`. See `src/components/dispatch/DispatchCreateSheet.tsx` and `DispatchUpdateSheet.tsx` for the canonical example.

- **State:** `useFormik<FormValues>({ initialValues, validationSchema, onSubmit })`. Build initial values with a local `buildInitialValues()` function (pre-fill from the store's `selectedItem` for update forms). When the sheet/modal's `visible` prop flips true, call `formik.resetForm({ values: buildInitialValues() })` in a `useEffect` keyed on `visible` — this re-seeds the form each time it opens instead of leaking stale values between opens.
- **Validation schema:** Define with `Yup.object({...}) satisfies`/typed as `Yup.ObjectSchema<FormValues>`. Every validation message must go through i18n — never a hardcoded string:
  ```ts
  const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
    title: Yup.string().required(t('common.validation.required')),
    category: Yup.number().required(t('common.validation.required')),
    relatedChildEntityId: Yup.string().nullable().default(null), // optional field: no .required()
  });
  ```
  Shared messages live under `common.validation` in `src/i18n/locales/en.ts` (`required`, `nonNegative`). Add new shared rules there rather than inlining ad hoc strings per form.
- **Required vs optional:** required fields get `.required(t('common.validation.required'))`; optional fields use `.nullable().default(null)` and omit `.required()`. Don't invent a separate "optional" convention.
- **Wiring fields:** Wrap the whole set of fields in `<Form formik={formik} mode={FormMode.Create | FormMode.Update}>` (`src/components/ui/Form.tsx`), then wrap each field in `<FormItem<FormValues> name="fieldName" label={t(...)}>`. Inside it, use `<TextBox<FormValues> name="fieldName" .../>` or `<DateTimePicker<FormValues> name="fieldName" .../>` — these read/write the field automatically via the `Form` context by matching on `name`, no manual `value`/`onChangeText` wiring needed. `Dropdown` (`src/components/ui/Dropdown.tsx`) does **not** integrate with `Form` context — wire it manually with `selectedId`/`onSelect`, mapping into `formik.setFieldValue` yourself.
- **Error display:** Handled entirely by `FormItem` — it shows the Yup error message under the field, but only once the field has been touched (`touched[name] && errors[name]`). Do not add per-field error text elsewhere; do not show errors before the field is touched. `TextBox`/`DateTimePicker`/`Dropdown` have no error styling of their own (no red border) — only `FormItem`'s text line communicates the error.
- **Submit button:** Disable via `formik.isSubmitting` only (not `isValid`/`dirty` — Formik still blocks submission via the validation schema, the button disable is purely to prevent double-submit while the request is in flight). Swap the button's icon for an `ActivityIndicator` and its label to `t('common.saving')` while submitting:
  ```tsx
  <TouchableOpacity
    style={[styles.saveButton, formik.isSubmitting && styles.saveButtonDisabled]}
    onPress={() => formik.handleSubmit()}
    disabled={formik.isSubmitting}
  >
    {formik.isSubmitting ? <ActivityIndicator size="small" color={colors.primaryForeground} /> : <Icon .../>}
    <Text>{formik.isSubmitting ? t('common.saving') : t('common.save')}</Text>
  </TouchableOpacity>
  ```
- **Simple single-field/single-action forms** (e.g. a lone dropdown confirm like `OrderChangeStatusSheet.tsx`, or a single settings field like `SettingsEditModal.tsx`) don't need the full Formik/Yup machinery — plain `useState` plus a guard clause before submit (`if (!order || status == null) return;`) is acceptable. In that case, still disable the submit button whenever the required value is missing or a save is in progress (`disabled={isSaving || status == null}`) — don't silently no-op on invalid input, and don't skip the loading-spinner swap on the button.
- Do not introduce `react-hook-form`, `zod`, or another validation library — Formik + Yup is the only form stack in this app.

## Platform Notes

- **Android emulator networking:** `10.0.2.2` routes to the host machine's `localhost`; iOS simulator uses `localhost` directly. See the default server address logic in `src/stores/SettingsStore.ts`.
- **Native projects:** Do not hand-edit generated files under `android/` (Gradle build artifacts, `.cxx`, `.gradle`, `.kotlin`) or Xcode-managed files under `ios/` unless the change is intentionally a native config change (e.g. `Info.plist`, `AndroidManifest.xml`, `Podfile`).
- Real-time updates use `@microsoft/signalr` via `src/services/ClientSocketService.ts`.
