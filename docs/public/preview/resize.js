function postHeight() {
  parent.postMessage(
    { type: "jlds-preview-height", height: document.documentElement.scrollHeight },
    "*"
  );
}

window.addEventListener("load", postHeight);
new ResizeObserver(postHeight).observe(document.documentElement);
