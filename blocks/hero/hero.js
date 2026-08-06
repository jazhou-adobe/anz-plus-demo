/**
 * Hero block.
 * Authoring contract: first row = a single image cell (full-bleed background image);
 * any further rows = default content (heading, copy, CTA) that renders on top of it.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && cells[0].querySelector('picture')) {
      // image-only row: hoist the picture directly under the block so
      // hero.css can position it as an absolute, full-bleed background
      const picture = cells[0].querySelector('picture');
      block.prepend(picture);
    } else {
      // content row: unwrap the cell(s) so headings/copy/CTA sit directly
      // in the block for hero.css to style
      cells.forEach((cell) => {
        while (cell.firstElementChild) block.append(cell.firstElementChild);
      });
    }
    row.remove();
  });
}
