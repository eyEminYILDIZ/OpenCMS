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

## Adding a New Screen

1. Create `src/screens/MyScreen.tsx` with a named, typed props interface.
2. Register it in `src/navigation/BottomTabNavigator.tsx`.
3. Add any new icon via `react-native-vector-icons`.
4. Add user-visible strings to `src/i18n/locales/en.ts` first, then reference them with `t(...)`.

## Adding a New Component

1. Create `src/components/MyComponent.tsx` (or under a feature subfolder, e.g. `src/components/map/`) with a named, typed props interface.
2. Export the component as default, unless it is small/shared like `TextBox`, in which case a named export is fine — match the existing pattern in the target folder.
3. Import it where needed.

## Platform Notes

- **Android emulator networking:** `10.0.2.2` routes to the host machine's `localhost`; iOS simulator uses `localhost` directly. See the default server address logic in `src/stores/SettingsStore.ts`.
- **Native projects:** Do not hand-edit generated files under `android/` (Gradle build artifacts, `.cxx`, `.gradle`, `.kotlin`) or Xcode-managed files under `ios/` unless the change is intentionally a native config change (e.g. `Info.plist`, `AndroidManifest.xml`, `Podfile`).
- Real-time updates use `@microsoft/signalr` via `src/services/ClientSocketService.ts`.
