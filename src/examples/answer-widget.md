# Answer widgets

Use an answer widget when you want readers to type a response and check it inline — useful for short exercises or puzzles.

> [!NOTE] Copy-paste pattern
> This is a simple HTML + inline script pattern for now. A shared preprocessor or plugin may replace per-page scripts in a future update.

## Example

<quiz-question q="testing custom question tag (answer same a question)" a="testing custom question tag" points="1"></quiz-question>

**Question:** Which organisation maintains this handbook template?

<div class="answer-box">
    <input class="answer-input" type="text" id="answer-demo" placeholder="Enter your answer">
    <button class="answer-button" onclick="checkAnswer('answer-demo', 'result-demo', 'Q29tcENsdWI=')">Check Answer</button>
</div>

<div id="result-demo"></div>

<script>
    function checkAnswer(inputId, resultId, enAnswer) {
        const input = document.getElementById(inputId);
        const result = document.getElementById(resultId);
        let correctAnswer;

        try {
            correctAnswer = atob(enAnswer);
        } catch (e) {
            result.className = 'error';
            result.textContent = 'Error decoding the answer. Please contact support.';
            result.style.display = 'block';
            return;
        }

        if (input.value.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            result.className = 'correct';
            result.textContent = '✓ Correct Answer!';
        } else {
            result.className = 'incorrect';
            result.textContent = '✗ Incorrect. Try again!';
        }

        result.style.display = 'block';
    }
</script>

## How to add your own

1. **Choose the correct answer** and encode it as Base64 (e.g. in a terminal: `echo -n 'your answer' | base64`).
2. **Copy the HTML** from the example above into your `.md` file.
3. **Use unique ids** for each widget on the page (`answerinput1`, `result1`, etc.) so multiple boxes do not clash.
4. **Include the `<script>` block** once per page (or extract to a shared asset when a plugin is available).

Styles for `.answer-box`, `.answer-input`, `.answer-button`, `.correct`, and `.incorrect` live in `theme/custom.css`.
