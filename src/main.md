# Workshop Handbook Template

This repository is a **CompClub template** for workshop handbooks. Fork it, replace the placeholder content, and publish your own handbook with [mdBook](https://rust-lang.github.io/mdBook/).

> [!TIP] Quick start
> Install the tools, then preview locally:
>
> ```bash
> cargo install mdbook mdbook-callouts
> mdbook serve --open
> ```

## Getting started

1. **Fork this repo** (or use it as a starting point for a new workshop handbook).
2. **Install prerequisites** — Rust, [mdbook](https://github.com/rust-lang/mdBook), and [mdbook-callouts](https://crates.io/crates/mdbook-callouts).
3. **Run locally** — `mdbook serve --open` rebuilds on save; `mdbook build` outputs to `book/`.
4. **Customize** — edit `book.toml`, replace pages under `src/`, and extend `src/SUMMARY.md`.

## Adding a chapter

1. Create a new `.md` file under `src/` (e.g. `src/my-workshop/intro.md`).
2. Add a link in `src/SUMMARY.md`:

   ```markdown
   - [My Workshop](my-workshop/intro.md)
   ```

3. Save — mdBook picks up changes on the next build.

## Examples

See the **Examples** section in the sidebar:

- **[Callouts](examples/callouts.md)** — styled note boxes (`INFO`, `TIP`, `WARNING`, etc.)
- **[Answer widgets](examples/answer-widget.md)** — interactive check-your-answer boxes for exercises

## Theme

The default theme is **coal** (neutral mdBook built-in theme). To switch, change `default-theme` in `book.toml` to any built-in option: `light`, `rust`, `navy`, or `ayu`.

For heavier customization, see `theme/examples/pirate/README.md` in the repo (optional — not required).

## First deploy

Before publishing to GitHub Pages, work through the checklist in the repo **README** — especially updating `site-url` and `git-repository-url` in `book.toml` to match your fork.

> [!NOTE] Template defaults
> Placeholder `site-url` and repository URLs in `book.toml` must be updated for your fork, or links and assets may break on GitHub Pages.
