# Project Architecture & Deployment Analysis

## === ARCHITECTURE UNDERSTANDING ===

1.  **Application Entry Point**
    *   **File:** `client/index.html`
    *   **Vite Entry:** The `index.html` file references `/src/main.tsx` via `<script type="module" src="/src/main.tsx">`.
    *   **Note:** Vite is configured with `root: "client"`, so it correctly resolves `index.html` inside the `client` directory.

2.  **Repository Type**
    *   **Type:** c) Combined public + admin app
    *   **Evidence:** `App.tsx` contains routes for both public pages (Home, Products) and the Admin Dashboard (`/admin`) within a single Router.

3.  **Current Vite Root**
    *   **Configured:** Yes, via `vite.config.ts`.
    *   **Path:** `path.resolve(import.meta.dirname, "client")` (Line 38 of `vite.config.ts`).
    *   **Vercel Behavior:** Vercel respects the `vite.config.ts` when running the build command.

## === BUILD & DEPLOYMENT ===

4.  **Why `vite.vercel.config.ts`?**
    *   **Origin:** It was explicitly defined in `vercel.json` under the `buildCommand` property (`npx vite build -c vite.vercel.config.ts`).
    *   **Status:** I have already removed this incorrect configuration in the previous step to fix the build.

5.  **Does `vite.vercel.config.ts` exist?**
    *   **No.** It does not exist in the file tree.
    *   **Reason:** It was likely a leftover from a previous template or a copy-paste error.

6.  **Expected Build Output**
    *   **Directory:** `dist/public`
    *   **Source:** `vite.config.ts` defines `outDir: path.resolve(import.meta.dirname, "dist/public")` (Line 40).

7.  **Admin Dashboard Requirement**
    *   **Production:** REQUIRED.
    *   **Reason:** It is built into the main bundle. Separation would require significant refactoring of `App.tsx` and routing logic.

## === CODE OWNERSHIP & INTENT ===

8.  **Public Parts**
    *   Routes: `/`, `/products`, `/about`, `/contact`, `/blogs`, `/blogs/:id`
    *   Components: Public-facing UI, Product Display, Blog Reader.

9.  **Admin Parts**
    *   Routes: `/admin` (and likely sub-routes handled by `Admin` component or internal state).
    *   Features: CRUD operations, Dashboard UI.

10. **Firebase Role**
    *   **Role:** Required in Production.
    *   **Usage:** It is initialized in `client/src/lib/firebase.ts` with hardcoded keys. It is NOT mock data; it connects to a real Firestore instance (`disha-traders-catalog`).
    *   **Context:** While "mockup mode" guidelines suggest no persistence, the codebase explicitly includes Firebase, so we must preserve it to avoid breaking the "Admin Dashboard + Firebase" requirement.

## === SAFETY & RISK ===

11. **Risk Analysis**
    *   **a) Separate Admin:** HIGH RISK. Would require untangling shared components, libs (`firebase.ts`), and styles.
    *   **b) Keep Together:** LOW RISK. This is the current working architecture.
    *   **c) Remove Custom Configs:** DONE/SAFE. The standard `vite.config.ts` handles the build correctly.

12. **Critical Files**
    *   `client/src/lib/firebase.ts`: Application backend connection.
    *   `vite.config.ts`: Critical build paths (`root`, `outDir`).
    *   `client/index.html`: SEO meta tags and app entry.
    *   `client/src/App.tsx`: Central routing logic.

## === FINAL CONFIRMATION ===

13. **Safest Deployment Model**
    *   **Recommendation:** **Single repo, single Vercel project.**
    *   **Reasoning:** The application is built as a single SPA with client-side routing. Vite handles the bundling of both public and admin sections efficiently. Splitting them introduces unnecessary complexity for this scale. The build command `npx vite build` with the existing `vite.config.ts` is the robust solution.
