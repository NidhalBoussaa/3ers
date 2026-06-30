"use client";
/**
 * Tiny, RTL-safe text splitter — a free stand-in for GSAP's SplitText.
 * Wraps each word (or char) of an element's text in an inline-block <span>
 * so GSAP can stagger them. It does NOT reorder, so Arabic/RTL stays correct;
 * the parent's `direction` handles visual order.
 *
 * Call `revert()` to restore the original text before re-splitting (e.g. on
 * a language change).
 */

export type SplitResult = {
  parts: HTMLElement[];
  revert: () => void;
};

function split(el: HTMLElement, mode: "words" | "chars"): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? "";

  // Words keep their trailing space; chars include spaces as non-breaking gaps.
  const tokens =
    mode === "words"
      ? text.split(/(\s+)/).filter((t) => t.length > 0)
      : Array.from(text);

  el.textContent = "";
  const parts: HTMLElement[] = [];

  for (const tok of tokens) {
    if (/^\s+$/.test(tok)) {
      el.appendChild(document.createTextNode(tok));
      continue;
    }
    const span = document.createElement("span");
    span.className = "split-part";
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity, filter";
    span.textContent = tok;
    el.appendChild(span);
    parts.push(span);
    if (mode === "words") el.appendChild(document.createTextNode(" "));
  }

  return {
    parts,
    revert: () => {
      el.innerHTML = original;
    },
  };
}

export function splitWords(el: HTMLElement): SplitResult {
  return split(el, "words");
}

export function splitChars(el: HTMLElement): SplitResult {
  return split(el, "chars");
}
