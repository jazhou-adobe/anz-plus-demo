/**
 * Feature cards block.
 * A responsive grid of small cards, each an illustration/icon (shown un-cropped,
 * contained) above a heading + supporting copy. Used for the "smart ways to..."
 * feature grids, the security grid, coach tips and customer reviews.
 *
 * Authoring contract: each block row is one card with two cells —
 *   cell 1: a single picture (icon / illustration / star image)
 *   cell 2: body content (heading, copy, optional CTA)
 *
 * Variants (extra classes on the block):
 *  - `reviews` centred quote cards (star image + testimonial)
 *  - `cols-2`  cap the grid at two columns (used for coach tips)
 *
 * @param {Element} block The feature-cards block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((cell) => {
      if (cell.children.length === 1 && cell.querySelector('picture')) {
        cell.className = 'feature-cards-icon';
      } else {
        cell.className = 'feature-cards-body';
      }
    });
    ul.append(li);
  });
  block.replaceChildren(ul);
}
