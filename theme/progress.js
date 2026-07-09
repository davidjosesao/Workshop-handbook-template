(function () {
  "use strict";

  async function loadManifest() {
    const res = await fetch("task-manifest.json");
    if (!res.ok) throw new Error("Could not load task-manifest.json");
    return res.json();
  }

  function renderProgress(manifest) {
    const root = document.getElementById("progress-root");
    if (!root) return;

    const ps = window.PointsSystem;
    const completed = manifest.filter((e) => ps && ps.has(e.id));
    const totalPoints = manifest.reduce((sum, e) => sum + e.points, 0);
    const earnedPoints = completed.reduce((sum, e) => sum + e.points, 0);

    root.innerHTML = "";

    const summary = document.createElement("p");
    summary.className = "progress-summary";
    summary.innerHTML =
      `<strong>${completed.length} / ${manifest.length}</strong> completed &middot; ` +
      `<strong>${earnedPoints} / ${totalPoints}</strong> points`;
    root.appendChild(summary);

    const list = document.createElement("ul");
    list.className = "progress-list";

    manifest.forEach((entry) => {
      const li = document.createElement("li");
      const done = ps && ps.has(entry.id);
      li.className = done ? "progress-done" : "progress-todo";

      const check = document.createElement("span");
      check.className = "progress-check";
      check.textContent = done ? "✓ " : "☐ ";

      const link = document.createElement("a");
      link.href = entry.page;
      link.textContent = entry.text || entry.id;

      const pts = document.createElement("span");
      pts.className = "progress-points";
      pts.textContent = ` (${entry.points} pts)`;

      li.appendChild(check);
      li.appendChild(link);
      li.appendChild(pts);
      list.appendChild(li);
    });

    root.appendChild(list);
  }

  async function refresh() {
    try {
      const manifest = await loadManifest();
      renderProgress(manifest);
    } catch (e) {
      const root = document.getElementById("progress-root");
      if (root) root.textContent = "Could not load progress data.";
      console.error(e);
    }
  }

  document.addEventListener("DOMContentLoaded", refresh);
  window.addEventListener("points:change", refresh);
})();