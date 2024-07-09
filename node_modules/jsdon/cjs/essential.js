'use strict';
const {toJSON} = require('./to-json.js');

const {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE
} = require('./constants.js');

exports.ELEMENT_NODE = ELEMENT_NODE;
exports.ATTRIBUTE_NODE = ATTRIBUTE_NODE;
exports.TEXT_NODE = TEXT_NODE;
exports.COMMENT_NODE = COMMENT_NODE;
exports.DOCUMENT_NODE = DOCUMENT_NODE;
exports.DOCUMENT_TYPE_NODE = DOCUMENT_TYPE_NODE;
exports.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE;

const cloneChildNodes = (childNodes, target, ownerDocument) => {
  for (let {length} = childNodes, i = 0; i < length; i++) {
    const child = childNodes[i].cloneNode(true);
    child.ownerDocument = ownerDocument;
    child.parentNode = target;
    target.childNodes.push(child);
  }
};

const elements = ({nodeType}) => nodeType === ELEMENT_NODE;

const remove = node => {
  const {parentNode} = node;
  if (parentNode) {
    node.parentNode = null;
    const {childNodes} = parentNode;
    childNodes.splice(childNodes.indexOf(node), 1);
  }
};

class Node {
  static get ELEMENT_NODE() { return ELEMENT_NODE; }
  static get ATTRIBUTE_NODE() { return ATTRIBUTE_NODE; }
  static get TEXT_NODE() { return TEXT_NODE; }
  static get COMMENT_NODE() { return COMMENT_NODE; }
  static get DOCUMENT_NODE() { return DOCUMENT_NODE; }
  static get DOCUMENT_TYPE_NODE() { return DOCUMENT_TYPE_NODE; }
  static get DOCUMENT_FRAGMENT_NODE() { return DOCUMENT_FRAGMENT_NODE; }

  get ELEMENT_NODE() { return ELEMENT_NODE; }
  get ATTRIBUTE_NODE() { return ATTRIBUTE_NODE; }
  get TEXT_NODE() { return TEXT_NODE; }
  get COMMENT_NODE() { return COMMENT_NODE; }
  get DOCUMENT_NODE() { return DOCUMENT_NODE; }
  get DOCUMENT_TYPE_NODE() { return DOCUMENT_TYPE_NODE; }
  get DOCUMENT_FRAGMENT_NODE() { return DOCUMENT_FRAGMENT_NODE; }

  constructor(nodeType, localName, ownerDocument = null) {
    this.nodeType = nodeType;
    this.localName = localName;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
  }

  toJSON() { return toJSON(this); }
}
exports.Node = Node

class Attr extends Node {
  constructor(name, value, ownerDocument) {
    super(ATTRIBUTE_NODE, '#attribute', ownerDocument);
    this.name = name;
    this.value = value;
    this.ownerElement = null;
  }

  cloneNode() {
    const {constructor, name, value, ownerDocument} = this;
    return new constructor(name, value, ownerDocument);
  }
}
exports.Attr = Attr

class DocumentType extends Node {
  constructor(name, ownerDocument) {
    super(DOCUMENT_TYPE_NODE, '#doctype', ownerDocument);
    this.name = name;
  }

  cloneNode() {
    const {constructor, name, ownerDocument} = this;
    return new constructor(name, ownerDocument);
  }
}
exports.DocumentType = DocumentType

class CharacterData extends Node {
  cloneNode() {
    const {constructor, data, ownerDocument} = this;
    return new constructor(data, ownerDocument);
  }

  remove() { remove(this); }
}
exports.CharacterData = CharacterData

class Comment extends CharacterData {
  constructor(data, ownerDocument) {
    super(COMMENT_NODE, '#comment', ownerDocument);
    this.data = data;
  }
}
exports.Comment = Comment

class Text extends CharacterData {
  constructor(data, ownerDocument) {
    super(TEXT_NODE, '#text', ownerDocument);
    this.data = data;
  }
}
exports.Text = Text

class ParentNode extends Node {
  constructor(nodeType, localName, ownerDocument) {
    super(nodeType, localName, ownerDocument);
    this.childNodes = [];
  }

  get children() { return this.childNodes.filter(elements); }
}
exports.ParentNode = ParentNode

class Document extends ParentNode {
  constructor() {
    super(DOCUMENT_NODE, '#document', null);
  }

  cloneNode(deep = false) {
    const {constructor, childNodes} = this;
    const document = new constructor;
    if (deep)
      cloneChildNodes(childNodes, document, document);
    return document;
  }
}
exports.Document = Document

class DocumentFragment extends ParentNode {
  constructor(ownerDocument) {
    super(DOCUMENT_FRAGMENT_NODE, '#document-fragment', ownerDocument);
  }

  cloneNode(deep = false) {
    const {constructor, childNodes, ownerDocument} = this;
    const fragment = new constructor(ownerDocument);
    if (deep)
      cloneChildNodes(childNodes, fragment, ownerDocument);
    return fragment;
  }
}
exports.DocumentFragment = DocumentFragment

class Element extends ParentNode {
  constructor(localName, ownerDocument) {
    super(ELEMENT_NODE, localName, ownerDocument);
    this.attributes = [];
  }

  cloneNode(deep = false) {
    const {constructor, attributes, childNodes, localName, ownerDocument} = this;
    const element = new constructor(localName, ownerDocument);
    for (let {length} = attributes, i = 0; i < length; i++) {
      const attr = attributes[i].cloneNode();
      attr.ownerElement = element;
      element.attributes.push(attr);
    }
    if (deep)
      cloneChildNodes(childNodes, element, ownerDocument);
    return element;
  }

  remove() { remove(this); }
}
exports.Element = Element
