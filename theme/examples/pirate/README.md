# Optional pirate theme example

This folder archives the **custom pirate theme** from the original CompClub handbook. It is **not** the template default — new workshops start with mdBook's built-in **coal** theme.

Built-in themes (`coal`, `navy`, `light`, `rust`, `ayu`) are the recommended starting point for most handbooks.

## Enable the pirate theme (optional)

1. **Copy theme files** into the active `theme/` directory:
   - `custom.css` → `theme/custom.css` (replaces the minimal default)
   - `index.hbs` → `theme/index.hbs`
   - Merge `variables.css` → add the `.scifi` block to `theme/css/variables.css` (or copy the full stock `variables.css` from your mdBook version and append the `.scifi` rules)

2. **Copy supporting assets** from a full mdBook theme if you do not already have them under `theme/`:
   - `theme/css/` (general, chrome, print)
   - `theme/fonts/`
   - `theme/highlight.css`, `theme/book.js`, etc.

   Run `mdbook init --theme` in a scratch directory to extract the stock files for your mdBook version.

3. **Set the default theme** in `book.toml`:

   ```toml
   [output.html]
   default-theme = "scifi"
   additional-css = ["theme/custom.css"]
   ```

   The theme menu entry is labelled **Pirate** in `index.hbs` (class `scifi`).

4. **Background image** — `ship-background.png` is **not bundled**. Add your own image next to the built CSS (e.g. `theme/` or `src/`) and update the `url(...)` paths in `custom.css` / `variables.css`, or remove the background rules.

## Revert to the default template theme

1. Delete `theme/index.hbs`, `theme/css/`, `theme/fonts/`, `theme/book.js`, `theme/highlight.css`, and any other full-theme overrides.
2. Restore the minimal `theme/custom.css` from the template (callouts + answer widgets only).
3. Set `default-theme = "coal"` in `book.toml`.
