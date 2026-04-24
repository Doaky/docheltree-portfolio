# docheltree-portfolio

Personal portfolio and project showcase for Daniel Ocheltree. Built with React + TypeScript + Vite.

Live at **docheltree.com** (served from the `dist/` build output).

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| Styles | SCSS Modules (per-component, no global utility classes) |
| Fonts | Google Fonts (Inconsolata, Georgia) — loaded per page |

---

## Getting started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
```

---

## Repo structure

```
src/
├── index.tsx                        # App entry point
├── index.css                        # Global reset (box-sizing, body margin)
├── App.tsx                          # Router — all routes defined here
│
├── data/
│   └── projects.ts                  # Project metadata, types, category helpers
│
├── assets/
│   ├── profile.webp
│   ├── grained.min.js               # Grain texture effect (loaded via public/index.html)
│   └── support_me_on_kofi_red.png
│
├── components/
│   ├── NavBar/                      # Shared nav: "← projects" | title | right slot
│   ├── Footer/                      # Shared footer: feedback email + Ko-fi button
│   └── ProjectCard/                 # Card used in the /projects listing
│
└── pages/
    ├── HomePage/                    # / — landing page
    ├── ProjectsPage/                # /projects — project grid listing
    ├── ProjectDetailPage/           # /projects/:category/:slug — data-driven detail page
    ├── KellyPoolPage/               # /projects/kellypool
    ├── KellyPoolLegacyPage/         # /projects/kellypool-legacy
    ├── CatCalendarPage/             # /projects/cat-calendar
    └── TipTrainerPage/              # /projects/tip-trainer

public/
├── index.html                       # Vite HTML entry (do not confuse with public/index.html)
├── favicon.ico
├── grained.min.js                   # Global grain effect script
├── logo192.png / logo512.png        # App icons (replace with custom icons)
├── manifest.json                    # Web app manifest
└── robots.txt
```

---

## Project data

All project entries live in **`src/data/projects.ts`**. Each project has:

```ts
{
  slug: string;            // URL segment, e.g. 'cat-calendar'
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  image?: string;          // path to image asset
  links?: { label: string; url: string }[];
  tags?: string[];
  date?: string;
  appRoute?: string;       // set this if the project has a live interactive page
}
```

**Categories:** `'web-apps' | 'documentation' | 'crafts'`

Projects with an `appRoute` get a "Launch App →" button on their detail page.

---

## Adding a project (info page only)

1. Add an entry to `PROJECTS` in `src/data/projects.ts`
2. That's it — `ProjectDetailPage` renders it automatically at `/projects/:category/:slug`

---

## Adding an interactive app page

1. **Create the page component:**
   ```
   src/pages/MyAppPage/MyAppPage.tsx
   src/pages/MyAppPage/MyAppPage.module.scss
   ```

2. **Add a route** in `src/App.tsx`:
   ```tsx
   <Route path="/projects/my-app" element={<MyAppPage />} />
   ```

3. **Add a project entry** in `src/data/projects.ts` with `appRoute: '/projects/my-app'`

4. **Use the shared components** in your page (see below)

---

## Shared components

### NavBar

Standardized top nav — 3.5rem tall, content constrained to 1200px.

```tsx
import NavBar from '../../components/NavBar/NavBar';

<NavBar
  title="My App Name"
  className={styles.nav}          // for background + color overrides
  rightContent={<SomeButton />}   // optional
/>
```

Wire up colors in your page's SCSS module via CSS custom properties:

```scss
.nav {
  --nav-back-color: #yourcolor;   // "← projects" link
  --nav-title-color: #yourcolor;  // center title
  background: #yourpagebg;        // nav background
}
```

### Footer

Feedback prompt + project-specific email + Ko-fi button. Add to all interactive app pages and documentation project detail pages.

```tsx
import Footer from '../../components/Footer/Footer';

<Footer projectSlug="my-app" className={styles.footer} />
// → mailto: danielocheltree+my-app@gmail.com
```

Wire up colors:

```scss
.footer {
  --footer-text-color: #yourcolor;
  --footer-link-color: #yourcolor;
}
```

**Footer is shown on:**
- All app pages (KellyPool, CatCalendar, TipTrainer, KellyPoolLegacy)
- ProjectDetailPage when `project.category === 'documentation'`

---

## Layout conventions

- **Content max-width:** 1200px across all pages. Backgrounds always span full viewport width; content containers are the constrained layer.
- **NavBar height:** 3.5rem (fixed, same on every page)
- **Each page owns its color scheme** via its own SCSS module — no shared color variables across pages.
- **No global utility classes** — everything is scoped to CSS Modules.

---

## Routes

| Path | Component | Notes |
|------|-----------|-------|
| `/` | HomePage | |
| `/projects` | ProjectsPage | Lists all projects by category |
| `/projects/:category/:slug` | ProjectDetailPage | Data-driven from `projects.ts` |
| `/projects/kellypool` | KellyPoolPage | |
| `/projects/kellypool-legacy` | KellyPoolLegacyPage | Not shown in project listing |
| `/projects/cat-calendar` | CatCalendarPage | |
| `/projects/tip-trainer` | TipTrainerPage | |
| `/kellypool` | → redirect | Redirects to `/projects/kellypool` |
