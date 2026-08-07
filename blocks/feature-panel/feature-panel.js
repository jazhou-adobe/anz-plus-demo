/**
 * Feature panel block.
 * A promotional split panel: optional image beside a text column (heading, copy, CTA).
 * Used for product intros, full-bleed colour callouts and tinted rounded panels.
 *
 * Authoring contract: one cell per row.
 *  - A row whose only content is a picture becomes the panel IMAGE.
 *  - Any other row becomes text CONTENT (heading / copy / CTA).
 * Image side is determined by DOM order (image row before/after the content row).
 *
 * Variants (extra classes on the block):
 *  - `blue`  full-bleed bright-blue background, white text
 *  - `navy`  full-bleed brand-navy background, white text
 *  - `tint`  contained light-blue rounded panel
 *  - `center` centres the text column (used for text-only panels)
 *
 * @param {Element} block The feature-panel block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cell = row.children.length === 1 ? row.firstElementChild : null;
    const isImage = cell
      && cell.children.length === 1
      && cell.firstElementChild.tagName === 'PICTURE';
    row.classList.add(isImage ? 'feature-panel-image' : 'feature-panel-content');
  });
}
