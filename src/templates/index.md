# Workshop Page Templates

These pages are examples you can copy when adding a new workshop.

You do not need to use every section. Pick the page that is closest to what you are making, copy it, and remove anything you do not need.

## Templates

- **[Guided workshop](guided-workshop.md)** — for explaining a topic and walking through an activity.
- **[CTF challenge](ctf-challenge.md)** — for challenges, puzzles, or investigation tasks.
- **[Quick reference](quick-reference.md)** — for useful commands, definitions, and common errors.

## Using a Template

1. Copy one of the files in `src/templates/`.
2. Move it into your workshop folder.
3. Rename it to match your topic.
4. Replace anything inside `[square brackets]`.
5. Remove the sections you do not need.
6. Add the new page to `src/SUMMARY.md`.

You can then run:

```bash
mdbook serve --open
```

This will open the handbook and update it whenever you save a file.

> [!TIP]
> Try to keep each page about one main idea. If the page starts getting too long, it may be easier to split it into two pages.

The templates also show how to add:

- Headings
- Code blocks
- Callouts
- Tables
- Images
- Checklists
- Collapsible hints
