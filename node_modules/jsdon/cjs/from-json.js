'use strict';
const {
  NODE_END,
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE
} = require('./constants.js');

const SVG = 'http://www.w3.org/2000/svg';

const {parse} = JSON;

/**
 * Given a JSON string, or a JSDON compatible array, returns
 * a DOM element representing such value.
 * @param {string|Array} value
 * @param {Document?} ownerDocument
 * @returns {Document|DocumentFragment|Element|Text|Comment}
 */
const fromJSON = (value, ownerDocument = document) => {
  const array = typeof value === 'string' ? parse(value) : value;
  const {length} = array;
  const fragment = ownerDocument.createDocumentFragment();
  let parentNode = fragment;
  let isFragment = false;
  let doc = ownerDocument;
  let skipCheck = true;
  let i = 0;
  while (i < length) {
    let nodeType = array[i++];
    switch (nodeType) {
      case ELEMENT_NODE:
        const localName = array[i++];
        const lowerName = localName.toLowerCase();
        const attributes = [];
        let length = 0;
        let is = '';
        while (array[i] === ATTRIBUTE_NODE) {
          const name = array[++i];
          const value = typeof array[i + 1] === 'string' ? array[++i] : '';
          if (name === 'is')
            is = value;
          length = attributes.push({name, value});
          i++;
        }
        // avoid re-creating the root element (html, svg, or root)
        if (skipCheck || lowerName !== parentNode.localName.toLowerCase()) {
          parentNode = parentNode.appendChild(
            (lowerName === 'svg' || 'ownerSVGElement' in parentNode) ?
              doc.createElementNS(SVG, localName) :
              (is ? doc.createElement(localName, {is}) : doc.createElement(localName))
          );
        }
        // TODO: setAttributeNS (meh?)
        for (let j = 0; j < length; j++)
          parentNode.setAttribute(attributes[j].name, attributes[j].value);
        skipCheck = true;
        break;
      case TEXT_NODE:
        parentNode.appendChild(doc.createTextNode(array[i++]));
        break;
      case COMMENT_NODE:
        parentNode.appendChild(doc.createComment(array[i++]));
        break;
      case DOCUMENT_NODE:
        const parser = new ownerDocument.defaultView.DOMParser;
        if (array[i] === DOCUMENT_TYPE_NODE) {
          i++;
          const name = array[i++];
          const args = [name];
          while (typeof array[i] === 'string')
            args.push(`"${array[i++]}"`);
          switch (args.length) {
            case 2:
              args[1] = `${/\.dtd"$/i.test(args[1]) ? 'SYSTEM' : 'PUBLIC'} ${args[1]}`;
              break;
            case 3:
              args[1] = `PUBLIC ${args[1]}`;
              break;
          }
          switch (name) {
            case 'html':
            case 'HTML':
              doc = parser.parseFromString(`<!DOCTYPE ${args.join(' ')}><html></html>`, 'text/html');
              break;
            /* c8 ignore start */
            case 'svg':
            case 'SVG':
              doc = parser.parseFromString(`<!DOCTYPE ${args.join(' ')}><svg />`, 'image/svg+xml');
              break;
            default:
              doc = parser.parseFromString('<root />', 'text/xml');
              break;
            /* c8 ignore stop */
          }
        }
        else
          doc = parser.parseFromString('<html></html>', 'text/html');
        parentNode = doc.documentElement;
        skipCheck = false;
        break;
      case DOCUMENT_FRAGMENT_NODE:
        isFragment = true;
        break;
      default:
        do {
          nodeType -= NODE_END;
          parentNode = parentNode.parentNode || fragment;
        }
        while (nodeType < 0);
        break;
    }
  }
  if (isFragment)
    return fragment;
  if (doc !== ownerDocument)
    return doc;
  return fragment.firstChild;
};
exports.fromJSON = fromJSON;
