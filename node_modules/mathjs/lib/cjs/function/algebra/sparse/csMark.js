"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csMark = csMark;
var _csFlip = require("./csFlip.js");
// Copyright (c) 2006-2024, Timothy A. Davis, All Rights Reserved.
// SPDX-License-Identifier: LGPL-2.1+
// https://github.com/DrTimothyAldenDavis/SuiteSparse/tree/dev/CSparse/Source

/**
 * Marks the node at w[j]
 *
 * @param {Array}   w               The array
 * @param {Number}  j               The array index
 */
function csMark(w, j) {
  // mark w[j]
  w[j] = (0, _csFlip.csFlip)(w[j]);
}