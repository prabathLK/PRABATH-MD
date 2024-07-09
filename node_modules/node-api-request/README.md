<div align="center">
	<h1>Node API Request</h1> 
	<br>
	<p>Node-API-Request is a versatile and lightweight module designed to streamline the process of making HTTP requests in Node.js. Whether you're fetching data from APIs, downloading resources, or interacting with web services</p>
	<a href="https://github.com/jaynath-d/node-api-request/actions"><img src="https://github.com/jaynath-d/node-api-request/workflows/ci/badge.svg?branch=main" alt="Build status"></a>
	<a href="https://packagephobia.now.sh/result?p=node-api-request"><img src="https://badgen.net/packagephobia/install/node-api-request" alt="Package size"></a>
	<a href="https://www.npmjs.com/package/node-api-request"><img src="https://img.shields.io/npm/dw/node-api-request" alt="Downloads"></a>
	<a href="https://www.npmjs.com/package/node-api-request"><img src="https://img.shields.io/npm/v/node-api-request" alt="Npm version"></a>
</div>

---

## Installation
To install the package, use the following command:
```sh
npm install --save node-api-request
```

### Initialization
You can initialize the Node-API-Request using either CommonJS or ES6 syntax:
```javascript
// CommonJS
const NodeApiRequest = require("node-api-request");

// ES6
import NodeApiRequest from 'node-api-request';
```
## Usage
```javascript
import NodeApiRequest, { RequestOptions, ApiResponse } from 'node-api-request';

async function main() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
  const requestOptions: RequestOptions = {
    url: apiUrl,
    method: 'GET',
  };

  try {
    const response: ApiResponse = await NodeApiRequest.sendRequest(requestOptions);

    console.log('Response Status:', response.status);
    console.log('Response Body:', response.body);
  } catch (error) {
    console.error('Error:', error);
  }
}
```
