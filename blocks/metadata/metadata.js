/**
 * No-op: production strips the Page Metadata block server-side before the
 * page reaches the browser. This stub only exists so the block loader
 * doesn't 404 against local dev servers that don't perform that strip.
 * @param {Element} block The metadata block element
 */
export default function decorate(block) {
  block.remove();
}
