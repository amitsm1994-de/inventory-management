---
name: saas-sidebar-redesign
description: Redesign this Vue 3 app's shell from a top-nav layout to a modern SaaS-style interface with a fixed 240px left sidebar, design-token spacing, and a polished professional look. Use when the user asks to convert the top nav to a sidebar, modernize the app shell, build a SaaS-style layout, or apply a left-rail navigation to the Factory Inventory Management client.
---

# SaaS Sidebar Redesign

This skill governs full app-shell redesign work for the Factory Inventory Management Vue 3 client: removing the existing top navigation, introducing a fixed 240px vertical sidebar, and adopting a small set of CSS custom properties for consistent spacing and color. Follow it whenever the user asks to modernize the layout or move navigation to the left.

The skill defines *what* to build. It does **not** edit `.vue` files directly — that responsibility belongs to the `vue-expert` subagent (see next section).

## Scope & When to Use

Use this skill when the request involves any of:

- Converting `client/src/App.vue`'s top `<header class="top-nav">` into a left sidebar.
- Adding a reusable `Sidebar.vue` component with the existing six routes.
- Introducing CSS custom properties (`--space-*`, `--color-*`, `--sidebar-width`) in `:root`.
- Restyling `LanguageSwitcher.vue` and `ProfileMenu.vue` to sit in a sidebar footer.
- Adjusting `FilterBar.vue`'s sticky offset for the new layout.

Do **not** use this skill for:

- Single-view styling tweaks (use `vue-expert` directly).
- Adding new pages or business features.
- Building a collapsible/icon-only sidebar — explicitly out of scope here.
- Dark mode or theming beyond the token introduction listed below.

## Mandatory Delegation Rule

The project's `CLAUDE.md` states:

> **MANDATORY RULE: ANY time you need to create or significantly modify a .vue file, you MUST delegate to vue-expert**

This skill's job is to plan and specify the redesign. Every `.vue` create/edit produced by this redesign must be performed by the `vue-expert` subagent via the Task tool. Pass the snippets and acceptance criteria from this skill into the subagent's prompt. Do not write Vue single-file components directly from the parent session — even small touches.

Files where direct editing is allowed (non-`.vue`):

- `client/src/composables/useNavigation.js` — new composable file (plain JS).
- `client/package.json` — dependency addition.

## Design Principles

- **Spacing rhythm**: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px. Every margin, padding, and gap snaps to this ladder via tokens. No ad-hoc `0.6rem` values.
- **Type scale**: 12 / 14 / 16 / 20 / 24 / 32 px. Use 14 for body, 12 for muted/labels, 20 for section headings, 24+ only for page headers.
- **One accent**: `--color-primary` (`#2563eb`). Used for active state, focus rings, and the single primary CTA. Reds/greens/ambers stay reserved for status meaning, not decoration.
- **Information hierarchy** in the sidebar (top to bottom): brand → primary nav → flexible spacer → utilities (language) → profile.
- **Whitespace generously**. The sidebar's outer padding is `--space-4` (16px); nav items breathe at `--space-2 --space-3` (8/12).
- **No emojis** in any rendered UI text (project rule). Use Lucide icons.

## Sidebar Anatomy

Five vertical regions inside a fixed `240px` wide `<aside class="sidebar">`:

1. **Brand block** — top. Company name as `<h1>` plus a small subtitle. Mirrors the data already in `App.vue`'s `.brand` block.
2. **Primary nav** — vertical `<nav aria-label="Primary">` with one `<RouterLink>` per item from `useNavigation`. Each link renders an icon + label.
3. **Flex spacer** — `flex: 1` so the footer items pin to the bottom.
4. **Language switcher** — `<LanguageSwitcher />`, restyled to a full-width left-aligned button.
5. **Profile menu** — `<ProfileMenu />`, restyled the same way; dropdown opens **upward** so it doesn't get clipped at the viewport bottom.

**Active state** for nav items:

- 3px left accent bar in `--color-primary`.
- Background `--color-primary-soft` (`#dbeafe`).
- Label color shifts from `--color-text-muted` to `--color-primary`.
- `aria-current="page"` set automatically by `<RouterLink>` (use the `exact-active-class` or `active-class` binding).

**Hover state** (non-active): background `--color-bg` (`#f8fafc`), label color `--color-text`. Distinct from active.

## Design Tokens

Define these as CSS custom properties in `App.vue`'s **non-scoped** `<style>` block (the one that already holds global rules around lines 164–486). They augment — they don't immediately replace — the hard-coded slate hex values elsewhere in the codebase. Migrating views to tokens is out of scope here; the rule is: tokens are required for the sidebar, layout shell, and any new components touched.

```css
:root {
  /* Spacing — 4/8/12/16/24/32/48/64 */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* Color — slate palette */
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-primary: #2563eb;
  --color-primary-soft: #dbeafe;

  /* Sizing & shape */
  --sidebar-width: 240px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
}
```

The slate values are the same the codebase already uses; they're being lifted to tokens, not changed.

## Layout Shell

Switch `.app` from `flex; flex-direction: column;` to a two-column CSS Grid. The sidebar lives in the first column, every page in the second. Because the grid carves out the sidebar's column, the main content needs **no manual `margin-left`**.

```css
.app {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
  background: var(--color-bg);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
}

.main-content {
  padding: var(--space-5) var(--space-6);
  /* The 1600px max-width from the old top-nav layout is removed.
     The sidebar already constrains usable width on wide screens. */
}
```

Notes:

- `.main-content`'s `max-width: 1600px` is **removed**. With the sidebar reserving 240px, the remaining column is already bounded for legibility on common screen sizes.
- `min-height: 100vh` on `.app` keeps the sidebar full-height even on short pages.
- `position: sticky; top: 0; height: 100vh` keeps the sidebar visible during page scroll without using `position: fixed` (which would require manual offsets).

## Data-Driven Nav Config

Create `client/src/composables/useNavigation.js` to hold the six routes as data. The Sidebar component v-fors over this — adding a new route becomes a one-line config change.

```javascript
// client/src/composables/useNavigation.js
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  TrendingUp,
  BarChart3,
} from 'lucide-vue-next'

export const navItems = [
  { path: '/',          labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/inventory', labelKey: 'nav.inventory', icon: Package },
  { path: '/orders',    labelKey: 'nav.orders',    icon: ShoppingCart },
  { path: '/spending',  labelKey: 'nav.finance',   icon: Wallet },
  { path: '/demand',    labelKey: 'nav.demand',    icon: TrendingUp },
  { path: '/reports',   labelKey: 'nav.reports',   icon: BarChart3 },
]

export function useNavigation() {
  return { navItems }
}
```

The `labelKey` values are the same i18n keys already used in the existing top nav, so locale files in `client/src/locales/en.js` and `ja.js` don't need changes. This file follows the same singleton-module pattern as `client/src/composables/useFilters.js`.

## Sidebar.vue Skeleton

Hand this to `vue-expert` as the reference for `client/src/components/Sidebar.vue`. The structure, class names, and token usage are prescriptive; the styling details may be tightened.

```vue
<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <h1>{{ t('app.title') }}</h1>
      <p class="brand-subtitle">{{ t('app.subtitle') }}</p>
    </div>

    <nav class="sidebar-nav" aria-label="Primary">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="is-active"
        exact-active-class="is-active-exact"
      >
        <component :is="item.icon" :size="18" aria-hidden="true" />
        <span>{{ t(item.labelKey) }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-spacer" />

    <div class="sidebar-footer">
      <LanguageSwitcher />
      <ProfileMenu />
    </div>
  </aside>
</template>

<script>
import { RouterLink } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useNavigation } from '@/composables/useNavigation'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'

export default {
  name: 'Sidebar',
  components: { RouterLink, LanguageSwitcher, ProfileMenu },
  setup() {
    const { t } = useI18n()
    const { navItems } = useNavigation()
    return { t, navItems }
  },
}
</script>

<style scoped>
.sidebar-brand {
  padding: var(--space-2) var(--space-2) var(--space-5);
}
.sidebar-brand h1 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}
.brand-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: var(--space-1) 0 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-muted);
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: background-color 120ms ease, color 120ms ease;
}
.nav-item:hover {
  background: var(--color-bg);
  color: var(--color-text);
}
.nav-item.is-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
}
.nav-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.sidebar-spacer {
  flex: 1;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-3);
}
</style>
```

Key contract points for `vue-expert`:

- Use `<RouterLink>` (not raw `<a>`) so Vue Router manages `aria-current="page"` on the active item.
- Icon comes from the nav config as a component, rendered via `<component :is="...">`.
- `:size="18"` keeps Lucide icons aligned to the 14px label.
- Scoped styles only. The `:root` tokens live in `App.vue`'s non-scoped block.

## App.vue Changes

Inside `client/src/App.vue`, vue-expert should:

1. Replace the existing `<header class="top-nav">…</header>` block (lines 3–35) with `<Sidebar />`.
2. Import `Sidebar` from `./components/Sidebar.vue`.
3. Update the root `.app` rule from `flex` column to the CSS Grid shown in **Layout Shell** above.
4. Add the `:root` token declarations from **Design Tokens** to the global (non-scoped) `<style>` block.
5. Remove the `.top-nav`, `.nav-container`, `.nav-tabs`, and `.brand` rules that are no longer used — but **leave the rest of the global styles alone**.
6. Remove `.main-content`'s `max-width: 1600px` and `margin: 0 auto`; keep its padding (move to tokens).

## FilterBar Adjustment

In `client/src/components/FilterBar.vue`'s scoped style:

- Change the sticky offset from `top: 70px` (the old top-nav height) to `top: 0`.
- Keep everything else identical. The filter bar remains a sticky horizontal control surface at the top of the main content column. Filters are page-scoped data state, not navigation — they do not belong in the sidebar.

## LanguageSwitcher & ProfileMenu Adjustments

Both currently render as trigger buttons whose dropdowns open downward from a top-bar position. In the sidebar footer they need:

- **Trigger styling**: full-width button (100% of `--sidebar-width` minus side padding), left-aligned label + chevron at the right edge. Use tokens for spacing.
- **Dropdown direction**: open **upward** (or to the **right**, anchored to the trigger), so the menu doesn't get clipped at the viewport bottom. The simplest fix is `bottom: 100%` instead of `top: 100%` on the dropdown element.
- **Z-index**: keep ≥ `1000` so dropdowns sit above main content.

Both components retain their existing internal logic — only positioning/styling changes.

## Adding the Icon Dependency

In `client/package.json`, add to `dependencies`:

```json
"lucide-vue-next": "^0.400.0"
```

Then run `npm install` in `client/`. Versions in the `^0.400` range are stable; pin only if the rest of the project pins versions.

## Accessibility

- `<nav aria-label="Primary">` on the sidebar's nav.
- Each `<RouterLink>` produces an `<a>` with `aria-current="page"` when active (Vue Router default).
- `:focus-visible` outline of 2px in `--color-primary` on every interactive element in the sidebar (nav items, footer buttons).
- Tab order: brand → first nav item → … → last nav item → language → profile. This falls out of source order if you keep the template structure shown above.
- All icons set `aria-hidden="true"` — the adjacent text label is the accessible name.

## Verification Checklist

After vue-expert has applied changes:

1. `cd client && npm install` (picks up `lucide-vue-next`) then `npm run dev`.
2. Load `http://localhost:3000`. The sidebar should be 240px wide on the left; main content fills the rest.
3. Click each of the six nav items. The active item shows the left accent bar, soft-blue background, and primary-color label. `<a>` carries `aria-current="page"` (check in DevTools).
4. Scroll a long page (Inventory or Orders). The sidebar stays put; the FilterBar sticks to the top of the content column at `top: 0`.
5. Open the language switcher and profile menu from the sidebar footer. Dropdowns open upward (or rightward) and are not clipped.
6. Tab through the sidebar. Each item shows a 2px focus ring in `--color-primary`. Enter navigates.
7. DevTools → Elements → `:root`. All `--space-*`, `--color-*`, `--sidebar-width`, and `--radius-*` tokens resolve.
8. Zero console errors. Zero emojis in rendered text.
9. Visit the OpenAPI docs (`localhost:8001/docs`) is unchanged — no backend impact.

## Pitfalls

- **Don't move the FilterBar into the sidebar.** Filters are page-scoped data state; nav is global. Mixing them confuses both.
- **Don't drop `t()` calls.** Every label still flows through `useI18n` so Japanese keeps working.
- **Don't introduce Tailwind / Element Plus / Naive UI.** This project uses hand-rolled CSS; the redesign continues that contract.
- **Don't edit `.vue` files directly.** Hand every Vue file change to `vue-expert` via the Task tool (project rule).
- **Don't add a collapse toggle.** Fixed-width 240px is the agreed scope. Collapsible is a separate skill.
- **Don't replace existing per-view hard-coded slate hex values with tokens in this pass.** That's a broader, separate refactor. The token introduction here is targeted: sidebar, layout shell, and any new file authored by this skill.
- **Don't keep `max-width: 1600px` on `.main-content`.** The sidebar already bounds usable width; the cap creates uneven gutters on wide monitors.

## Quick Reference

- **Sidebar width**: 240px (`--sidebar-width`).
- **Layout**: CSS Grid, two columns, `var(--sidebar-width) 1fr`.
- **Tokens live in**: `App.vue` non-scoped `<style>` block, `:root`.
- **Nav config**: `client/src/composables/useNavigation.js`.
- **Icons**: `lucide-vue-next`.
- **Active state**: left accent bar + `--color-primary-soft` background + `--color-primary` text + `aria-current="page"`.
- **FilterBar offset**: `top: 0` (was `70px`).
- **Footer dropdowns**: open upward.
- **All `.vue` work**: delegate to `vue-expert` subagent.
