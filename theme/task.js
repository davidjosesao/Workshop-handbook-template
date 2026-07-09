(function () {
  "use strict";

  const STORAGE_TASKS = 'mdbook-tasks:completed';

  // reads the set of completed task ids from localStorage and returns them as a set
  const loadCompletedTasks = () => {
    try {
      const raw = localStorage.getItem(STORAGE_TASKS);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return new Set();
    }
  };

  // writes the completed tasks Set back to localStorage
  const saveCompletedTasks = (completedSet) => {
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(Array.from(completedSet)));
  };

  const completed = loadCompletedTasks();

  customElements.define(
    "task-item",
    class extends HTMLElement {
      // built-in browser lifecycle method that fires automatically when the custom element is inserted into the DOM
      connectedCallback() {
        const id     = this.getAttribute("id");
        const points = parseInt(this.getAttribute("points") || "0", 10);
        const description = this.innerHTML;

        const isDone = completed.has(id);

        const wrapper = document.createElement("div");
        wrapper.className = "task-item";
        wrapper.setAttribute("aria-label", "Task");

        const label = document.createElement("label");
        label.className = "task-label";
        label.htmlFor = id + "-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id + "-checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = isDone;

        const descriptionEl = document.createElement("span");
        descriptionEl.className = "task-description";
        descriptionEl.innerHTML = description;

        const pointsBadge = document.createElement("span");
        pointsBadge.className = "task-points-badge";
        pointsBadge.textContent = `+${points} pts`;

        label.appendChild(checkbox);
        label.appendChild(descriptionEl);
        label.appendChild(pointsBadge);
        wrapper.appendChild(label);

        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            completed.add(id);
            saveCompletedTasks(completed);
            window.PointsSystem?.add(points, id);
          } else {
            completed.delete(id);
            saveCompletedTasks(completed);
            window.PointsSystem?.remove(points, id);
          }
        });

        this.replaceWith(wrapper);
      }
    }
  );
})();