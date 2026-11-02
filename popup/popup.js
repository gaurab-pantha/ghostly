const api = globalThis.browser || globalThis.chrome;
const DEFAULTS = { on: true, stories: true, dms: true, typing: true, count: 0 };
const KEYS = ["stories", "dms", "typing"];

const $ = (id) => document.getElementById(id);

function render(s) {
  const on = s.on !== false;
  document.body.dataset.on = String(on);
  $("big").setAttribute("aria-pressed", String(on));
  $("state").textContent = on ? "GHOST MODE ON" : "GHOST MODE OFF";
  $("hint").textContent = on ? "tap to turn off" : "tap to turn on";
  for (const k of KEYS) $(k).checked = s[k] !== false;
  $("count").textContent = String(Number(s.count) || 0);
}

document.addEventListener("DOMContentLoaded", async () => {
  try { render(await api.storage.local.get(DEFAULTS)); } catch (e) { render(DEFAULTS); }

  $("big").addEventListener("click", async () => {
    const s = await api.storage.local.get(DEFAULTS);
    await api.storage.local.set({ on: !(s.on !== false) });
  });

  for (const k of KEYS) {
    $(k).addEventListener("change", () => api.storage.local.set({ [k]: $(k).checked }));
  }

  api.storage.onChanged.addListener((_, area) => {
    if (area === "local") api.storage.local.get(DEFAULTS).then(render);
  });
});
