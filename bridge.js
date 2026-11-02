(() => {
  const api = globalThis.browser || globalThis.chrome;
  const DEFAULTS = { on: true, stories: true, dms: true, typing: true };
  const LABELS = {
    stories: "Hid your story view",
    dms: "Hid your “Seen”",
    typing: "Hid your “typing…”"
  };

  let count = 0;

  function publish(state) {
    const cfg = {
      on: state.on !== false,
      stories: state.stories !== false,
      dms: state.dms !== false,
      typing: state.typing !== false
    };
    document.documentElement.dataset.ghostly = JSON.stringify(cfg);
  }

  publish(DEFAULTS);

  api.storage.local.get({ ...DEFAULTS, count: 0 }).then((s) => {
    count = Number(s.count) || 0;
    publish(s);
  }).catch(() => {});

  api.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.count) count = Number(changes.count.newValue) || 0;
    api.storage.local.get(DEFAULTS).then(publish).catch(() => {});
  });

  let toast, timer;
  function showToast(text) {
    const host = document.body || document.documentElement;
    if (!toast || !toast.isConnected) {
      toast = document.createElement("div");
      toast.style.cssText =
        "position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:8px 14px;" +
        "background:#FFD84D;color:#1B1530;border:2.5px solid #1B1530;border-radius:14px;" +
        "box-shadow:3px 3px 0 #1B1530;font:700 13px system-ui,sans-serif;pointer-events:none;" +
        "transition:opacity .25s;opacity:0";
      host.appendChild(toast);
    }
    toast.textContent = "👻 " + text;
    requestAnimationFrame(() => { toast.style.opacity = "1"; });
    clearTimeout(timer);
    timer = setTimeout(() => { toast.style.opacity = "0"; }, 2200);
  }

  document.addEventListener("ghostly-hid", (e) => {
    count += 1;
    api.storage.local.set({ count }).catch(() => {});
    showToast(LABELS[e.detail] || "Hid something");
  });
})();
