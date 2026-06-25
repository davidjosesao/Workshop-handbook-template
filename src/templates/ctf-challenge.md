# CTF Challenge Template

This page can be used for a CTF challenge, puzzle, exploit, or investigation task.

> [!INFO]
> Replace the example details, files, and hints before using this page for a real challenge.

## Challenge Details

| | |
| --- | --- |
| Name | `[challenge name]` |
| Category | `[web / crypto / reversing / forensics / misc]` |
| Difficulty | `[beginner / intermediate / advanced]` |
| Time | `[15–30 minutes]` |
| Flag format | `FLAG{example_format}` |

## Scenario

Add a short description of what has happened and what we need to find.

For example:

> A small service is behaving strangely. We need to inspect how it handles our input and find the hidden flag.

## Files and Links

List anything needed for the challenge:

- `challenge.rs` — source code for the challenge.
- `README.txt` — extra instructions.
- `http://localhost:8000` — the local challenge website.

Remove this section if the challenge does not need any files or links.

## Getting Started

Give one clear place to start without explaining the full solution.

For example, we might be given this code:

```rust
fn check_input(input: &str) -> bool {
    input.trim() == "[secret value]"
}
```

> [!TIP]
> If you are not sure where to begin, start by finding where the program reads or checks our input.

## Things to Look For

- What input can we give the program?
- Does the output change when we change the input?
- Are there any useful strings or values in the files?
- Is anything encoded, hashed, or hidden?

## Useful Commands

Add any commands that may help with the challenge:

```bash
ls -la
file challenge
strings challenge
```

## Hints

Hints can be placed inside a dropdown so they are not shown straight away.

<details>
<summary>Hint 1</summary>

Find where the program handles our input.

</details>

<details>
<summary>Hint 2</summary>

Look for hard-coded strings, comparisons, or unusual branches.

</details>

<details>
<summary>Hint 3</summary>

Try changing one thing at a time and compare the output.

</details>

## Task

> [!SUCCESS] Capture the flag
> Find the flag and explain how you found it.

For this challenge, submit:

1. The flag.
2. The main thing that helped you solve it.
3. A short explanation of how the challenge works.

## Notes for Presenters

> [!WARNING]
> Remove this section, or move it somewhere private, if people doing the challenge should not be able to see the solution.

- Solution: `[steps used to solve the challenge]`
- Common problems: `[issues people may run into]`
- Extra hint: `[a hint that can be given during the workshop]`
- Reset steps: `[how to reset the challenge]`
