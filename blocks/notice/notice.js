/**
 * Notice block.
 * A tinted, rounded panel used for callouts that need visual separation from the
 * page's default content flow but aren't full section-metadata (which this project's
 * decorateSections ignores) — e.g. "starter pack" callouts, in-app join panels,
 * disclosure/legal panels.
 * Authoring: default content rows; if the FIRST row is a single image cell, it is
 * treated as a side image (rendered next to the text on desktop).
 * @param {Element} block The notice block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length && rows[0].children.length === 1 && rows[0].querySelector('picture')) {
    rows[0].classList.add('notice-image');
  }
  rows.forEach((row) => {
    if (!row.classList.contains('notice-image')) row.classList.add('notice-content');
  });
}
