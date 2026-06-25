# College ERP — Mobile

React Native (Expo) companion to the web app. Three portals — Student, Faculty, Parent — sharing the same backend microservices that power the SPA in `../frontend/`.

> The Admin portal is intentionally **web only** — admin workflows are keyboard-heavy.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime  | **Expo SDK 52** (RN 0.76, new arch on) | Fast onboarding, OTA updates, EAS Build for stores |
| Routing  | **Expo Router 4** (file-based, typed routes) | Same mental model as Next.js — `app/(student)/home.tsx` becomes a screen |
| Styling  | **NativeWind 4** + custom tokens | Tailwind classes in RN, single source of truth with `tailwind.config.js` |
| Data     | **TanStack Query** + `axios` | Caching, refetch on focus, optimistic updates |
| Storage  | **expo-secure-store** | iOS keychain / Android keystore for JWT + refresh token |
| Forms    | `react-hook-form` + `zod`     | Type-safe validation |
| Icons    | `@expo/vector-icons` (Material) | Matches the web app |

## Project layout

```
mobile/
├── app.json            # Expo config: name, icons, splash, scheme, plugins
├── app/                # Expo Router — every file is a route
│   ├── _layout.tsx     # Root stack, providers (Auth, QueryClient, Toast)
│   ├── index.tsx       # Splash → redirect (auth check)
│   ├── (auth)/         # Group: portal picker + login
│   ├── (student)/      # Group: 5 tabs + nested course detail
│   ├── (faculty)/      # Group: 5 tabs + nested class detail
│   └── (parent)/       # Group: 5 tabs
├── src/
│   ├── components/
│   │   ├── ui/         # Button, Card, Input, Badge, Avatar, EmptyState, Spinner
│   │   └── layout/     # Screen, ScreenHeader
│   ├── context/AuthContext.tsx
│   ├── hooks/useApiQuery.ts
│   ├── lib/
│   │   ├── api.ts      # axios instance, Page-envelope unwrap, JWT refresh
│   │   └── storage.ts  # secure-store wrapper
│   ├── theme/
│   │   ├── tokens.ts   # colours, spacing, radius — mirrors tailwind config
│   │   └── useColorScheme.ts
│   └── types/          # Shared API + domain types
├── assets/             # icons + splash (drop your own PNGs here)
├── tailwind.config.js  # NativeWind + design tokens
├── babel.config.js     # nativewind/babel + reanimated plugin
├── metro.config.js     # withNativeWind(global.css)
└── tsconfig.json       # strict, paths: @/* → src/*
```

## First run

```bash
cd mobile
npm install                  # or: yarn / pnpm install

# Drop placeholder icons into assets/ first (any 1024×1024 PNG works for now):
#   assets/icon.png
#   assets/splash.png
#   assets/adaptive-icon.png

npm start                    # opens the Expo Dev Tools
# Then:
#   - press 'i' for iOS Simulator (needs Xcode)
#   - press 'a' for Android Emulator (needs Android Studio)
#   - scan the QR code with Expo Go on a real device
```

## Connecting to the backend

The mobile app talks to the api-gateway. The current local-dev base URL is set in `app.json → expo.extra.apiBaseUrl`:

```json
"extra": { "apiBaseUrl": "http://localhost:8080/api" }
```

### iOS Simulator
`localhost` works as-is.

### Android Emulator
The emulator can't see the Mac's `localhost`. Use `http://10.0.2.2:8080/api` — that's the special host loopback.

### Physical device on the same Wi-Fi
Use your machine's LAN IP, e.g. `http://192.168.1.42:8080/api`. Set it via an env override at boot:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.42:8080/api npm start
```

(then read it from `process.env.EXPO_PUBLIC_API_BASE_URL` in `src/lib/api.ts` — wired but currently falls back to `extra.apiBaseUrl`.)

### Heads-up — gateway routing bug

The web app currently bypasses the gateway in dev by splitting `/api/auth/*` to `auth-service:8081` directly through the Vite proxy. **The mobile app cannot do that** — devices/emulators only see the gateway's port. Until the gateway routing is fixed in `backend/api-gateway/`, login from the device will return `400 must not be blank`. See `../backend/MIGRATION-STATUS.md` for the open issue.

## Demo accounts (password: `Demo@123`)

| Portal | Email |
|---|---|
| Student | `student1@sample.edu` … `student5@sample.edu` |
| Faculty | `faculty1@sample.edu` … `faculty5@sample.edu` |
| Parent  | (parent users not seeded yet — register one via auth-service) |

## Design system

Colours, type ramps, spacing live in **two places kept in sync**:

1. `tailwind.config.js` — for NativeWind class usage (`bg-brand-600`, `text-ink-400`)
2. `src/theme/tokens.ts` — for JS code (icon colours, gradients, charts)

When you tweak a token, edit both. The `palette` object in `tokens.ts` mirrors the colour scale in tailwind.

### Light + dark mode

Both work out of the box. NativeWind reads RN's `useColorScheme()` and toggles `dark:` variants. `useTheme()` in `src/theme/useColorScheme.ts` gives you the same colours in JS.

### Portal accent

Each portal has a signature colour applied to headers, avatars, and the active tab indicator:

| Portal | Accent |
|---|---|
| Student | `#3B82F6` (blue) |
| Faculty | `#8B5CF6` (violet) |
| Parent  | `#F59E0B` (amber) |

## Production build (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform ios --profile production
eas build --platform android --profile production
```

`app.json` already has `ios.bundleIdentifier`, `android.package`, and the splash/icon plugin entries — you'll want to swap those for your real org IDs before submitting.

## What's intentionally not here yet

- Push notifications (Expo plugin is configured but no `useNotifications` hook yet)
- Offline mode / persistent query cache
- Biometric unlock for the login screen
- Internationalisation (English only)
- E2E tests (Maestro or Detox)

PRs welcome.
