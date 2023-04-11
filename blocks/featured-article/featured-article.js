import {
  getMetadata,
} from '../../scripts/lib-franklin.js';


function getCurrentPage () {
  return window.location.pathname
}
  const textContent = getCurrentPage();

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {Document} The document
 */
async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(path);
    if (resp.ok) {
      const parser = new DOMParser();
      return parser.parseFromString(await resp.text(), 'text/html');
    }
  }
  return null;
}

/**
 * @param {HTMLElement} $block The header block element
 */
export default async function decorate($block) {
  // const link = $block.querySelector('a');
  // const path = link ? link.getAttribute('href') : $block.textContent.trim();
  const path = textContent;
  const doc = await loadFragment(path);
  if (!doc) {
    return;
  }
  // find metadata
  //const title = getMetadata('og:title', doc);
  const title = document.querySelector('[property="og:title"]').content;
  console.log(title);
  const desc = getMetadata('og:description', doc);
  const theme = getMetadata('theme', doc);
  const author = getMetadata('author', doc);
  const date = getMetadata('date', doc);

  const $pre = document.createElement('h3');
  $pre.classList.add('pretitle');
  $pre.textContent = theme;

  const $h1 = document.createElement('h1');
  $h1.textContent = title;

  const $h5 = document.createElement('h5');
  $h5.textContent = 'BY ' + author;

  const $h6 = document.createElement('h6');
  $h6.textContent = date;

  const $p = document.createElement('p');
  $p.textContent = desc;

  /*
  const $link = document.createElement('div');
  $link.append(link);
  link.textContent = 'Read More';
  */

  const $text = document.createElement('div');
  $text.classList.add('text');
  $text.append($pre, $h1, $h5, $h6, $p);
  
  const $image = document.createElement('div');
  $image.classList.add('image');
  // find image
  const $hero = doc.querySelector('body > main picture');
  if ($hero) {
    $image.append($hero);
  }

  $block.replaceChildren($image, $text);
}
