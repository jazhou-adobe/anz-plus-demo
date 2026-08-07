/**
 * util-link-cards block.
 * A vertical stack of bordered, rounded link rows each ending in a chevron — the
 * "topic list" pattern used on ANZ Plus support pages (e.g. Feedback & Complaints),
 * where each row links to a sub-article.
 *
 * Authoring contract: a single cell containing a `<ul>`; each `<li>` holds one link
 * (the sole content of the item). Each item becomes a full-width clickable card.
 *
 * @param {Element} block The util-link-cards block element
 */
export default function decorate(block) {
  block.querySelectorAll('ul').forEach((ul) => {
    ul.classList.add('util-link-cards-list');
    [...ul.children].forEach((li) => li.classList.add('util-link-cards-item'));
  });
}
