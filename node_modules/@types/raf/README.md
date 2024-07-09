# Installation
> `npm install --save @types/raf`

# Summary
This package contains type definitions for raf (https://github.com/chrisdickinson/raf#readme).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/raf.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/raf/index.d.ts)
````ts
declare const raf: {
    (callback: (timestamp: number) => void): number;
    cancel: (handle: number) => void;
    polyfill: (globalObject?: any) => void;
};

export = raf;

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 09:09:39 GMT
 * Dependencies: none

# Credits
These definitions were written by [Ben Lorantfy](https://github.com/BenLorantfy).
