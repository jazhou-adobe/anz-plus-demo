/**
 * hls-calculator block.
 * A STATIC, faithful render of the ANZ Plus refinance calculator's default state
 * (no live calculation). The live tool is an interactive JS widget; here we present
 * its default inputs on the left and the resulting "You could save" card on the right.
 *
 * Authoring contract: a single row with two cells.
 *  - cell 1 = the inputs column (labels + default field values).
 *  - cell 2 = the results card (headline, savings figures, ANZ Plus rate, CTAs).
 * DOM order determines columns; the block only tags each cell with a role class.
 *
 * @param {Element} block The hls-calculator block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];
  cells[0]?.classList.add('hls-calculator-inputs');
  cells[1]?.classList.add('hls-calculator-results');
}
