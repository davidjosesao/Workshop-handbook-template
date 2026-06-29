// Create an instance of a custom question tag template
customElements.define(
  "question",
  class extends HTMLElement {
    connectedCallback() {
      const questionText = this.attribute("q");
      const correctAnswer = this.attribute("a");
      const points = parseInt(this.getAttribute("points") || "0", 10);
      const id = createId();
      const widget = buildWidget(id, questionText, correctAnswer, points);
      this.replaceWith(widget);
    }
  },
);

(function () {
  "use strict";

  function createId() {
    // TODO
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
    prompt.textContent = questionText;

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
    btn.textContent = "Check";	

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
	function answerCheck() {
		const rawAnswer = input.value;
		const isCorrect = normalise(rawAnswer) === normalise(correctAnswer);

	}
  }
});
