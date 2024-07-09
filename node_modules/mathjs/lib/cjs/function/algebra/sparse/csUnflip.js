"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csUnflip = csUnflip;
var _csFlip = require("./csFlip.js");
// Copyright (c) 2006-2024, Timothy A. Davis, All Rights Reserved.
// SPDX-License-Identifier: LGPL-2.1+
// https://github.com/DrTimothyAldenDavis/SuiteSparse/tree/dev/CSparse/Source

/**
 * Flips the value if it is negative of returns the same value otherwise.
 *
 * @param {Number}  i               The value to flip
 */
function csUnflip(i) {
  // flip the value if it is negative
  return i < 0 ? (0, _csFlip.csFlip)(i) : i;
}