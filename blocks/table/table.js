/**
 * Table block.
 * A simple side-by-side comparison table rendered from authored rows — a semantic
 * replacement for raw HTML <table> markup, which does not survive the DA content
 * round-trip (a bare <table> is re-interpreted as a block named after its own text).
 *
 * Authoring contract:
 *  - First row: one cell per column, the column heading.
 *  - Remaining rows: one cell per column, rich content allowed (e.g. <strong> sub-label
 *    + body text).
 *
 * @param {Element} block The table block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length) {
    rows[0].classList.add('table-head');
    [...rows[0].children].forEach((cell) => cell.classList.add('table-head-cell'));
  }
  rows.slice(1).forEach((row) => {
    row.classList.add('table-row');
    [...row.children].forEach((cell) => cell.classList.add('table-cell'));
  });
}
