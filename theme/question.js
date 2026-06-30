(function () {
  "use strict";

  const correctAnswerText = "✓ Correct Answer!";
  const incorrectAnswerText = "✗ Incorrect. Try again!";

  // Create an instance of a custom question tag template
  customElements.define(
    "quiz-question",
    class extends HTMLElement {
      connectedCallback() {
        const questionText = this.getAttribute("q");
        const correctAnswer = this.getAttribute("a");
        const points = parseInt(this.getAttribute("points") || "0", 10);
        const id = createId(questionText, correctAnswer);
        const widget = buildWidget(id, questionText, correctAnswer, points);
        this.replaceWith(widget);
      }
    },
  );

  /**
   * Returns an id for a question element. Assumes that no two questions are
   * identical to perserve uniqueness.
   *
   * @param {string} questionText - the provided question text
   * @param {string} answerText = the provided answer text
   * @returns {string} - the created id
   */
  function createId(questionText, answerText) {
    return "q-" + questionText.trim() + "::" + answerText.trim();
  }

  /**
   * Find all questions that have already been answered already
   */
  function awardedIds() {
    // TODO
  }

  /**
   * Normalises an answer string: converts it to lowercase + trim
   * @param {string} s - the provided string
   * @returns {string} - the normalised string
   */
  function normalise(s) {
    return s.toLowerCase().trim();
  }

  function buildWidget(
    id,
    questionText,
    correctAnswer,
    points,
    alreadyAwarded,
  ) {
    const widget = document.createElement("div");
    widget.setAttribute("id", id);
    widget.setAttribute("aria-label", "Question");

    // Question prompt
    const prompt = document.createElement("p");
    prompt.className = "q-prompt";

    const questionLabel = document.createElement("strong");
    questionLabel.textContent = "Question:";
    const question = document.createTextNode(" " + questionText);

    prompt.appendChild(questionLabel);
    prompt.appendChild(question);

    // Input row
    const inputRow = document.createElement("div");
    inputRow.className = "answer-box";

    // Answer input
    const input = document.createElement("input");
    const inputId = id + "-input";
    input.type = "text";
    input.className = "answer-input";
    input.id = inputId;
    input.setAttribute("placeholder", "Enter your answer");
    input.setAttribute("autocomplete", false);

    // Check answer button
    const btn = document.createElement("button");
    btn.className = "answer-button";
    btn.textContent = "Check Answer";

    // Append components to input row
    inputRow.appendChild(input);
    inputRow.appendChild(btn);

    // Feedback
    const feedback = document.createElement("div");
    feedback.id = id + "-feedback";

    // Create widget
    widget.appendChild(prompt);
    widget.appendChild(inputRow);
    widget.appendChild(feedback);

    // Logic
    function checkAnswer() {
      const rawAnswer = input.value;
      const isCorrect = normalise(rawAnswer) === normalise(correctAnswer);

      if (isCorrect) {
        feedback.className = "correct";
        feedback.textContent = correctAnswerText;

        // TODO
        // check if question has already been answered
        // If not dispatch points to tracker
      } else {
        feedback.className = "incorrect";
        feedback.textContent = incorrectAnswerText;
      }
    }

    // Event listeners for clicking "check answer"
    btn.addEventListener("click", checkAnswer);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        checkAnswer();
      }
    });

    return widget;
  }
})();
