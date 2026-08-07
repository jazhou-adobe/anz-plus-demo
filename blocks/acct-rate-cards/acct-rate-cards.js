/**
 * acct-rate-cards block — a full-bleed navy section presenting product / rate content
 * as rounded cards. Flexible enough to cover: rate cards (heading + big figures + CTA),
 * figure-only rate cards, promo cards (heading + copy + CTA), an optional centered
 * section title / intro (red heading + white copy) and a trailing small note.
 *
 * Row classification (each ROW is a single default-content cell):
 *  - contains a rate figure (a paragraph whose text starts with a percentage) OR a
 *    heading together with a CTA link  -> a CARD.
 *  - a heading with no figure and no CTA (optionally followed by intro copy)
 *                                        -> a centered TITLE / INTRO.
 *  - neither heading nor figure          -> a small NOTE (e.g. "You should know").
 *
 * Within a card, each rate figure paragraph is enlarged and the paragraph directly
 * after it becomes its label.
 *
 * @param {Element} block The acct-rate-cards block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const heading = cell.querySelector('h1, h2, h3');
    const figures = [...cell.querySelectorAll(':scope > p')]
      .filter((p) => /^[\d.]+\s*%/.test(p.textContent.trim()));
    const hasCta = !!cell.querySelector('a.button, strong a, em a');

    if (figures.length || (heading && hasCta)) {
      row.classList.add('acct-rate-cards-card');
      figures.forEach((p) => {
        p.classList.add('acct-rate-cards-figure');
        const next = p.nextElementSibling;
        if (next && next.tagName === 'P' && !next.classList.contains('acct-rate-cards-figure')) {
          next.classList.add('acct-rate-cards-figlabel');
        }
      });
      return;
    }
    if (heading) {
      row.classList.add('acct-rate-cards-title');
      return;
    }
    row.classList.add('acct-rate-cards-note');
  });

  const cardCount = block.querySelectorAll('.acct-rate-cards-card').length;
  block.classList.add(cardCount >= 3 ? 'acct-rate-cards-3up' : 'acct-rate-cards-2up');
}
