/**
 * util-download-hero block.
 * The navy, two-column "Get started in the ANZ Plus app" banner on the /download page:
 * a text column (heading, sub-copy, QR code, app-store badges, fine print) beside a
 * contained phone-app screenshot.
 *
 * Authoring contract (single row, two cells):
 * - One cell holds the default content: heading, sub-copy, QR `<picture>`, the two
 *   store-badge links (each an `<a>` wrapping a `<picture>`), and a fine-print line.
 *   This is detected as the text column because it contains a heading.
 * - The other cell holds only the phone screenshot `<picture>` — the media column.
 *
 * @param {Element} block The util-download-hero block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  [...row.children].forEach((cell) => {
    const hasHeading = cell.querySelector('h1, h2, h3');
    if (hasHeading) {
      cell.classList.add('util-download-hero-text');
      // group the store-badge links so they sit side by side
      const badges = [...cell.querySelectorAll('p')].filter(
        (p) => p.querySelector('a') && p.querySelector('picture'),
      );
      if (badges.length) {
        const wrap = document.createElement('div');
        wrap.className = 'util-download-hero-badges';
        badges[0].before(wrap);
        badges.forEach((p) => {
          const link = p.querySelector('a');
          wrap.append(link);
          p.remove();
        });
      }
      // tag the QR image (a lone picture in its own paragraph/cell)
      const qr = cell.querySelector('p > picture, :scope > picture');
      if (qr) {
        const qrPara = qr.closest('p') || qr;
        qrPara.classList.add('util-download-hero-qr');
      }
    } else {
      cell.classList.add('util-download-hero-media');
    }
  });
}
