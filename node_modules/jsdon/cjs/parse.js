'use strict';
const HTMLParser2 = require('htmlparser2');
const {Parser} = HTMLParser2;

const CSSselect = require('css-select');
const isTag = ({nodeType}) => nodeType === ELEMENT_NODE;
const existsOne = (test, elements) => elements.some(
  element => isTag(element) && (
    test(element) ||
    existsOne(test, getChildren(element))
  )
);
const getChildren = ({childNodes}) => childNodes;
const getText = node => {
  if (isArray(node))
    return node.map(getText).join('');
  if (isTag(node))
    return getText(getChildren(node));
  if (node.nodeType === TEXT_NODE)
    return node.data;
  return '';
};
const findAll = (test, nodes) => {
  const matches = [];
  for (const node of nodes) {
    if (isTag(node)) {
      if (test(node))
        matches.push(node);
      matches.push(...findAll(test, getChildren(node)));
    }
  }
  return matches;
};
const findOne = (test, nodes) => {
  for (let node of nodes)
    if (test(node) || (node = findOne(test, getChildren(node))))
      return node;
  return null;
};
const adapter = {
  isTag,
  existsOne,
  getChildren,
  getText,
  findAll,
  findOne,
  getAttributeValue: (element, name) => {
    const attribute = element.attributes.find(({name: n}) => n === name);
    return attribute ? attribute.name : null;
  },
  getName: ({localName}) => localName.toLowerCase(),
  getParent: ({parentNode}) => parentNode,
  getSiblings: ({parentNode}) => getChildren(parentNode),
  hasAttrib: ({attributes}, name) => attributes.some(({name: n}) => n === name),
  removeSubsets: nodes => {
    let {length} = nodes;
    while (length--) {
      const node = nodes[length];
      if (length && -1 < nodes.lastIndexOf(node, length - 1)) {
        nodes.splice(length, 1);
        continue;
      }
      for (let {parentNode} = node; parentNode; parentNode = parentNode.parentNode) {
        if (nodes.includes(parentNode)) {
          nodes.splice(length, 1);
          break;
        }
      }
    }
    return nodes;
  }
};
const prepareMatch = selectors => {
  return CSSselect.compile(selectors, {
    strict: true,
    adapter
  });
};

const {
  ELEMENT_NODE,
  TEXT_NODE,
  Document,
  Element,
  Attr,
  Text,
  Comment,
  DocumentType
} = require('./as-tree.js');

const {keys} = Object;

const matchOne = ({childNodes}, matches) => {
  for (const child of childNodes) {
    if (child.nodeType === ELEMENT_NODE) {
      if (matches(child))
        return child;
      const node = matchOne(child, matches);
      if (node)
        return selectors;
    }
  }
  return null;
};

const matchAll = ({childNodes}, matches) => {
  const elements = [];
  for (const child of childNodes) {
    if (child.nodeType === ELEMENT_NODE) {
      if (matches(child))
        elements.push(child);
      elements.push(...matchAll(child, matches));
    }
  }
  return elements;
};

(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('./essential.js'));

const querySelector = (node, selectors) => matchOne(node, prepareMatch(selectors));
exports.querySelector = querySelector;
const querySelectorAll = (node, selectors) => matchAll(node, prepareMatch(selectors));
exports.querySelectorAll = querySelectorAll;

const parse = (markupLanguage, classes = {}) => {

  classes = {
    Document: classes.Document || Document,
    Element: classes.Element || Element,
    Attr: classes.Attr || Attr,
    Text: classes.Text || Text,
    Comment: classes.Comment || Comment,
    DocumentType: classes.DocumentType || DocumentType
  };

  const document = new classes.Document;
  let parentNode = document;

  const content = new Parser({
    // <!DOCTYPE ...>
    onprocessinginstruction(name, data) {
      if (name.toLowerCase() === '!doctype')
        parentNode.childNodes.push(new classes.DocumentType(
          data.slice(name.length).trim()),
          document
        );
    },

    // <tagName>
    onopentag(name, attributes) {
      const element = new classes.Element(name, document);
      for (const name of keys(attributes)) {
        const attribute = new classes.Attr(name, attributes[name], document);
        attribute.ownerElement = element;
        element.attributes.push(attribute);
      }
      element.parentNode = parentNode;
      parentNode.childNodes.push(element);
      parentNode = element;
    },

    // #text, #comment
    oncomment(data) {
      const comment = new classes.Comment(data, document);
      comment.parentNode = parentNode;
      parentNode.childNodes.push(comment);
    },

    ontext(data) {
      const text = new classes.Text(data, document);
      text.parentNode = parentNode;
      parentNode.childNodes.push(text);
    },

    // </tagName>
    onclosetag() {
      parentNode = parentNode.parentNode;
    }
  }, {
    decodeEntities: true
  });

  content.write(markupLanguage);
  content.end();

  return document;
};
exports.parse = parse;
