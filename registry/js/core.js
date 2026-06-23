/* JLDS behavior layer — core.
 * Defines the global `JLDS` namespace and runs registered behaviors. Pure
 * progressive enhancement: markup renders without it; this only adds behavior.
 *
 *   JLDS.register(name, fn)  — a behavior; fn(root) wires up elements under root
 *   JLDS.init(root)          — (re)run all behaviors for a subtree (e.g. after fetch)
 *
 * Behaviors are idempotent (they tag handled elements), so init is safe to
 * call repeatedly. Component files may load before or after this file.
 */
(function () {
  var J = (window.JLDS = window.JLDS || {});
  if (J._core) return; // guard against double-load
  J._core = true;

  var behaviors = (J._behaviors = J._behaviors || {});
  var ready = false;

  function run(name, root) {
    try {
      behaviors[name](root);
    } catch (e) {
      console.error("[jlds:" + name + "]", e);
    }
  }

  J.register = function (name, fn) {
    behaviors[name] = fn;
    if (ready) run(name, document);
  };

  J.init = function (root) {
    root = root || document;
    Object.keys(behaviors).forEach(function (name) {
      run(name, root);
    });
  };

  function ignite() {
    ready = true;
    J.init(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ignite);
  } else {
    ignite();
  }

  // Drain behaviors that registered before this core loaded.
  var pending = J._pending || [];
  J._pending = [];
  pending.forEach(function (p) {
    J.register(p[0], p[1]);
  });
})();
