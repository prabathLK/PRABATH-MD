# JSDON

[![Build Status](https://travis-ci.com/WebReflection/jsdon.svg?branch=main)](https://travis-ci.com/WebReflection/jsdon) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/jsdon/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/jsdon?branch=main)

<sup>**Social Media Photo by [Reign Abarintos](https://unsplash.com/@jareeign) on [Unsplash](https://unsplash.com/)**</sup>

A DOM de/serializer based on [LinkeDOM](https://github.com/WebReflection/linkedom#readme) idea and the *JSDON* specification <sup><sub>(which is something I've just made up)</sub></sup>.

## Why

I like the idea we can represent the *DOM* linearly, and we can travel via `postMessage` or any other capable *JSON* PL anything we like, simplifying diffing, when needed, updates, changes, and so on.

This module just provides the basics to transform back and forward any document as JSON, enabling new ways to deal with Web pages, SVG images, or XML documents.

## JavaScript DOM Object Notation

This notation considers two kinds of representations, plus one:

  * a **leaf** is a *node* that cannot contain anything else
  * a **branch** is a *node* that can contain either branches or leafs
  * a **tree** is a *branch* extension that represents a whole *document*

### Leaf

A leaf is represented by its type, and at least one, or more, *string* values, representing data the leaf carries with it.

```js
// attribute node
[2,"name"]
[2,"name","value"]

// text node
[3,"content"]

// comment node
[8,"content"]

// document type node (either html or svg)
[10,"html"]
```

### Branch

A branch is represented by its type, followed by zero, one, or more leafs, or branches. A branch has a delimiter too, but multiple delimiters get merged as summary of their value.

```js
// element
// <div></div>
[1,"div",-1]

// element with attributes
// <div id="unique" contenteditable>!</div>
[1,"div",2,"id","unique",2,"contenteditable",3,"!",-1]

// element with a branch
// <div><p></p></div>
[1,"div",1,"p",-2]

// element with mixed content
// <div>before<p>between</p>after</div>
[1,"div",3,"before",1,"p",3,"between",-1,3,"after",-1]

// fragment
[11,3,"text",-1]
```

### Tree

A tree is just a branch, but it starts with a document type, and it returns a new document.

```js
// most basic document with no doctype
[9,-1]

// most basic html with a <!doctype html>
[9,10,"html",-1]

// most basic html with a doctype and an html node
// <!doctype html><html lang="en"></html>
[9,10,"html",1,"html",2,"lang","en",-2]
```

## How To
```js
import {fromJSON, toJSON} from 'jsdon';

// create a single array with nodes details
const array = toJSON(document);

// restore either JSON string form array or array itself
const doc = fromJSON(array);
```

This module makes it possible to shrink *HTML* into a linear, stream-able, representation of the tree, linearized via *linkedom* logic, to transport any kind of layout without extra bloat, also preserving *Custom Elements builtin extends*.

## API

### toJSON(node[, filter])

By default, it puts in the output every node as is, but if there is a *filter* callback, each node passes through such callback and, if it returns `false`, such node won't be added to the final output.

A common use case could be avoiding empty text nodes:
```js
toJSON(document, node => {
  if (
    node.nodeType === node.TEXT_NODE &&
    node.textContent.trim().length === 0
  ) {
    // drop all unnecessary empty text nodes
    return false;
  }
  // accepts all others
  return true;
});
```

### fromJSON(value[, document])

The `value` can be either a string, that will be parsed via `JSON.parse`, or an array representing serialized markup.

The extra, optional, `document` parameter, is to let environments not running within a browser provide their own `document`, assuming this also has a `defaultView` property that exposes a `DOMParser` global, so that it's possible to create new *HTML*, *SVG*, or even *XML*, documents with it.

### Serialized Nodes

  * ELEMENT_NODE
  * ATTRIBUTE_NODE
  * TEXT_NODE
  * COMMENT_NODE
  * DOCUMENT_NODE
  * DOCUMENT_TYPE_NODE
  * DOCUMENT_FRAGMENT_NODE
