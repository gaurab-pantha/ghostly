(() => {
  if (window.__ghostly) return;
  window.__ghostly = true;

  const cfg = () => {
    try { return JSON.parse(document.documentElement.dataset.ghostly || "{}"); }
    catch (e) { return {}; }
  };

  
  function classify(url, body, friendly) {
    const u = String(url || "");
    if (/\/stories\/reel\/seen/i.test(u)) return "stories";
    if (/\/direct_v2\/threads\/[^/]+\/items\/[^/]+\/seen/i.test(u) || /\/direct_v2\/threads\/[^/]+\/mark_seen/i.test(u)) return "dms";
    if (/\/direct_v2\/threads\/[^/]+\/indicate_activity/i.test(u)) return "typing";
    const name = String(friendly || "") + " " + (typeof body === "string" ? body.slice(0, 600) : "");
    if (/(Stor(y|ies)[A-Za-z0-9]*Seen|Seen[A-Za-z0-9]*Stor(y|ies)|StoriesSeen|ReelSeen|reel_seen)/i.test(name)) return "stories";
    return null;
  }

  function blocked(kind) {
    const c = cfg();
    return !!(c.on && kind && c[kind]);
  }
  const tell = (kind) => { try { document.dispatchEvent(new CustomEvent("ghostly-hid", { detail: kind })); } catch (e) {} };
  const FAKE = JSON.stringify({ status: "ok", data: {} });

  const realFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      const req = input && typeof input === "object" && "url" in input ? input : null;
      const url = req ? req.url : String(input);
      const method = String((init && init.method) || (req && req.method) || "GET").toUpperCase();
      if (method === "POST") {
        let body = init && init.body;
        if (body instanceof URLSearchParams) body = body.toString();
        let friendly = "";
        const h = (init && init.headers) || (req && req.headers);
        if (h) friendly = typeof h.get === "function" ? (h.get("x-fb-friendly-name") || "") : (h["x-fb-friendly-name"] || h["X-FB-Friendly-Name"] || "");
        const kind = classify(url, typeof body === "string" ? body : "", friendly);
        if (blocked(kind)) {
          tell(kind);
          return Promise.resolve(new Response(FAKE, { status: 200, headers: { "content-type": "application/json" } }));
        }
      }
    } catch (e) {}
    return realFetch.apply(this, arguments);
  };

  const X = XMLHttpRequest.prototype;
  const realOpen = X.open, realSend = X.send, realSet = X.setRequestHeader;
  X.open = function (method, url) {
    this.__gMethod = String(method || "GET").toUpperCase();
    this.__gUrl = url;
    this.__gFriendly = "";
    return realOpen.apply(this, arguments);
  };
  X.setRequestHeader = function (name, value) {
    if (/^x-fb-friendly-name$/i.test(name)) this.__gFriendly = value;
    return realSet.apply(this, arguments);
  };
  X.send = function (body) {
    try {
      if (this.__gMethod === "POST") {
        const b = body instanceof URLSearchParams ? body.toString() : body;
        const kind = classify(this.__gUrl, typeof b === "string" ? b : "", this.__gFriendly);
        if (blocked(kind)) {
          tell(kind);
          const xhr = this;
          const def = (k, v) => Object.defineProperty(xhr, k, { configurable: true, get: () => v });
          setTimeout(() => {
            def("readyState", 4); def("status", 200); def("statusText", "OK");
            def("responseText", FAKE); def("response", FAKE); def("responseURL", String(xhr.__gUrl));
            xhr.dispatchEvent(new Event("readystatechange"));
            xhr.dispatchEvent(new Event("load"));
            xhr.dispatchEvent(new Event("loadend"));
          }, 0);
          return;
        }
      }
    } catch (e) {}
    return realSend.apply(this, arguments);
  };
})();
