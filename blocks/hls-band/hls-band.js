/**
 * hls-band block — a zero-content styling anchor.
 * Placing this empty block in a section makes aem.js add `hls-band-container` to that
 * section (see aem.js decorateBlock), which the CSS uses to paint the whole section a
 * full-bleed light grey. This is the endorsed "block class as section styling hook"
 * pattern, since decorateSections ignores section-metadata in this project.
 *
 * Authoring contract: an empty block placed alongside the section's other content.
 *
 * @param {Element} block The hls-band block element
 */
export default function decorate(block) {
  // no content to render — the section-level container class does the styling.
  block.remove();
}
