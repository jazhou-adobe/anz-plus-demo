/**
 * Panel block — a rounded promo panel (sub-banner) that sits full-bleed within the
 * content column. Used for the homepage sub-banners (My Accounts, New to Australia,
 * Home Loans, Joint Accounts).
 *
 * Authoring contract:
 * - Each ROW of the block is one panel.
 * - The FIRST cell of a row is a variant keyword: `blue` | `tint` | `white` | `photo`.
 *   - blue  = solid brand-accent panel, white text + white CTA, media beside text
 *   - tint  = light-blue panel, dark text, media beside text
 *   - white = white bordered card (used in the duo layout)
 *   - photo = media becomes the panel background with white text overlaid
 * - The remaining cells are the text content (eyebrow / heading / CTA) and an image
 *   cell (a `<picture>`); order is detected automatically.
 * - Add the block-level modifier `duo` to lay the rows out as a 2-up grid on desktop.
 *
 * @param {Element} block The panel block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const variant = cells[0].textContent.trim().toLowerCase();
    if (['blue', 'tint', 'white', 'photo'].includes(variant)) {
      row.classList.add(`panel-${variant}`);
      cells[0].remove();
    }
    row.classList.add('panel-item');
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) cell.classList.add('panel-media');
      else cell.classList.add('panel-text');
    });
  });
}
