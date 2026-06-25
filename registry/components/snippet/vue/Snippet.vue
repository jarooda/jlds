<script setup lang="ts">
import { ref, computed } from "vue";

type SnippetVariant = "inline" | "block";

const props = withDefaults(
  defineProps<{
    code?: string;
    variant?: SnippetVariant;
    prompt?: string | null;
    language?: string;
    title?: string;
    lineNumbers?: boolean;
    copyable?: boolean;
  }>(),
  {
    code: undefined,
    variant: "inline",
    prompt: undefined,
    language: "",
    title: "",
    lineNumbers: false,
    copyable: true,
  }
);

const promptGlyph = computed(() =>
  props.prompt !== undefined ? props.prompt : props.variant === "inline" ? "$" : null
);

const codeEl = ref<HTMLElement | null>(null);
const done = ref(false);

function copy() {
  const text = props.code != null ? props.code : codeEl.value?.textContent ?? "";
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {
      /* noop */
    }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(fallback);
  } else {
    fallback();
  }
  done.value = true;
  setTimeout(() => (done.value = false), 1600);
}

const hasBar = computed(() => !!(props.title || props.language));
const lines = computed(() =>
  String(props.code ?? "").replace(/\n$/, "").split("\n")
);
const blockCls = computed(() =>
  [
    "jl-codeblock",
    props.lineNumbers ? "jl-codeblock--numbered" : "",
    hasBar.value ? "" : "jl-codeblock--barless",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <!-- block -->
  <div v-if="variant === 'block'" :class="blockCls">
    <div v-if="hasBar" class="jl-codeblock__bar">
      <span v-if="title" class="jl-codeblock__title">{{ title }}</span>
      <span v-if="language" class="jl-codeblock__lang">{{ language }}</span>
      <button
        v-if="copyable"
        type="button"
        class="jl-codeblock__copy"
        :class="{ 'jl-codeblock__copy--done': done }"
        @click="copy"
      >
        <svg v-if="done" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <svg v-else viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4" /><path d="M3.5 10.5A1.5 1.5 0 0 1 2.5 9V3.5A1.5 1.5 0 0 1 4 2h5a1.5 1.5 0 0 1 1.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg>
        {{ done ? "Copied" : "Copy" }}
      </button>
    </div>
    <button
      v-if="!hasBar && copyable"
      type="button"
      class="jl-codeblock__copy"
      :class="{ 'jl-codeblock__copy--done': done }"
      aria-label="Copy code"
      @click="copy"
    >
      <svg v-if="done" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      <svg v-else viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4" /><path d="M3.5 10.5A1.5 1.5 0 0 1 2.5 9V3.5A1.5 1.5 0 0 1 4 2h5a1.5 1.5 0 0 1 1.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg>
    </button>
    <div class="jl-codeblock__scroll">
      <pre><code><span v-for="(ln, i) in lines" :key="i" class="jl-codeblock__row">{{ ln + (i < lines.length - 1 ? "\n" : "") }}</span></code></pre>
    </div>
  </div>

  <!-- inline -->
  <span v-else class="jl-snippet">
    <span v-if="promptGlyph" class="jl-snippet__prompt">{{ promptGlyph }}</span>
    <span ref="codeEl" class="jl-snippet__code"><slot>{{ code }}</slot></span>
    <button
      v-if="copyable"
      type="button"
      class="jl-snippet__copy"
      :class="{ 'jl-snippet__copy--done': done }"
      aria-label="Copy"
      @click="copy"
    >
      <svg v-if="done" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      <svg v-else viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4" /><path d="M3.5 10.5A1.5 1.5 0 0 1 2.5 9V3.5A1.5 1.5 0 0 1 4 2h5a1.5 1.5 0 0 1 1.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg>
    </button>
  </span>
</template>

<style src="./snippet.css"></style>
