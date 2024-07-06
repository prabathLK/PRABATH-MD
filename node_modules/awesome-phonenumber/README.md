[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![minzipped size][bundlephobia-image]][bundlephobia-url]
[![Dependency count][depcount-image]][npm-url]


# Awesome phonenumber parser

This library is a pre-compiled version of Google's `libphonenumber`, with a slightly simpler interface. It has a minimal footprint - is by far the smallest libphonenumber-based library available on npmjs, and has no dependencies.

TypeScript typings are provided within the package.

Uses libphonenumber v8.13.24


### Versions

 - v3:
   - Changed API (although with backwards compatible ABI)
   - Added ESM export
 - v4:
   - Changed API to be much cleaner
     - No constructor
     - No functions on returned object
     - No errors being thrown
   - Not backwards compatible, although like v3 except:
     - The second argument to `parsePhoneNumber` is an object
       - E.g. `{ regionCode: 'SE' }` instead of a region code string
     - The return value is like `toJSON( )` on v3
 - v5:
   - Dropped Node 12 support
 - v6:
   - Dropped Node 16 support


## Comparison with other libraries

Since this library is pre-compiled, it doesn't depend on the closure compiler, and needs not load it on start. This makes the library faster and saves you a lot of space. It also means this library is trivial to use in any `webpack` project (or using any other means to run in the browser).

Among all the popular phone number using Google's `libphonenumber` (or mimicing it), only this one, `google-libphonenumber` and `libphonenumber-js` have decent README's with examples. *This may have changed since first doing these benchmarks*.

A library should be quick to load (`require()`), quick to parse first time and all consecutive times. It shouldn't bloat your `node_modules`, and it should have a small memory footprint, if possible.

The following is the result of a test program which loads the library, then parses a phone number, and then once again. It's called 100 times for each library and the mean values are shown here. Parsing a phone number first time might be slower because of initially compiling/optimizing regular expressions and whatnot. Parsing a phone number a second time will show the speed of likely all future parsing within that process.

Action                    | awesome-phonenumber<br/>2.56.0<br/>(lib 8.12.29) | google-libphonenumber<br/>3.2.22<br/>(lib 8.12.27) | libphonenumber-js<br/>1.9.23<br/>(lib -)
------------------------- | ------------------- | --------------------- | ----------------
Load library first time         | 11.0 ms ✅          | 29.67 ms              | 32.87 ms
Parse first phone number        | 4.3 ms              | 4.01 ms               | 3.43 ms ✅
**⇒ Load + parse first number** | 15.3 ms ✅          | 33.68 ms              | 36.3 ms
Parse second phone number       | 0.78 ms ✅          | 0.97 ms               | 0.92 ms
Increased memory usage          | 5.12 M ✅           | 9.99 M                | 5.86 M
node_modules size               | 296 K ✅            | 600 K                 | 7.6 M
node_modules files              | 8                   | 7 ✅                  | 653


## Basic usage
```ts
import { parsePhoneNumber } from 'awesome-phonenumber'

const pn = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
// or on e164 format:
const pn = parsePhoneNumber( '+46707123456' );

// pn is now the same as:
const pn = {
	valid: true,

	number: {
		input: '0707123456',
		e164: '+46707123456',
		international: '+46 70 712 34 56',
		national: '070-712 34 56',
		rfc3966: 'tel:+46-70-712-34-56',
		significant: '707123456',
	},
	possibility: 'is-possible',
	regionCode: 'SE',
	possible: true,
	canBeInternationallyDialled: true,
	type: 'mobile',
	countryCode: 46,
	typeIsMobile: true,
	typeIsFixedLine: false,
};
```

The return type is `ParsedPhoneNumber` which is either a `ParsedPhoneNumberValid` or a `ParsedPhoneNumberInvalid`. The `valid` property identifies whether the parsing was successful or not, hence which type is returned.

The format of a successful parsing is:

```ts
interface ParsedPhoneNumberValid {
	valid: true;

	number: {
		input: string;
		international: string;
		national: string;
		e164: string;
		rfc3966: string;
		significant: string;
	};
	possibility: PhoneNumberPossibility; // a string union, see below
	regionCode: string;
	possible: boolean;
	canBeInternationallyDialled: boolean;
	type: PhoneNumberTypes; // a string union, see below
	countryCode: number;
	typeIsMobile: boolean;
	typeIsFixedLine: boolean;
}
```

If the number failed to be parsed, or there was another error, the return type is:

```ts
interface ParsedPhoneNumberInvalid {
	valid: false;

	possible: false;
	possibility: 'invalid';
	error?: unknown;
};
```


## API

```ts
import {
	parsePhoneNumber,
	getNumberFrom,
	getExample,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
	getAsYouType,
} from 'awesome-phonenumber'
```


### parsePhoneNumber

`parsePhoneNumber( phoneNumber, { regionCode: string } )` parses a phone number as described above.

The first argument is the phone number to parse, on either _national_ or _international_ (e164, i.e. prefixed with a `+`) form. If _national_ form, the second argument is required to contain a `regionCode` string property, e.g. 'SE' for Sweden, 'CH' for Switzerland, etc.


### getNumberFrom

```ts
import { parsePhoneNumber, getNumberFrom } from 'awesome-phonenumber'

const pn = parsePhoneNumber( '0707654321', { regionCode: 'SE' } );
if ( pn.valid ) {
	const fromJp = getNumberFrom( pn, 'JP' );
	// fromJp is the number to call from Japan:
	fromJp.number === "010 46 70 765 43 21";
}
```

The return value from `getNumberFrom` is a `PhoneNumberFrom` which is either a `PhoneNumberFromValid` or a `PhoneNumberFromInvalid`.

The `PhoneNumberFromValid` is defined as:

```ts
interface PhoneNumberFromValid
{
	valid: true;
	number: string;
}
```

The `PhoneNumberFromInvalid` is defined as:

```ts
interface PhoneNumberFromInvalid
{
	valid: false;
	error?: unknown;
}
```


## <a name="example"></a>getExample

Sometimes you want to display a formatted example phone number for a certain country (and maybe also a certain type of phone number). The `getExample` function is used for this.

```ts
import { getExample } from 'awesome-phonenumber'

getExample( regionCode[, phoneNumberType] ); // Parsed phone number
```

The `phoneNumberType` is any of the [types defined above](#phone-number-types).

### Example

```ts
import { getExample } from 'awesome-phonenumber'

// Get an example Swedish phone number
const example = getExample( 'SE' ); // A ParsedPhoneNumberValid
const exampleMobile = getExample( 'SE', 'mobile' ); // A ParsedPhoneNumberValid

example.number.e164;           // e.g. '+468123456'
exampleMobile.number.e164;     // e.g. '+46701234567'
exampleMobile.number.national; // e.g. '070 123 45 67'
```


## Country codes

There are conversion functions between the 2-character ISO 3166-1 region codes (e.g. 'SE' for Sweden) and the corresponding country calling codes.

```ts
import {
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
} from 'awesome-phonenumber'

getCountryCodeForRegionCode( regionCode );  // -> countryCode
getRegionCodeForCountryCode( countryCode ); // -> regionCode
```

### Example

```ts
getCountryCodeForRegionCode( 'SE' ); // -> 46
getRegionCodeForCountryCode( 46 );   // -> 'SE'
```

### Supported calling codes

```ts
getSupportedCallingCodes( ); // -> [ calling codes... ]
```

### Supported region codes

```ts
getSupportedRegionCodes( ); // -> [ region codes... ]
```


## API types

The API consists of the `PhoneNumber` class which sometimes uses *enums*. These are:

### <a name="phone-number-types"></a>Phone number types
```ts
type PhoneNumberTypes =
	| 'fixed-line'
	| 'fixed-line-or-mobile'
	| 'mobile'
	| 'pager'
	| 'personal-number'
	| 'premium-rate'
	| 'shared-cost'
	| 'toll-free'
	| 'uan'
	| 'voip'
	| 'unknown'
```

### Phone number possibilities

```ts
type PhoneNumberPossibility =
	| 'is-possible'
	| 'invalid-country-code'
	| 'too-long'
	| 'too-short'
	| 'unknown'
```

### Phone number formats

```ts
'international'
'national'
'e164'
'rfc3966'
'significant'
```




## As-you-type formatting

You can create an `AsYouType` class with `getAsYouType()` to format a phone number as it is being typed.

```ts
import { getAsYouType } from 'awesome-phonenumber'

const ayt = getAsYouType( 'SE' );
```

The returned class instance has the following methods

```ts
// Add a character to the end of the number
ayt.addChar( nextChar: string );

// Get the current formatted number
ayt.number( );

// Remove the last character
ayt.removeChar( );

// Replace the whole number with a new number (or an empty number if undefined)
ayt.reset( number?: string );

// Get a ParsedPhoneNumber object representing the current number
ayt.getPhoneNumber( );
```

All the functions above except `getPhoneNumber( )` return the current formatted number as a string.

#### Example

```ts
import { getAsYouType } from 'awesome-phonenumber'

const ayt = getAsYouType( 'SE' );
ayt.addChar( '0' ); // -> '0'
ayt.addChar( '7' ); // -> '07'
ayt.addChar( '0' ); // -> '070'
ayt.addChar( '7' ); // -> '070 7'
ayt.addChar( '1' ); // -> '070 71'
ayt.addChar( '2' ); // -> '070 712'
ayt.addChar( '3' ); // -> '070 712 3'
ayt.addChar( '4' ); // -> '070 712 34'
ayt.addChar( '5' ); // -> '070 712 34 5'
ayt.addChar( '6' ); // -> '070 712 34 56'
ayt.removeChar( );  // -> '070 712 34 5'
ayt.addChar( '7' ); // -> '070 712 34 57'
```

[npm-image]: https://img.shields.io/npm/v/awesome-phonenumber.svg
[npm-url]: https://npmjs.org/package/awesome-phonenumber
[downloads-image]: https://img.shields.io/npm/dm/awesome-phonenumber.svg
[build-image]: https://img.shields.io/github/actions/workflow/status/grantila/awesome-phonenumber/master.yml?branch=master
[build-url]: https://github.com/grantila/awesome-phonenumber/actions?query=workflow%3AMaster
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/awesome-phonenumber
[bundlephobia-url]: https://bundlephobia.com/package/awesome-phonenumber
[depcount-image]: https://badgen.net/bundlephobia/dependency-count/awesome-phonenumber
