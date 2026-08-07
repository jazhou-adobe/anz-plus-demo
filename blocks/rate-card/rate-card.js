/**
 * Rate card block.
 * A full-bleed navy panel that headlines one or more product rates as large figures
 * with a small unit and a supporting label (e.g. home-loan variable / comparison rate).
 *
 * Authoring contract:
 *  - First row: a single cell with the panel heading.
 *  - Each following row: two cells — [rate figure, e.g. "6.25% p.a."] [label].
 *
 * @param {Element} block The rate-card block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length) rows[0].classList.add('rate-card-head');

  const figures = document.createElement('div');
  figures.className = 'rate-card-figures';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const figure = document.createElement('div');
    figure.className = 'rate-card-figure';

    const valueText = (cells[0]?.textContent || '').trim();
    const value = document.createElement('p');
    value.className = 'rate-card-value';
    const match = valueText.match(/^([\d.]+)\s*(.*)$/);
    if (match) {
      value.innerHTML = `<span class="rate-card-num">${match[1]}</span><span class="rate-card-unit">${match[2]}</span>`;
    } else {
      value.textContent = valueText;
    }
    figure.append(value);

    if (cells[1]) {
      const label = document.createElement('p');
      label.className = 'rate-card-label';
      label.innerHTML = cells[1].innerHTML;
      figure.append(label);
    }
    figures.append(figure);
    row.remove();
  });

  block.append(figures);
}
