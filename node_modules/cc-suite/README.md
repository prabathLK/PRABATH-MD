<div align="center">
	<h1>CC Suite</h1> 
	<br>
	<p>CC Suite is a powerful all-in-one solution for managing credit card operations. From validating card details to generating random cards and checking BIN information, CC Suite offers a comprehensive toolkit for secure and efficient credit card management. Whether you're a developer, business, or individual looking to ensure the accuracy and security of credit card transactions, CC Suite provides the essential tools you need in a single, user-friendly package.</p>
	<a href="https://github.com/jaynath-d/cc-suite/actions"><img src="https://github.com/jaynath-d/cc-suite/workflows/ci/badge.svg?branch=main" alt="Build status"></a>
<!-- 	<a href="./coverage/lcov-report/index.html"><img src="https://img.shields.io/coveralls/github/jaynath-d/cc-suite" alt="Coverage status"></a> -->
	<a href="https://packagephobia.now.sh/result?p=cc-suite"><img src="https://badgen.net/packagephobia/install/cc-suite" alt="Current version"></a>
	<a href="https://www.npmjs.com/package/cc-suite"><img src="https://img.shields.io/npm/dw/cc-suite" alt="Downloads"></a>
	<a href="https://www.npmjs.com/package/cc-suite"><img src="https://img.shields.io/npm/v/cc-suite" alt="Install size"></a>
</div>

---

## Installation
To install the package, use the following command:
```sh
npm install --save cc-suite
```

## Usage
Below are some minimal usage examples demonstrating how to use the `cc-suite` package.

### Initialization
You can initialize the CCSuite using either CommonJS or ES6 syntax:
```javascript
// CommonJS
const CCSuite = require("cc-suite");

// ES6
import CCSuite from 'cc-suite';
```

### Validate card
Tests that validateCard returns true for a valid card number
```javascript
 it('should return true when a valid card number is provided', () => {
    const validCardNumber = '4242424242424242';
    const result = CCSuite.validateCard(validCardNumber);
    expect(result).toBe(true);
});
```

### Generate valid card
Tests that generates a card number with a specific prefix and length
```javascript
 it('should generate a valid card number with the given bin and length', () => {
    const bin = '4242';
    const length = 16;
    const result = CCSuite.generateRandomCard(bin, length);
    const isValid = CCSuite.validateCard(result);
    expect(isValid).toBe(true);
});
```

### Check card type
Tests that Return valid card type
```javascript
it('should return the correct card type when given a valid card number', () => {
    const validCardNumber = '4242424242424242';
    const result = CCSuite.getCardType(validCardNumber);
    expect(result).toBe('VISA');
});
```

### Bin lookup
```javascript
it('should return valid bin info', () => {
    const bin = '424242'
    const result = await CCSuite.getBinInfo(bin);
    expect(result).toBe(object);
});
```
```json
{
  "number": {
    "length": 16,
    "luhn": true
  },
  "scheme": "visa",
  "type": "debit",
  "brand": "Visa/Dankort",
  "prepaid": false,
  "country": {
    "numeric": "840",
    "alpha2": "US",
    "name": "United States of America",
    "emoji": "🇺🇸",
    "currency": "USD",
    "latitude": 38,
    "longitude": -97
  },
  "bank": {
    "name": "BANK OF HAWAII",
    "url": "www.boh.com",
    "phone": "1-888-643-3888 OR 1-888-643-9888"
  }
}
```
