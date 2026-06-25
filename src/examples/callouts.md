# Callouts

This handbook uses [mdbook-callouts](https://crates.io/crates/mdbook-callouts) for Obsidian-style callout blocks. Write them in Markdown like this:

```markdown
> [!TIP] Title (optional)
> Body text here.
```

Below are the supported types used in CompClub handbooks.

## INFO

> [!INFO] Information
> General information readers should know.

## NOTE

> [!NOTE] Note
> Supplementary detail that supports the main text.

## TIP

> [!TIP] Tip
> A helpful hint or shortcut.

## WARNING

> [!WARNING] Warning
> Something that could cause confusion or mistakes if ignored.

## ERROR

> [!ERROR] Error / danger
> A serious caution — data loss, security risk, or similar.

## QUOTE

> [!QUOTE] Quote
> A pull quote or highlighted excerpt.

## SUCCESS

> [!SUCCESS] Success
> A positive outcome, completed step, or encouragement.

## Learn more

- Crate: [mdbook-callouts on crates.io](https://crates.io/crates/mdbook-callouts)
- Config: `[preprocessor.callouts]` in `book.toml`
- Styling: callout CSS variables in `theme/custom.css`
