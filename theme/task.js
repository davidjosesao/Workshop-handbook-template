(function () {
  "use strict";

  customElements.define(
    "task-item",
    class extends HTMLElement {
      connectedCallback() {
        const id = this.getAttribute("id");
        const points = parseInt(this.getAttribute("points") || "0", 10);
        const description = this.innerHTML;

        const isDone = window.PointsSystem ? window.PointsSystem.has(id) : false;

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
          if (!window.PointsSystem) return;

          if (checkbox.checked) {
            window.PointsSystem.add(points, id);
          } else {
            window.PointsSystem.remove(points, id);
          }
        });

        this.replaceWith(wrapper);
      }
    }
  );
})();