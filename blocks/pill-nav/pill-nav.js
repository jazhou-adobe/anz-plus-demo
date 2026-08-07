/**
 * Pill nav block.
 * A horizontal row of pill-styled in-page anchor links (a section jump nav).
 *
 * Authoring contract: a single cell containing a list (<ul>) of links, one link
 * per list item. The block renders each link as a rounded pill.
 *
 * @param {Element} block The pill-nav block element
 */
export default function decorate(block) {
  block.querySelectorAll('a').forEach((a) => a.classList.add('pill-nav-link'));
}
