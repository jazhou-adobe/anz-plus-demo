/**
 * Iconnav block — a horizontal, wrapping, centered row of small borderless
 * icon + label items (the homepage "Explore ANZ Plus" bar).
 *
 * Authoring contract: each ROW is one item with two cells — an image cell
 * (a `<picture>`) and a text cell containing the label (typically a link).
 *
 * @param {Element} block The iconnav block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) cell.classList.add('iconnav-icon');
      else cell.classList.add('iconnav-label');
      li.append(cell);
    });
    ul.append(li);
  });
  block.replaceChildren(ul);
}
