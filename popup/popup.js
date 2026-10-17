const $ = (s) => document.querySelector(s);
const DEFAULTS = { on: true, stories: true, dms: true, typing: true };
let ghost = { ...DEFAULTS };

function paint() {
  document.body.dataset.on = String(ghost.on);
  $("#big").setAttribute("aria-pressed", String(ghost.on));
  $("#state").textContent = ghost.on ? "GHOST MODE ON" : "GHOST MODE OFF";
  $("#hint").textContent = ghost.on ? "tap to turn off" : "tap to turn on";
  ["stories", "dms", "typing"].forEach((k) => { $("#" + k).checked = !!ghost[k]; });
}
const save = () => chrome.storage.local.set({ ghost });

$("#big").addEventListener("click", () => { ghost.on = !ghost.on; paint(); save(); });
["stories", "dms", "typing"].forEach((k) => $("#" + k).addEventListener("change", (e) => { ghost[k] = e.target.checked; save(); }));

chrome.storage.onChanged.addListener((c) => { if (c.count) $("#count").textContent = c.count.newValue || 0; });

(async () => {
  const d = await chrome.storage.local.get(["ghost", "count"]);
  ghost = { ...DEFAULTS, ...(d.ghost || {}) };
  $("#count").textContent = d.count || 0;
  paint();
})();
