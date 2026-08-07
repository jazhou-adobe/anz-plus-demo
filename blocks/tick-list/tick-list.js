/**
 * Tick list block.
 * Renders an authored list as a multi-column checklist with a green tick before
 * each item (used for "Additional features" style feature roll-ups).
 *
 * Authoring contract: a single cell containing a <ul> (one feature per <li>).
 *
 * @param {Element} block The tick-list block element
 */
export default function decorate(block) {
  block.querySelectorAll('ul').forEach((ul) => ul.classList.add('tick-list-items'));
}
