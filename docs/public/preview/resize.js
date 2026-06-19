// Hide the preview's own scrollbar — the iframe is sized to its content, so
// any sub-pixel overflow would otherwise show a stray bar inside the frame.
document.documentElement.style.overflow = "hidden";
document.body.style.overflow = "hidden";

// Follow the docs site's appearance toggle. JLDS dark mode is opt-in via
// data-theme="dark" on <html>; the parent posts the current theme to us.
function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "jlds-preview-theme") {
    applyTheme(event.data.dark);
  }
});

function postHeight() {
  // Measure the body's border-box (content + padding); previews set body margin:0.
  // Math.ceil avoids a sub-pixel overflow that would show an internal scrollbar.
  const height = Math.ceil(document.body.getBoundingClientRect().height);
  parent.postMessage({ type: "jlds-preview-height", height }, "*");
}

window.addEventListener("load", function () {
  // Ask the parent to send the current theme now that our listener is ready.
  parent.postMessage({ type: "jlds-preview-ready" }, "*");
  postHeight();
});

// Geist loads async via @import — re-measure once fonts settle so the iframe
// grows to the reflowed height instead of clipping/scrolling.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(postHeight);
}

new ResizeObserver(postHeight).observe(document.body);
