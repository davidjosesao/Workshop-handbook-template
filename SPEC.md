# Workshop Handbook Template — Implementation Spec

## Goal

Turn the forked **2025 CompClub Spring Handbook** into a generic **`workshop-handbook-template`** repo that new workshops can copy or fork. Strip event-specific content, ship a **ready-to-use starter template**, and document how teams can customize further based on their preferences.

## Stakeholder sign-off

## Locked decisions

| Area | Decision |
|------|----------|
| **Starter template** | **Include a full starter template** — not an empty repo. Ship placeholder chapters, example pages, and docs so authors can fork and start writing immediately. |
| **Theme** | **Neutral built-in mdBook theme by default** (`coal`). No custom/pirate styling active out of the box. Teams change `default-theme` or add custom CSS **based on preference** — not required. |
| **Answer widgets** | **Keep one documented example page** (`src/examples/answer-widget.md`) with shared CSS in active `theme/custom.css`. |
| **`site-url`** | **Placeholder** (`/YOUR-REPO-NAME/`) in template + README checklist. Canonical repo uses real value (`/Workshop-handbook-template/`). CI auto-set = follow-up ticket. |

---

## Scope

### In scope (this ticket)

- Generic `book.toml` metadata and Pages config
- mdbook-callouts preprocessor config
- **Starter template content** in `src/` (intro + example chapters — see §3)
- Neutral default theme with minimal `custom.css` (callouts + answer widgets only)
- Optional custom theme example archived under `theme/examples/` (preference-based, not default)
- Rewrite README with setup, deploy, and customization docs
- Fix and verify GitHub Actions Pages deploy workflow
- Remove all CompClub / 2025 Spring / SecSoc references

### Out of scope (follow-up tickets)

- CI step to auto-set `site-url` from `github.repository`
- mdBook preprocessor/plugin for answer widgets (replace inline JS)
- Contributing guidelines, issue templates, org-wide naming policy
- Prescribing a specific brand/theme for all workshops

---

## What "include a template" means

The repo must ship **working starter content**, not just config files. A workshop lead should be able to:

1. Fork the repo
2. Run `mdbook serve --open`
3. See a complete (if minimal) handbook with navigation, callout examples, and an answer-widget demo
4. Replace placeholder text and add their own chapters

### Starter template contents

| Item | Purpose |
|------|---------|
| `src/main.md` | Welcome page + quick-start instructions |
| `src/SUMMARY.md` | Navigation skeleton teams extend |
| `src/examples/callouts.md` | Live callout reference |
| `src/examples/answer-widget.md` | Interactive exercise pattern |
| `book.toml` | Pre-configured with placeholders teams replace |
| `theme/custom.css` | Minimal shared styles (callouts + widgets) |
| `README.md` | Fork setup checklist + customization guide |
| `.github/workflows/mdbook.yml` | Deploy pipeline ready to go |

Teams delete or replace example pages as they write real workshop content. The template is a starting point, not the final product.

---

## Target repo structure

```
workshop-handbook-template/
├── .github/workflows/mdbook.yml
├── .gitignore
├── README.md
├── SPEC.md
├── book.toml
├── src/
│   ├── SUMMARY.md
│   ├── main.md
│   └── examples/
│       ├── callouts.md
│       └── answer-widget.md
└── theme/
    ├── custom.css                    # active: callouts + answer widgets only
    └── examples/
        └── pirate/                   # optional — enable based on preference
            ├── README.md
            ├── custom.css
            ├── variables.css
            └── index.hbs
```

**Remove entirely:**

- `src/ciphers/`
- `src/2_breaking_game_saves/`
- `src/3_day_3_web_attacks/`
- `src/images/` (empty or workshop-specific)
- `src/topic`

**Remove from active `theme/`** (relocate to `theme/examples/pirate/` or delete):

- `theme/index.hbs`
- `theme/book.js`
- `theme/css/`
- `theme/fonts/`
- `theme/highlight.css`
- `theme/highlight.js`
- `theme/favicon.png` (optional: keep one neutral favicon or drop)

---

## 1. `book.toml`

```toml
[book]
title = "Workshop Handbook"
author = "Your Organization"
language = "en"
description = "A template for workshop handbooks built with mdBook."

[build]
build-dir = "book"

[output.html]
default-theme = "coal"
site-url = "/YOUR-REPO-NAME/"
git-repository-url = "https://github.com/YOUR-ORG/YOUR-REPO-NAME"
additional-css = ["theme/custom.css"]

[preprocessor.callouts]
```

**Canonical repo override** (document in README, apply in `davidjosesao/Workshop-handbook-template`):

```toml
site-url = "/Workshop-handbook-template/"
git-repository-url = "https://github.com/davidjosesao/Workshop-handbook-template"
```

**Notes:**

- `default-theme = "coal"` — neutral built-in theme. Do not ship a custom theme as default.
- `[preprocessor.callouts]` with no extra keys is sufficient for mdbook-callouts v0.3.x.
- `git-repository-url` powers the repo icon in the menu bar.

---

## 2. Theme

### Principle

**Default = neutral. Customization = optional preference.**

The template must look clean and professional out of the box using mdBook's built-in themes. No workshop is required to adopt custom branding.

### 2a. Active default: built-in theme + `theme/custom.css`

- Use stock mdBook templates (no active `theme/index.hbs` override).
- `default-theme = "coal"` in `book.toml`.
- Active `theme/custom.css` contains **only** shared utility styles:

**Include:**

- mdbook-callouts CSS variables on `:root`
- `.answer-box`, `.answer-input`, `.answer-button`, `.correct`, `.incorrect` (neutral colors)

**Exclude:**

- Google Fonts imports
- All `.scifi` / pirate rules
- `ship-background.png` references
- Any opinionated branding

**Example structure:**

```css
/* Callouts — work across built-in themes */
:root {
  --mdbook-callouts-background: …;
  --mdbook-callouts-border: …;
}

/* Interactive answer widgets */
.answer-box { … }
```

### 2b. Customization options (document in README — preference-based)

Teams choose what fits their workshop. None of this is required.

| Preference | How |
|------------|-----|
| Different built-in theme | Change `default-theme` in `book.toml` to `light`, `rust`, `navy`, or `ayu` |
| Light style tweaks | Edit `theme/custom.css` |
| Full custom branding | See `theme/examples/pirate/README.md` for an archived example from the original handbook |

### 2c. Archived optional example: `theme/examples/pirate/`

The original CompClub pirate theme is **not the default**. Archive it as a reference for teams who want heavy customization.

| File | Source | Purpose |
|------|--------|---------|
| `custom.css` | Current `theme/custom.css` | Full pirate look |
| `variables.css` | Current `theme/css/variables.css` (`.scifi` block) | Theme tokens |
| `index.hbs` | Current `theme/index.hbs` | Custom theme menu entry |
| `README.md` | New | Opt-in instructions |

**`theme/examples/pirate/README.md` should explain:**

1. This is an **optional example**, not the template default.
2. How to copy files and enable the custom theme if desired.
3. Set `default-theme = "scifi"` when using this example's CSS.
4. `ship-background.png` is not bundled — add your own or remove background rules.
5. Built-in themes (`coal`, `navy`, etc.) are the recommended starting point for most workshops.

### 2d. Drop active full theme override

With only `theme/custom.css` referenced, mdBook uses **built-in** templates from the `mdbook` binary.

**Do not** leave a partial `theme/index.hbs` in the active path.

---

## 3. Content (`src/`)

### 3a. Delete workshop chapters

Remove all CompClub curriculum (~30 files). No CompClub slide links, cipher puzzles, or "DAY 1 / DAY 3" structure in the template.

### 3b. `src/SUMMARY.md`

```markdown
# Summary

- [Introduction](main.md)
- [Examples](examples/callouts.md)
  - [Answer widgets](examples/answer-widget.md)
```

### 3c. `src/main.md`

Starter template landing page covering:

- What this repo is and that it's a **template to fork and customize**
- Quick start: `cargo install mdbook mdbook-callouts`, `mdbook serve --open`
- How to add a chapter (create `.md`, link in `SUMMARY.md`)
- Pointer to `examples/` for callouts and answer widgets
- How to change theme (built-in options in `book.toml`)
- **First deploy checklist** (see README)
- One sample callout

### 3d. `src/examples/callouts.md`

Live reference for supported callout types:

- `INFO`, `NOTE`, `TIP`, `WARNING`, `ERROR`, `QUOTE`, `SUCCESS` (or whatever mdbook-callouts supports)
- Link to https://crates.io/crates/mdbook-callouts

### 3e. `src/examples/answer-widget.md`

Single minimal interactive example:

- One question + one answer box
- Inline `<script>` with `checkAnswer()` (one clean copy from current cipher pages)
- Short "how to add your own" section (base64 answer, copy HTML, unique ids)
- Note: copy-paste pattern for now; a proper plugin is future work

**Do not** port full cipher curriculum — one toy example only.

---

## 4. `README.md`

Replace `2025-CompClub-Spring-Handbook` content entirely.

### Sections

1. **Title & one-liner** — "Template for workshop handbooks using mdBook + mdbook-callouts."
2. **What's included** — starter chapters, callout examples, answer widget demo, deploy workflow.
3. **Prerequisites** — Rust, mdbook, mdbook-callouts (with install commands).
4. **Local development** — `mdbook serve --open` / `mdbook build`.
5. **First-time fork setup checklist**
   - [ ] Rename repo (if forking)
   - [ ] Update `book.toml` → `title`, `author`, `description`
   - [ ] Update `book.toml` → `site-url` to `/<your-repo-name>/`
   - [ ] Update `book.toml` → `git-repository-url`
   - [ ] Replace placeholder content in `src/`
   - [ ] Enable GitHub Pages → Source: **GitHub Actions**
   - [ ] Push to `main` and verify deploy
6. **Customization (optional, based on preference)**
   - Adding chapters / `SUMMARY.md`
   - Changing theme: set `default-theme` to any built-in theme (`coal`, `navy`, `light`, `rust`, `ayu`)
   - Callouts (`examples/callouts.md`)
   - Answer widgets (`examples/answer-widget.md`)
   - Full custom branding (`theme/examples/pirate/README.md`)
7. **Deployment** — push to `main` triggers `.github/workflows/mdbook.yml`
8. **Canonical template note** — this repo's `site-url` is `/Workshop-handbook-template/`; forks must change it.

---

## 5. GitHub Actions (`.github/workflows/mdbook.yml`)

### Fixes required

**Rust install** — current command is broken:

```yaml
# Broken
curl ... | sh -y

# Fix
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -sSf -- -y
source "$HOME/.cargo/env"
```

**Optional but recommended:** pin versions for reproducible CI:

```yaml
cargo install mdbook --locked --version 0.4.40
cargo install mdbook-callouts --locked --version 0.3.0
```

(Verify latest compatible versions at implementation time.)

### Workflow should

1. Trigger on `push` to `main` + `workflow_dispatch`
2. Install Rust + mdbook + mdbook-callouts
3. Run `mdbook build`
4. Upload `./book` artifact
5. Deploy via `actions/deploy-pages@v4`

### Repo settings (document, don't automate)

- Settings → Pages → Build and deployment → **GitHub Actions**

---

## 6. `site-url` strategy

| Audience | `site-url` value |
|----------|------------------|
| Template default in repo | `/YOUR-REPO-NAME/` |
| Canonical `Workshop-handbook-template` deploy | `/Workshop-handbook-template/` |
| Each workshop fork | `/their-actual-repo-name/` |

**README checklist** is the enforcement mechanism for forks.

**Follow-up ticket:** CI step before `mdbook build`:

```bash
# Pseudocode — not in this ticket
sed -i "s|/YOUR-REPO-NAME/|/${{ github.event.repository.name }}/|g" book.toml
```

---

## 7. mdbook-callouts

**Config:** `[preprocessor.callouts]` in `book.toml` (already present; keep it).

**CSS:** Callout variables in active `theme/custom.css` on `:root` so they work with the neutral built-in theme.

**Verify:** `src/examples/callouts.md` renders all callout types after build.

---

## 8. Cleanup & consistency pass

Search and remove references to:

- `CompClub`, `SecSoc`, `CSESoc`, `2025 Spring`
- Google Slides workshop links
- Pirate / ship copy in default content (fine in `theme/examples/pirate/` only)
- `src/topic` stub

Confirm `.gitignore` still includes `book` (build output).

---

## Implementation order

```
1. book.toml          — metadata, coal default, placeholder site-url, callouts
2. src/               — delete workshop content; add starter template pages
3. theme/             — slim active custom.css; archive pirate example (optional)
4. README.md          — template docs, checklist, preference-based customization
5. .github/workflows/ — fix rustup; optional version pins
6. Canonical overrides — set real site-url + git URL for this repo
7. Verify             — local build + (if possible) CI deploy
```

---

## Acceptance criteria

- [ ] Repo ships a **working starter template** — fork, serve, and see intro + example pages
- [ ] `mdbook build` succeeds locally with no missing preprocessor errors
- [ ] Default site uses **neutral built-in theme** (`coal`), not pirate/custom styling
- [ ] Callouts render on `main.md` and `examples/callouts.md`
- [ ] `examples/answer-widget.md` has one working check-answer demo
- [ ] No CompClub / 2025 Spring / SecSoc references in active `src/`, `book.toml`, or `README.md`
- [ ] Active `theme/` contains only minimal `custom.css`; no active theme override files
- [ ] README documents how teams can **change theme based on preference** (built-in themes + optional custom example)
- [ ] No broken `ship-background.png` references in **active** theme path
- [ ] `book.toml` has `[preprocessor.callouts]`
- [ ] README includes fork/deploy checklist with `site-url` step
- [ ] Canonical repo has `site-url = "/Workshop-handbook-template/"`
- [ ] GitHub Actions workflow installs Rust correctly and deploys on push to `main`
- [ ] Deployed Pages site: CSS/JS load, navigation works, example pages reachable

---

## Follow-up tickets (explicitly deferred)

| Ticket | Description |
|--------|-------------|
| **Auto `site-url` in CI** | Rewrite `book.toml` `site-url` from `github.repository.name` before build |
| **Answer widget preprocessor** | Shared `checkAnswer` JS or mdBook preprocessor; remove per-page script duplication |
| **Theme upgrade guide** | Document how to rebase `theme/examples/pirate/` against new mdBook stock theme |
| **Org policy** | Standard repo naming for workshop handbooks |

---

## Effort estimate

| Task | Estimate |
|------|----------|
| Starter template content | ~1–2 hrs |
| Theme cleanup + optional archive | ~1–2 hrs |
| book.toml + README | ~30–45 min |
| CI fix + deploy verify | ~30–60 min |
| **Total** | **~3–5 hrs** |
