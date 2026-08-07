/**
 * Appjoin block — the full-bleed navy "Get started in the ANZ Plus app" section.
 * Heading, CTA, star rating and app-store badges on the left; the download QR code
 * with a caption on the right.
 *
 * Authoring contract: a single row with two cells. The cell containing the heading
 * is the content column; the other cell (the QR `<picture>` + caption) is the media
 * column.
 *
 * @param {Element} block The appjoin block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  [...row.children].forEach((cell) => {
    if (cell.querySelector('h1, h2, h3')) cell.classList.add('appjoin-content');
    else cell.classList.add('appjoin-media');
  });
}
