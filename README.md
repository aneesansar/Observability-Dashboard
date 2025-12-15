# Speedie Frontend (React + TypeScript + Vite)

Product-grade React application with Keycloak auth, i18n, TailwindCSS, routed layout (sidebar + header), and developer-quality tooling.

---

## Overview

- Framework: React 18 + Vite + TypeScript
- Styling: TailwindCSS (with custom theme tokens/utilities)
- Auth: Keycloak (via a typed AuthContext)
- i18n: react-i18next with JSON locale bundles
- Layout: Responsive sidebar (mobile + desktop) + sticky header + full-width content area
- State: React Contexts for Auth and Feedback
- Tooling: ESLint (strict TS rules), Prettier-ready, modular architecture

The codebase favors a feature-first layout and reusable primitives (hooks, utilities, components) to scale with product complexity.

## Quick start

- Requirements: Node 18+ (LTS recommended)
- Install: `npm ci` (or `npm install`)
- Run dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Scripts

- `dev` — Vite dev server with HMR
- `build` — Production build
- `preview` — Preview built app locally
- `lint` — Run ESLint over the project (configure in package.json)

## Environment

Keycloak and API base URLs live in `src/config/apiConfig.ts`. Adjust for your environment.

```ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8001',
  AUTH: {
    KEYCLOAK_URL: 'http://localhost:90/',
    KEYCLOAK_REALM: 'Opentelemetry_Frontend',
    KEYCLOAK_CLIENT_ID: 'Opentelemetry_frontend',
  },
}
```

## Project structure

```
src/
  app/
    layout/
      AppLayout.tsx                # Sidebar + Header + Main content scaffolding
      sidebar/
        DesktopSidebar.tsx         # Desktop sidebar (collapsible)
        MobileSidebar.tsx          # Mobile sidebar (dialog)
        index.ts                   # Sidebar barrel (Desktop/Mobile)
      header/
        Header.tsx                 # Sticky header (Top bar)

  components/
    feedback/Feedback.tsx          # Reusable feedback banner
    homepage/WelcomeSection.tsx    # Home page welcome card (example)

  context/
    AuthContext.tsx                # Keycloak auth context (typed)
    FeedbackContext.tsx            # Feedback context (message + status)

  config/
    apiConfig.ts                   # API + Auth endpoints
    navigation.ts                  # Sidebar navigation items

  hooks/
    useOnClickOutside.ts           # Click-outside hook for menus/dialogs

  lib/
    http.ts                        # Minimal typed HTTP helper (fetch)

  locales/
    en/common.json                 # English translations
    de/common.json                 # German translations

  pages/
    HomePage.tsx                   # Protected home route

  routes/
    AppRoutes.tsx                  # Router config
    ProtectedRoute.tsx             # Guarded route wrapper (Keycloak)

  styles/
    index.css                      # Tailwind entry + theme tokens/utilities
    App.css                        # Minor app-specific CSS

  utils/
    classNames.ts                  # Utility to compose className strings

  App.tsx                          # App shell
  i18n.ts                          # i18next initialization
  main.tsx                         # React entry & providers (Auth, Feedback)
```

## Architecture highlights

- **Auth (Keycloak)**
  - `context/AuthContext.tsx` initializes, refreshes, and exposes Keycloak state and helpers.
  - `routes/ProtectedRoute.tsx` renders routes only when authenticated (with a small global guard flag).
  - Token parsing uses `KeycloakTokenParsed` (`src/types/auth.ts`).

- **Feedback**
  - `context/FeedbackContext.tsx` holds `feedbackMessage` + `feedbackStatus`.
  - `components/feedback/Feedback.tsx` renders a responsive banner in the header.
  - Mobile shows status code; sm+ shows localized message. Auto-hides after 15s.

- **Layout**
  - `AppLayout.tsx` composes sidebars + sticky header + main area and synchronizes left padding with collapse state.

- **Styling**
  - Tailwind theme tokens live in `src/index.css` (colors + `--gradient-brand`).
  - Custom utility `bg-gradient-brand` provides a semantic gradient.

- **i18n**
  - `i18n.ts` initializes react-i18next. Use `useTranslation()` with `locales/*/common.json`.

## Conventions

- **TypeScript**
  - Avoid `any`; prefer shared types in `src/types/*`.
  - Context values are fully typed; custom hooks should throw if used out of provider.

- **React**
  - Hooks at top-level; use exhaustive deps.
  - Favor `React.memo` and `useCallback/useMemo` for stable references.
  - Extract cross-cutting behavior into hooks (e.g., `useOnClickOutside`).

- **Tailwind**
  - Prefer semantic utilities (e.g., `bg-gradient-brand`).
  - Avoid layout-breaking `mx-*` inside full-width sections; use padding.

- **Files & Folders**
  - `kebab-case` for directories, `PascalCase` for components, `camelCase` for utilities.
  - Group by feature when modules grow.

## Quality gates

- **ESLint**
  - Strict TS rules configured (no-explicit-any warn, hooks deps warn, import ordering).
  - Run `npm run lint`.

- **Prettier** (optional)
  - Add a `.prettierrc`:
    ```json
    { "singleQuote": true, "semi": false, "trailingComma": "es5", "printWidth": 100 }
    ```

## Adding a new feature

1. Create `features/<your-feature>/` with:
   - `components/`, `hooks/`, `context/`, `types/`
2. Add routes in `routes/AppRoutes.tsx`; guard with `ProtectedRoute` if needed.
3. Localize strings in `locales/*/common.json` and use `useTranslation()`.
4. Keep styling responsive and rely on theme tokens/utilities.

## HTTP helper usage

```ts
import { http } from '@/lib/http'

type User = { id: string; name: string }

async function fetchUsers() {
  return http<User[]>('/api/users', { baseUrl: 'http://localhost:8001' })
}
```

## Troubleshooting

- Keycloak not redirecting? Verify `KEYCLOAK_URL`, `REALM`, `CLIENT_ID` in `apiConfig.ts` and CORS.
- Layout overlap? Ensure `AppLayout` main area has `pt-16` and the header is `sticky`.
- Full-width sections with gaps? Avoid `mx-*` inside the section; use container padding.
- i18n keys missing? Check `locales/*/common.json` and ensure `i18n.ts` is imported in `main.tsx`.
