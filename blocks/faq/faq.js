/**
 * FAQ block.
 * Renders authored question/answer rows as an accessible accordion using native
 * <details>/<summary> elements.
 *
 * Authoring contract: each row has two cells — [question] [answer (rich content)].
 *
 * @param {Element} block The faq block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const details = document.createElement('details');
    details.className = 'faq-item';

    const summary = document.createElement('summary');
    summary.className = 'faq-question';
    summary.textContent = (cells[0]?.textContent || '').trim();
    details.append(summary);

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    if (cells[1]) {
      while (cells[1].firstChild) answer.append(cells[1].firstChild);
    }
    details.append(answer);

    row.replaceWith(details);
  });
}
