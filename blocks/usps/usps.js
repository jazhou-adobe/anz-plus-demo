/**
 * USPs block — the full-bleed "Why choose ANZ Plus?" section: a centered lotus
 * icon, heading + subcopy, and a row of icon + label items separated by thin
 * vertical dividers.
 *
 * Authoring contract (rows, in order):
 * - a single image cell -> the lotus icon (centered, on top)
 * - a text cell with a heading + copy -> the centered intro
 * - one or more rows of [image cell][label cell] -> the icon columns
 *
 * @param {Element} block The usps block element
 */
export default function decorate(block) {
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const hasPicture = cells[0].querySelector('picture');
    if (cells.length >= 2 && hasPicture) {
      row.classList.add('usps-item');
      cells[0].classList.add('usps-icon');
      cells[1].classList.add('usps-label');
      items.push(row);
    } else if (hasPicture) {
      row.classList.add('usps-lotus');
    } else {
      row.classList.add('usps-intro');
    }
  });

  if (items.length) {
    const wrap = document.createElement('div');
    wrap.className = 'usps-items';
    items[0].before(wrap);
    items.forEach((item) => wrap.append(item));
  }
}
