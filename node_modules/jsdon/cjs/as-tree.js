'use strict';
const {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE,
  Attr,
  DocumentType,
  Text,
  Comment,
  Document,
  DocumentFragment,
  Element
} = require('./essential.js');

(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('./essential.js'));

const toDocument = (classes, jsdon, document, i, length) => {
  const {Element, DocumentType} = classes;
  const {childNodes} = document;
  while (i < length) {
    switch (jsdon[i++]) {
      case ELEMENT_NODE: {
        const element = new Element(jsdon[i++], document);
        element.parentNode = document;
        childNodes.push(element);
        i = toElement(classes, jsdon, element, i, length);
        break;
      }
      case DOCUMENT_TYPE_NODE: {
        const docType = new DocumentType(jsdon[i++], document);
        docType.parentNode = document;
        childNodes.push(docType);
        break;
      }
    }
  }
  return document;
};

const addDataChar = (parentNode, dataChar) => {
  dataChar.parentNode = parentNode;
  parentNode.childNodes.push(dataChar);
};

const toFragment = (classes, jsdon, fragment, i, length) => {
  const {Element, Text, Comment} = classes;
  const {ownerDocument} = fragment;
  while (i < length) {
    switch (jsdon[i++]) {
      case TEXT_NODE: {
        addDataChar(fragment, new Text(jsdon[i++], ownerDocument));
        break;
      }
      case COMMENT_NODE: {
        addDataChar(fragment, new Comment(jsdon[i++], ownerDocument));
        break;
      }
      case ELEMENT_NODE: {
        const element = new Element(jsdon[i++], ownerDocument);
        element.parentNode = fragment;
        fragment.childNodes.push(element);
        i = toElement(classes, jsdon, element, i, length);
        break;
      }
    }
  }
  return fragment;
};

const toElement = (classes, jsdon, element, i, length) => {
  const {Element, Attr, Text, Comment} = classes;
  const {ownerDocument} = element;
  while (i < length) {
    switch (jsdon[i++]) {
      case TEXT_NODE: {
        addDataChar(element, new Text(jsdon[i++], ownerDocument));
        break;
      }
      case COMMENT_NODE: {
        addDataChar(element, new Comment(jsdon[i++], ownerDocument));
        break;
      }
      case ATTRIBUTE_NODE: {
        const name = jsdon[i++];
        const value = typeof jsdon[i] === 'string' ? jsdon[i++] : '';
        const attr = new Attr(name, value, ownerDocument);
        attr.ownerElement = element;
        element.attributes.push(attr);
        break;
      }
      case ELEMENT_NODE: {
        const child = new Element(jsdon[i++], ownerDocument);
        child.parentNode = element;
        element.childNodes.push(child);
        i = toElement(classes, jsdon, child, i, length);
        break;
      }
      default:
        return i;
    }
  }
};

/**
 * @param {array} jsdon a valid jsdon array
 * @returns {Document|DocumentFragment|Element} an DOM tree
 */
const asTree = (jsdon, classes = {}) => {
  const {length} = jsdon;
  classes = {
    Document: classes.Document || Document,
    DocumentFragment: classes.DocumentFragment || DocumentFragment,
    Element: classes.Element || Element,
    Attr: classes.Attr || Attr,
    Text: classes.Text || Text,
    Comment: classes.Comment || Comment,
    DocumentType: classes.DocumentType || DocumentType
  };
  const document = new classes.Document;
  switch (length && jsdon[0]) {
    case DOCUMENT_NODE:
      return toDocument(classes, jsdon, document, 1, length);
    case DOCUMENT_FRAGMENT_NODE: {
      const fragment = new classes.DocumentFragment(document);
      return toFragment(classes, jsdon, fragment, 1, length);
    }
    case ELEMENT_NODE: {
      const element = new classes.Element(jsdon[1], document);
      toElement(classes, jsdon, element, 2, length);
      return element;
    }
  }
  return null;
};
exports.asTree = asTree;
