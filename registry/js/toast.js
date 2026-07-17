/* JLDS behavior — Toast. Imperative API for plain HTML: call JLDS.toast(...) from
 * anywhere; it lazily creates a positioned toaster container and stacks toasts
 * (tones, action, auto-dismiss). Requires core.js (or the all.js bundle).
 *
 *   JLDS.toast("Saved")                         // neutral
 *   JLDS.toast.success("Profile updated")
 *   JLDS.toast({ title: "Deploy failed", description: "...", tone: "danger",
 *               action: { label: "Retry", onClick: fn }, duration: Infinity })
 *   var el = JLDS.toast(...); JLDS.toast.dismiss(el)
 */
(function () {
  var J = (window.JLDS = window.JLDS || {});

  var ICONS = {
    success: '<path d="M8 12.5l2.5 2.5 5.5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    warning: '<path d="M12 8.5v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none"/>',
    danger: '<path d="M12 8v4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none"/>',
    info: '<path d="M12 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none"/>',
  };
  var CLOSE_SVG =
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function ensureToaster(position) {
    position = position || "bottom-right";
    var t = document.querySelector('.jl-toaster[data-pos="' + position + '"]');
    if (!t) {
      t = document.createElement("div");
      t.className = "jl-toaster";
      t.setAttribute("data-pos", position);
      document.body.appendChild(t);
    }
    return t;
  }

  function dismiss(el) {
    if (!el || el.__leaving) return;
    el.__leaving = true;
    el.setAttribute("data-leaving", "true");
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 200);
  }

  function show(opts) {
    if (typeof document === "undefined") return null;
    if (typeof opts === "string") opts = { description: opts };
    opts = opts || {};
    var position = opts.position || "bottom-right";
    var toaster = ensureToaster(position);

    var el = document.createElement("div");
    el.className = "jl-toast" + (opts.tone ? " jl-toast--" + opts.tone : "");
    el.setAttribute("role", "status");

    if (opts.tone === "loading") {
      var spin = document.createElement("span");
      spin.className = "jl-toast__icon";
      spin.innerHTML = '<span class="jl-toast__spin" aria-hidden="true"></span>';
      el.appendChild(spin);
    } else if (opts.tone && ICONS[opts.tone]) {
      var icon = document.createElement("span");
      icon.className = "jl-toast__icon";
      icon.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" opacity="0.35"/>' +
        ICONS[opts.tone] +
        "</svg>";
      el.appendChild(icon);
    }

    var body = document.createElement("div");
    body.className = "jl-toast__body";
    if (opts.title) {
      var ti = document.createElement("div");
      ti.className = "jl-toast__title";
      ti.textContent = opts.title;
      body.appendChild(ti);
    }
    if (opts.description) {
      var de = document.createElement("div");
      de.className = "jl-toast__desc";
      de.textContent = opts.description;
      body.appendChild(de);
    }

    var timer;
    function remove() {
      if (timer) clearTimeout(timer);
      dismiss(el);
    }

    if (opts.action && opts.action.label) {
      var ab = document.createElement("button");
      ab.type = "button";
      ab.className = "jl-toast__action";
      ab.textContent = opts.action.label;
      ab.addEventListener("click", function () {
        if (opts.action.onClick) opts.action.onClick();
        remove();
      });
      body.appendChild(ab);
    }
    el.appendChild(body);

    var close = document.createElement("button");
    close.type = "button";
    close.className = "jl-toast__close";
    close.setAttribute("aria-label", "Dismiss");
    close.innerHTML = CLOSE_SVG;
    close.addEventListener("click", remove);
    el.appendChild(close);

    // newest on top for top-* positions
    if (position.indexOf("top") === 0) toaster.insertBefore(el, toaster.firstChild);
    else toaster.appendChild(el);

    if (opts.duration !== Infinity && opts.duration !== 0) {
      timer = setTimeout(remove, opts.duration || 4500);
    }
    return el;
  }

  function toned(tone) {
    return function (description, opts) {
      var o = { tone: tone, description: description };
      if (opts) for (var k in opts) o[k] = opts[k];
      return show(o);
    };
  }

  J.toast = function (opts) {
    return show(opts);
  };
  J.toast.success = toned("success");
  J.toast.warning = toned("warning");
  J.toast.danger = toned("danger");
  J.toast.info = toned("info");
  J.toast.loading = function (description, opts) {
    var o = { tone: "loading", description: description, duration: Infinity };
    if (opts) for (var k in opts) o[k] = opts[k];
    return show(o);
  };
  J.toast.promise = function (promise, msgs) {
    msgs = msgs || {};
    var el = show({ tone: "loading", description: msgs.loading || "Loading…", duration: Infinity });
    var p = typeof promise === "function" ? promise() : promise;
    Promise.resolve(p)
      .then(function (data) {
        var m = typeof msgs.success === "function" ? msgs.success(data) : msgs.success;
        dismiss(el);
        show({ tone: "success", description: m || "Done", duration: 4500 });
      })
      .catch(function (err) {
        var m = typeof msgs.error === "function" ? msgs.error(err) : msgs.error;
        dismiss(el);
        show({ tone: "danger", description: m || "Something went wrong", duration: 4500 });
      });
    return el;
  };
  J.toast.dismiss = function (el) {
    dismiss(el);
  };
})();
