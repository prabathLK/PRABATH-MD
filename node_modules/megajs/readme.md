# MEGAJS

Unofficial JavaScript SDK for MEGA

**API documentation and examples are available in the website: [https://mega.js.org/](https://mega.js.org/)**

**For CLI usage check MEGAJS CLI**: https://github.com/qgustavor/megajs-cli

* This is based on [tonistiigi's mega library](https://github.com/tonistiigi/mega).
* This is all unofficial, based on [developer guide](https://mega.nz/#developers) and site source.
* Make sure you agree with MEGA's [Terms of Service](https://mega.nz/#terms) before using it.

## Contributing

When contributing fork the project:

- Clone it;
- Run `npm install`;
- Change the library as you want;
- Build the bundled versions using `npm run build`;
- Run at least Node tests using `npm test node` to test Node;
- Optionally run `npm test deno` to test Deno if you have it installed (CI will test Deno anyway).

Before creating a pull request, *please*, run tests. If you implement new features them implement tests for it too if possible. The hash at the end of test/helpers/test-runner.mjs may be updated if tests are updated in a way it change server state (like adding new files to tests).

## Project history

This package started as a fork, with the following objectives:

* Make the original package work in browsers again: even following [the instructions from the original library](https://github.com/tonistiigi/mega#browser-support) it stopped working because some dependencies used `__proto__`, which is non-standard and isn't supported in many browsers. Also the updated versions of those libraries broke backyards compatibility;
* Reduce dependencies and replace big dependencies with smaller ones, like crypto libraries, which usually are huge;
* Rewrite code using the new JavaScript syntax, allowing to use [Rollup](http://rollupjs.org/), which can generate smaller bundles;
* Make tests work again after the changes above;
* Continue the original library development implementing new features and improving performance.

Request package was replaced with a shim based in [browser-request](https://www.npmjs.com/package/browser-request) and [xhr-stream](https://www.npmjs.com/package/xhr-stream), which additional changes in order to make it work inside Service Workers. Crypto was replaced with [secure-random](https://www.npmjs.com/package/secure-random).

As there were many changes there isn't any plan to merge those changes into the original library, unless the original author accept those massive changes. That's why I put "js" in the name, which is silly because both libraries use JavaScript. At least it's better than other ideas I had, like "mega2", "mega-es" and "modern-mega".

In 1.0 release request was replaced with fetch, Deno support was added (including tests), TypeScript types were added, Rollup was replaced with esbuild, streaming libraries were updated or replaced and some issues were fixed.
