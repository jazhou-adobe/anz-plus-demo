/**
 * hls-link-list block.
 * Renders authored lists of links as full-width, bordered navigation rows each with a
 * right-hand chevron — the pattern used across the ANZ Plus support hub (popular topics,
 * support categories, grouped support articles).
 *
 * Authoring contract: a single cell containing one or more <ul> lists of links.
 * Optional <h3>/<h4> subheadings and "See all" <p> links can sit between lists to form
 * grouped sections. Only links inside a list item get the chevron affordance.
 *
 * Variants (extra classes on the block):
 *  - `cols-2` lay the list rows out in two columns on desktop.
 *  - `groups` lay grouped (heading + list) sections in two columns on desktop.
 *
 * @param {Element} block The hls-link-list block element
 */
export default function decorate(block) {
  block.querySelectorAll('ul').forEach((ul) => ul.classList.add('hls-link-list-items'));
}
