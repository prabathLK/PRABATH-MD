const {hasOwnProperty: hasOwnProp} = Object.prototype;

/**
* @typedef {null|boolean|number|string|PlainObject|GenericArray} JSONObject
*/

/**
 * Copies array and then pushes item into it.
 * @param {GenericArray} arr Array to copy and into which to push
 * @param {any} item Array item to add (to end)
 * @returns {GenericArray} Copy of the original array
 */
function push (arr, item) {
    arr = arr.slice();
    arr.push(item);
    return arr;
}
/**
 * Copies array and then unshifts item into it.
 * @param {any} item Array item to add (to beginning)
 * @param {GenericArray} arr Array to copy and into which to unshift
 * @returns {GenericArray} Copy of the original array
 */
function unshift (item, arr) {
    arr = arr.slice();
    arr.unshift(item);
    return arr;
}

/**
 * Caught when JSONPath is used without `new` but rethrown if with `new`
 * @extends Error
 */
class NewError extends Error {
    /**
     * @param {any} value The evaluated scalar value
     */
    constructor (value) {
        super(
            'JSONPath should not be called with "new" (it prevents return ' +
            'of (unwrapped) scalar values)'
        );
        this.avoidNew = true;
        this.value = value;
        this.name = 'NewError';
    }
}

/**
* @typedef {PlainObject} ReturnObject
* @property {string} path
* @property {JSONObject} value
* @property {PlainObject|GenericArray} parent
* @property {string} parentProperty
*/

/**
* @callback JSONPathCallback
* @param {string|PlainObject} preferredOutput
* @param {"value"|"property"} type
* @param {ReturnObject} fullRetObj
* @returns {void}
*/

/**
* @callback OtherTypeCallback
* @param {JSONObject} val
* @param {string} path
* @param {PlainObject|GenericArray} parent
* @param {string} parentPropName
* @returns {boolean}
*/

/* eslint-disable max-len -- Can make multiline type after https://github.com/syavorsky/comment-parser/issues/109 */
/**
 * @typedef {PlainObject} JSONPathOptions
 * @property {JSON} json
 * @property {string|string[]} path
 * @property {"value"|"path"|"pointer"|"parent"|"parentProperty"|"all"} [resultType="value"]
 * @property {boolean} [flatten=false]
 * @property {boolean} [wrap=true]
 * @property {PlainObject} [sandbox={}]
 * @property {boolean} [preventEval=false]
 * @property {PlainObject|GenericArray|null} [parent=null]
 * @property {string|null} [parentProperty=null]
 * @property {JSONPathCallback} [callback]
 * @property {OtherTypeCallback} [otherTypeCallback] Defaults to
 *   function which throws on encountering `@other`
 * @property {boolean} [autostart=true]
 */
/* eslint-enable max-len -- Can make multiline type after https://github.com/syavorsky/comment-parser/issues/109 */

/**
 * @param {string|JSONPathOptions} opts If a string, will be treated as `expr`
 * @param {string} [expr] JSON path to evaluate
 * @param {JSON} [obj] JSON object to evaluate against
 * @param {JSONPathCallback} [callback] Passed 3 arguments: 1) desired payload
 *     per `resultType`, 2) `"value"|"property"`, 3) Full returned object with
 *     all payloads
 * @param {OtherTypeCallback} [otherTypeCallback] If `@other()` is at the end
 *   of one's query, this will be invoked with the value of the item, its
 *   path, its parent, and its parent's property name, and it should return
 *   a boolean indicating whether the supplied value belongs to the "other"
 *   type or not (or it may handle transformations and return `false`).
 * @returns {JSONPath}
 * @class
 */
function JSONPath (opts, expr, obj, callback, otherTypeCallback) {
    // eslint-disable-next-line no-restricted-syntax
    if (!(this instanceof JSONPath)) {
        try {
            return new JSONPath(opts, expr, obj, callback, otherTypeCallback);
        } catch (e) {
            if (!e.avoidNew) {
                throw e;
            }
            return e.value;
        }
    }

    if (typeof opts === 'string') {
        otherTypeCallback = callback;
        callback = obj;
        obj = expr;
        expr = opts;
        opts = null;
    }
    const optObj = opts && typeof opts === 'object';
    opts = opts || {};
    this.json = opts.json || obj;
    this.path = opts.path || expr;
    this.resultType = opts.resultType || 'value';
    this.flatten = opts.flatten || false;
    this.wrap = hasOwnProp.call(opts, 'wrap') ? opts.wrap : true;
    this.sandbox = opts.sandbox || {};
    this.preventEval = opts.preventEval || false;
    this.parent = opts.parent || null;
    this.parentProperty = opts.parentProperty || null;
    this.callback = opts.callback || callback || null;
    this.otherTypeCallback = opts.otherTypeCallback ||
        otherTypeCallback ||
        function () {
            throw new TypeError(
                'You must supply an otherTypeCallback callback option ' +
                'with the @other() operator.'
            );
        };

    if (opts.autostart !== false) {
        const args = {
            path: (optObj ? opts.path : expr)
        };
        if (!optObj) {
            args.json = obj;
        } else if ('json' in opts) {
            args.json = opts.json;
        }
        const ret = this.evaluate(args);
        if (!ret || typeof ret !== 'object') {
            throw new NewError(ret);
        }
        return ret;
    }
}

// PUBLIC METHODS
JSONPath.prototype.evaluate = function (
    expr, json, callback, otherTypeCallback
) {
    let currParent = this.parent,
        currParentProperty = this.parentProperty;
    let {flatten, wrap} = this;

    this.currResultType = this.resultType;
    this.currPreventEval = this.preventEval;
    this.currSandbox = this.sandbox;
    callback = callback || this.callback;
    this.currOtherTypeCallback = otherTypeCallback || this.otherTypeCallback;

    json = json || this.json;
    expr = expr || this.path;
    if (expr && typeof expr === 'object' && !Array.isArray(expr)) {
        if (!expr.path && expr.path !== '') {
            throw new TypeError(
                'You must supply a "path" property when providing an object ' +
                'argument to JSONPath.evaluate().'
            );
        }
        if (!(hasOwnProp.call(expr, 'json'))) {
            throw new TypeError(
                'You must supply a "json" property when providing an object ' +
                'argument to JSONPath.evaluate().'
            );
        }
        ({json} = expr);
        flatten = hasOwnProp.call(expr, 'flatten') ? expr.flatten : flatten;
        this.currResultType = hasOwnProp.call(expr, 'resultType')
            ? expr.resultType
            : this.currResultType;
        this.currSandbox = hasOwnProp.call(expr, 'sandbox')
            ? expr.sandbox
            : this.currSandbox;
        wrap = hasOwnProp.call(expr, 'wrap') ? expr.wrap : wrap;
        this.currPreventEval = hasOwnProp.call(expr, 'preventEval')
            ? expr.preventEval
            : this.currPreventEval;
        callback = hasOwnProp.call(expr, 'callback') ? expr.callback : callback;
        this.currOtherTypeCallback = hasOwnProp.call(expr, 'otherTypeCallback')
            ? expr.otherTypeCallback
            : this.currOtherTypeCallback;
        currParent = hasOwnProp.call(expr, 'parent') ? expr.parent : currParent;
        currParentProperty = hasOwnProp.call(expr, 'parentProperty')
            ? expr.parentProperty
            : currParentProperty;
        expr = expr.path;
    }
    currParent = currParent || null;
    currParentProperty = currParentProperty || null;

    if (Array.isArray(expr)) {
        expr = JSONPath.toPathString(expr);
    }
    if ((!expr && expr !== '') || !json) {
        return undefined;
    }

    const exprList = JSONPath.toPathArray(expr);
    if (exprList[0] === '$' && exprList.length > 1) { exprList.shift(); }
    this._hasParentSelector = null;
    const result = this
        ._trace(
            exprList, json, ['$'], currParent, currParentProperty, callback
        )
        .filter(function (ea) { return ea && !ea.isParentSelector; });

    if (!result.length) { return wrap ? [] : undefined; }
    if (!wrap && result.length === 1 && !result[0].hasArrExpr) {
        return this._getPreferredOutput(result[0]);
    }
    return result.reduce((rslt, ea) => {
        const valOrPath = this._getPreferredOutput(ea);
        if (flatten && Array.isArray(valOrPath)) {
            rslt = rslt.concat(valOrPath);
        } else {
            rslt.push(valOrPath);
        }
        return rslt;
    }, []);
};

// PRIVATE METHODS

JSONPath.prototype._getPreferredOutput = function (ea) {
    const resultType = this.currResultType;
    switch (resultType) {
    case 'all': {
        const path = Array.isArray(ea.path)
            ? ea.path
            : JSONPath.toPathArray(ea.path);
        ea.pointer = JSONPath.toPointer(path);
        ea.path = typeof ea.path === 'string'
            ? ea.path
            : JSONPath.toPathString(ea.path);
        return ea;
    } case 'value': case 'parent': case 'parentProperty':
        return ea[resultType];
    case 'path':
        return JSONPath.toPathString(ea[resultType]);
    case 'pointer':
        return JSONPath.toPointer(ea.path);
    default:
        throw new TypeError('Unknown result type');
    }
};

JSONPath.prototype._handleCallback = function (fullRetObj, callback, type) {
    if (callback) {
        const preferredOutput = this._getPreferredOutput(fullRetObj);
        fullRetObj.path = typeof fullRetObj.path === 'string'
            ? fullRetObj.path
            : JSONPath.toPathString(fullRetObj.path);
        // eslint-disable-next-line node/callback-return
        callback(preferredOutput, type, fullRetObj);
    }
};

/**
 *
 * @param {string} expr
 * @param {JSONObject} val
 * @param {string} path
 * @param {PlainObject|GenericArray} parent
 * @param {string} parentPropName
 * @param {JSONPathCallback} callback
 * @param {boolean} hasArrExpr
 * @param {boolean} literalPriority
 * @returns {ReturnObject|ReturnObject[]}
 */
JSONPath.prototype._trace = function (
    expr, val, path, parent, parentPropName, callback, hasArrExpr,
    literalPriority
) {
    // No expr to follow? return path and value as the result of
    //  this trace branch
    let retObj;
    if (!expr.length) {
        retObj = {
            path,
            value: val,
            parent,
            parentProperty: parentPropName,
            hasArrExpr
        };
        this._handleCallback(retObj, callback, 'value');
        return retObj;
    }

    const loc = expr[0], x = expr.slice(1);

    // We need to gather the return value of recursive trace calls in order to
    // do the parent sel computation.
    const ret = [];
    /**
     *
     * @param {ReturnObject|ReturnObject[]} elems
     * @returns {void}
     */
    function addRet (elems) {
        if (Array.isArray(elems)) {
            // This was causing excessive stack size in Node (with or
            //  without Babel) against our performance test:
            //  `ret.push(...elems);`
            elems.forEach((t) => {
                ret.push(t);
            });
        } else {
            ret.push(elems);
        }
    }
    if ((typeof loc !== 'string' || literalPriority) && val &&
        hasOwnProp.call(val, loc)
    ) { // simple case--directly follow property
        addRet(this._trace(x, val[loc], push(path, loc), val, loc, callback,
            hasArrExpr));
    } else if (loc === '*') { // all child properties
        this._walk(
            loc, x, val, path, parent, parentPropName, callback,
            (m, l, _x, v, p, par, pr, cb) => {
                addRet(this._trace(unshift(m, _x), v, p, par, pr, cb,
                    true, true));
            }
        );
    } else if (loc === '..') { // all descendent parent properties
        // Check remaining expression with val's immediate children
        addRet(
            this._trace(x, val, path, parent, parentPropName, callback,
                hasArrExpr)
        );
        this._walk(
            loc, x, val, path, parent, parentPropName, callback,
            (m, l, _x, v, p, par, pr, cb) => {
                // We don't join m and x here because we only want parents,
                //   not scalar values
                if (typeof v[m] === 'object') {
                    // Keep going with recursive descent on val's
                    //   object children
                    addRet(this._trace(
                        unshift(l, _x), v[m], push(p, m), v, m, cb, true
                    ));
                }
            }
        );
    // The parent sel computation is handled in the frame above using the
    // ancestor object of val
    } else if (loc === '^') {
        // This is not a final endpoint, so we do not invoke the callback here
        this._hasParentSelector = true;
        return {
            path: path.slice(0, -1),
            expr: x,
            isParentSelector: true
        };
    } else if (loc === '~') { // property name
        retObj = {
            path: push(path, loc),
            value: parentPropName,
            parent,
            parentProperty: null
        };
        this._handleCallback(retObj, callback, 'property');
        return retObj;
    } else if (loc === '$') { // root only
        addRet(this._trace(x, val, path, null, null, callback, hasArrExpr));
    } else if ((/^(-?\d*):(-?\d*):?(\d*)$/u).test(loc)) { // [start:end:step]  Python slice syntax
        addRet(
            this._slice(loc, x, val, path, parent, parentPropName, callback)
        );
    } else if (loc.indexOf('?(') === 0) { // [?(expr)] (filtering)
        if (this.currPreventEval) {
            throw new Error('Eval [?(expr)] prevented in JSONPath expression.');
        }
        this._walk(
            loc, x, val, path, parent, parentPropName, callback,
            (m, l, _x, v, p, par, pr, cb) => {
                if (this._eval(l.replace(/^\?\((.*?)\)$/u, '$1'), v[m], m, p, par, pr)) {
                    addRet(this._trace(unshift(m, _x), v, p, par, pr, cb,
                        true));
                }
            }
        );
    } else if (loc[0] === '(') { // [(expr)] (dynamic property/index)
        if (this.currPreventEval) {
            throw new Error('Eval [(expr)] prevented in JSONPath expression.');
        }
        // As this will resolve to a property name (but we don't know it
        //  yet), property and parent information is relative to the
        //  parent of the property to which this expression will resolve
        addRet(this._trace(unshift(
            this._eval(
                loc, val, path[path.length - 1],
                path.slice(0, -1), parent, parentPropName
            ),
            x
        ), val, path, parent, parentPropName, callback, hasArrExpr));
    } else if (loc[0] === '@') { // value type: @boolean(), etc.
        let addType = false;
        const valueType = loc.slice(1, -2);
        switch (valueType) {
        case 'scalar':
            if (!val || !(['object', 'function'].includes(typeof val))) {
                addType = true;
            }
            break;
        case 'boolean': case 'string': case 'undefined': case 'function':
            // eslint-disable-next-line valid-typeof
            if (typeof val === valueType) {
                addType = true;
            }
            break;
        case 'integer':
            if (Number.isFinite(val) && !(val % 1)) {
                addType = true;
            }
            break;
        case 'number':
            if (Number.isFinite(val)) {
                addType = true;
            }
            break;
        case 'nonFinite':
            if (typeof val === 'number' && !Number.isFinite(val)) {
                addType = true;
            }
            break;
        case 'object':
            // eslint-disable-next-line valid-typeof
            if (val && typeof val === valueType) {
                addType = true;
            }
            break;
        case 'array':
            if (Array.isArray(val)) {
                addType = true;
            }
            break;
        case 'other':
            addType = this.currOtherTypeCallback(
                val, path, parent, parentPropName
            );
            break;
        case 'null':
            if (val === null) {
                addType = true;
            }
            break;
        /* istanbul ignore next */
        default:
            throw new TypeError('Unknown value type ' + valueType);
        }
        if (addType) {
            retObj = {path, value: val, parent, parentProperty: parentPropName};
            this._handleCallback(retObj, callback, 'value');
            return retObj;
        }
    // `-escaped property
    } else if (loc[0] === '`' && val && hasOwnProp.call(val, loc.slice(1))) {
        const locProp = loc.slice(1);
        addRet(this._trace(
            x, val[locProp], push(path, locProp), val, locProp, callback,
            hasArrExpr, true
        ));
    } else if (loc.includes(',')) { // [name1,name2,...]
        const parts = loc.split(',');
        for (const part of parts) {
            addRet(this._trace(
                unshift(part, x), val, path, parent, parentPropName, callback,
                true
            ));
        }
    // simple case--directly follow property
    } else if (
        !literalPriority && val && hasOwnProp.call(val, loc)
    ) {
        addRet(
            this._trace(x, val[loc], push(path, loc), val, loc, callback,
                hasArrExpr, true)
        );
    }

    // We check the resulting values for parent selections. For parent
    // selections we discard the value object and continue the trace with the
    // current val object
    if (this._hasParentSelector) {
        for (let t = 0; t < ret.length; t++) {
            const rett = ret[t];
            if (rett && rett.isParentSelector) {
                const tmp = this._trace(
                    rett.expr, val, rett.path, parent, parentPropName, callback,
                    hasArrExpr
                );
                if (Array.isArray(tmp)) {
                    ret[t] = tmp[0];
                    const tl = tmp.length;
                    for (let tt = 1; tt < tl; tt++) {
                        t++;
                        ret.splice(t, 0, tmp[tt]);
                    }
                } else {
                    ret[t] = tmp;
                }
            }
        }
    }
    return ret;
};

JSONPath.prototype._walk = function (
    loc, expr, val, path, parent, parentPropName, callback, f
) {
    if (Array.isArray(val)) {
        const n = val.length;
        for (let i = 0; i < n; i++) {
            f(i, loc, expr, val, path, parent, parentPropName, callback);
        }
    } else if (val && typeof val === 'object') {
        Object.keys(val).forEach((m) => {
            f(m, loc, expr, val, path, parent, parentPropName, callback);
        });
    }
};

JSONPath.prototype._slice = function (
    loc, expr, val, path, parent, parentPropName, callback
) {
    if (!Array.isArray(val)) { return undefined; }
    const len = val.length, parts = loc.split(':'),
        step = (parts[2] && Number.parseInt(parts[2])) || 1;
    let start = (parts[0] && Number.parseInt(parts[0])) || 0,
        end = (parts[1] && Number.parseInt(parts[1])) || len;
    start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
    end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
    const ret = [];
    for (let i = start; i < end; i += step) {
        const tmp = this._trace(
            unshift(i, expr), val, path, parent, parentPropName, callback, true
        );
        // Should only be possible to be an array here since first part of
        //   ``unshift(i, expr)` passed in above would not be empty, nor `~`,
        //     nor begin with `@` (as could return objects)
        // This was causing excessive stack size in Node (with or
        //  without Babel) against our performance test: `ret.push(...tmp);`
        tmp.forEach((t) => {
            ret.push(t);
        });
    }
    return ret;
};

JSONPath.prototype._eval = function (
    code, _v, _vname, path, parent, parentPropName
) {
    if (code.includes('@parentProperty')) {
        this.currSandbox._$_parentProperty = parentPropName;
        code = code.replace(/@parentProperty/gu, '_$_parentProperty');
    }
    if (code.includes('@parent')) {
        this.currSandbox._$_parent = parent;
        code = code.replace(/@parent/gu, '_$_parent');
    }
    if (code.includes('@property')) {
        this.currSandbox._$_property = _vname;
        code = code.replace(/@property/gu, '_$_property');
    }
    if (code.includes('@path')) {
        this.currSandbox._$_path = JSONPath.toPathString(path.concat([_vname]));
        code = code.replace(/@path/gu, '_$_path');
    }
    if (code.includes('@root')) {
        this.currSandbox._$_root = this.json;
        code = code.replace(/@root/gu, '_$_root');
    }
    if ((/@([.\s)[])/u).test(code)) {
        this.currSandbox._$_v = _v;
        code = code.replace(/@([.\s)[])/gu, '_$_v$1');
    }
    try {
        return this.vm.runInNewContext(code, this.currSandbox);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        throw new Error('jsonPath: ' + e.message + ': ' + code);
    }
};

// PUBLIC CLASS PROPERTIES AND METHODS

// Could store the cache object itself
JSONPath.cache = {};

/**
 * @param {string[]} pathArr Array to convert
 * @returns {string} The path string
 */
JSONPath.toPathString = function (pathArr) {
    const x = pathArr, n = x.length;
    let p = '$';
    for (let i = 1; i < n; i++) {
        if (!(/^(~|\^|@.*?\(\))$/u).test(x[i])) {
            p += (/^[0-9*]+$/u).test(x[i]) ? ('[' + x[i] + ']') : ("['" + x[i] + "']");
        }
    }
    return p;
};

/**
 * @param {string} pointer JSON Path
 * @returns {string} JSON Pointer
 */
JSONPath.toPointer = function (pointer) {
    const x = pointer, n = x.length;
    let p = '';
    for (let i = 1; i < n; i++) {
        if (!(/^(~|\^|@.*?\(\))$/u).test(x[i])) {
            p += '/' + x[i].toString()
                .replace(/~/gu, '~0')
                .replace(/\//gu, '~1');
        }
    }
    return p;
};

/**
 * @param {string} expr Expression to convert
 * @returns {string[]}
 */
JSONPath.toPathArray = function (expr) {
    const {cache} = JSONPath;
    if (cache[expr]) { return cache[expr].concat(); }
    const subx = [];
    const normalized = expr
        // Properties
        .replace(
            /@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/gu,
            ';$&;'
        )
        // Parenthetical evaluations (filtering and otherwise), directly
        //   within brackets or single quotes
        .replace(/[['](\??\(.*?\))[\]']/gu, function ($0, $1) {
            return '[#' + (subx.push($1) - 1) + ']';
        })
        // Escape periods and tildes within properties
        .replace(/\['([^'\]]*)'\]/gu, function ($0, prop) {
            return "['" + prop
                .replace(/\./gu, '%@%')
                .replace(/~/gu, '%%@@%%') +
                "']";
        })
        // Properties operator
        .replace(/~/gu, ';~;')
        // Split by property boundaries
        .replace(/'?\.'?(?![^[]*\])|\['?/gu, ';')
        // Reinsert periods within properties
        .replace(/%@%/gu, '.')
        // Reinsert tildes within properties
        .replace(/%%@@%%/gu, '~')
        // Parent
        .replace(/(?:;)?(\^+)(?:;)?/gu, function ($0, ups) {
            return ';' + ups.split('').join(';') + ';';
        })
        // Descendents
        .replace(/;;;|;;/gu, ';..;')
        // Remove trailing
        .replace(/;$|'?\]|'$/gu, '');

    const exprList = normalized.split(';').map(function (exp) {
        const match = exp.match(/#(\d+)/u);
        return !match || !match[1] ? exp : subx[match[1]];
    });
    cache[expr] = exprList;
    return cache[expr].concat();
};

export {JSONPath};
