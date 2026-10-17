(() => {
  if (window.__ghostlyBridge) return;
  window.__ghostlyBridge = true;

  const DEFAULTS = { on: true, stories: true, dms: true, typing: true };
  let s = { ...DEFAULTS };

  function push() {
    document.documentElement.dataset.ghostly = JSON.stringify(s);
    renderPill();
  }

  let host, pill, toast, timer;
  function ui() {
    if (host && host.isConnected) return true;
    if (!document.body) return false;
    host = document.createElement("div");
    host.style.cssText = "all:initial;position:fixed;z-index:2147483647;left:0;bottom:0;";
    const root = host.attachShadow({ mode: "closed" });
    root.innerHTML = `
      <style>
        .wrap { position: fixed; left: 16px; bottom: 16px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; pointer-events: none;
                font-family: "Arial Rounded MT Bold", "Segoe UI Black", system-ui, sans-serif; font-weight: 800; }
        .pill, .toast { border: 2.5px solid #1B1530; border-radius: 999px; font-size: 12px; padding: 6px 12px; color: #1B1530; box-shadow: 3px 3px 0 #1B1530; }
        .pill { background: #C8F23A; }
        .toast { background: #FFD84D; opacity: 0; transform: translateY(6px); transition: opacity .2s, transform .2s; }
        .toast.show { opacity: 1; transform: none; }
        [hidden] { display: none; }
      </style>
      <div class="wrap"><div class="toast" id="t"></div><div class="pill" id="p" hidden>👻 Ghost mode on</div></div>`;
    pill = root.getElementById("p");
    toast = root.getElementById("t");
    document.body.appendChild(host);
    return true;
  }
  function renderPill() { if (ui()) pill.hidden = !s.on; }

  const LABEL = { stories: "story view", dms: "“Seen”", typing: "typing indicator" };
  document.addEventListener("ghostly-hid", (e) => {
    if (ui()) {
      toast.textContent = "👻 Hid your " + (LABEL[e.detail] || "activity");
      toast.classList.add("show");
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }
    bump();
  });

 
  let pending = 0, bumpTimer;
  function bump() {
    pending++;
    clearTimeout(bumpTimer);
    bumpTimer = setTimeout(async () => {
      const n = pending; pending = 0;
      try {
        const { count } = await chrome.storage.local.get("count");
        await chrome.storage.local.set({ count: (count || 0) + n });
      } catch (err) { /* extension reloaded */ }
    }, 250);
  }

  async function load() {
    try {
      const { ghost } = await chrome.storage.local.get("ghost");
      s = { ...DEFAULTS, ...(ghost || {}) };
      push();
    } catch (e) { /* extension reloaded: refresh the page */ }
  }
  try { chrome.storage.onChanged.addListener((_c, area) => { if (area === "local") load(); }); } catch (e) { /* ignore */ }

  push();
  load();
  setInterval(() => { if (!host || !host.isConnected) renderPill(); }, 1500);
})();
