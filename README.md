# Workshop Handbook Template

Template for workshop handbooks using [mdBook](https://rust-lang.github.io/mdBook/) + [mdbook-callouts](https://crates.io/crates/mdbook-callouts).

Maintained by **CompClub** as a starting point for workshop handbooks. Fork it, replace the placeholder chapters, and deploy to GitHub Pages.

## What's included

- **Starter chapters** — introduction plus example pages under `src/examples/`
- **Callout examples** — `src/examples/callouts.md` (INFO, TIP, WARNING, etc.)
- **Answer widget demo** — `src/examples/answer-widget.md` (interactive check-your-answer pattern)
- **Neutral default theme** — built-in `coal` theme with minimal `theme/custom.css`
- **Deploy workflow** — `.github/workflows/mdbook.yml` builds and publishes on push to `main`

## Prerequisites

Install [Rust](https://rustup.rs/), then:

```bash
cargo install mdbook mdbook-callouts
```

Pin versions for reproducible builds (optional):

```bash
cargo install mdbook --locked --version 0.4.40
cargo install mdbook-callouts --locked --version 0.3.0
```

> **Note:** `mdbook-callouts` 0.3.x requires mdBook 0.5.x. If you use mdBook 0.4.x, install `mdbook-callouts` 0.2.2 instead.

## Local development

Preview with live reload:

```bash
mdbook serve --open
```

Build static output to `book/`:

```bash
mdbook build
```

## First-time fork setup checklist

- [ ] Rename the repo (if forking for a specific workshop)
- [ ] Update `book.toml` → `title`, `author`, `description`
- [ ] Update `book.toml` → `site-url` to `/<your-repo-name>/`
- [ ] Update `book.toml` → `git-repository-url`
- [ ] Replace placeholder content in `src/`
- [ ] Enable GitHub Pages → Settings → Pages → Build and deployment → **GitHub Actions**
- [ ] Push to `main` and verify the deploy workflow completes

## Customization (optional)

None of this is required — pick what fits your workshop.

### Adding chapters

1. Create a `.md` file under `src/`.
2. Link it in `src/SUMMARY.md`.
3. Run `mdbook serve --open` to preview.

### Changing theme

Set `default-theme` in `book.toml` to any built-in mdBook theme: `coal`, `navy`, `light`, `rust`, or `ayu`.

For light tweaks, edit `theme/custom.css`. For full custom branding, see the archived pirate example at [`theme/examples/pirate/README.md`](theme/examples/pirate/README.md).

### Callouts

See [`src/examples/callouts.md`](src/examples/callouts.md). Syntax:

```markdown
> [!TIP] Optional title
> Body text.
```

### Answer widgets

See [`src/examples/answer-widget.md`](src/examples/answer-widget.md) for the copy-paste HTML + inline script pattern.

## Deployment

Pushing to `main` triggers [`.github/workflows/mdbook.yml`](.github/workflows/mdbook.yml), which installs Rust, builds the book, and deploys to GitHub Pages.

Ensure Pages is set to **GitHub Actions** (not “Deploy from a branch”) in the repo settings.

## Canonical template note

This repository (`Workshop-handbook-template`) uses:

```toml
site-url = "/Workshop-handbook-template/"
git-repository-url = "https://github.com/davidjosesao/Workshop-handbook-template"
```

Forks **must** update `site-url` and `git-repository-url` in `book.toml` to match their own repo name, or navigation and asset links will break on GitHub Pages.
