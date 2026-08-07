/**
 * hls-eligibility block.
 * The "Things you should know" eligibility panel: a full-bleed light-grey section
 * with a centered intro, then one or more rows that pair a left-hand heading with a
 * right-hand bulleted list ("We might be a good fit for you if:" etc.).
 *
 * Authoring contract:
 *  - A row with a SINGLE cell is the centered intro (heading + copy).
 *  - A row with TWO cells is a criteria group: [heading] [list].
 *
 * @param {Element} block The hls-eligibility block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      row.classList.add('hls-eligibility-intro');
    } else {
      row.classList.add('hls-eligibility-row');
      cells[0].classList.add('hls-eligibility-head');
      cells[1].classList.add('hls-eligibility-list');
    }
  });
}
