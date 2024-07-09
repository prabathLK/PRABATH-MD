<h1 align="center">Gemini AI</h1>
<p align="center">Welcome to the Gemini era.</p>
<p align="center">
  <a aria-label="NPM Version" href="https://www.npmjs.com/package/gemini-ai">
    <img alt="" src="https://img.shields.io/npm/v/gemini-ai.svg?label=NPM&logo=npm&style=for-the-badge&color=0470FF&logoColor=white">
  </a>
  <a aria-label="NPM Download Count" href="https://www.npmjs.com/package/gemini-ai">
    <img alt="" src="https://img.shields.io/npm/dt/gemini-ai?label=Downloads&style=for-the-badge&color=27B2FF">
  </a>
  <a aria-label="Gemini AI Size" href="https://www.npmjs.com/package/gemini-ai">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/gemini-ai?style=for-the-badge&color=B3CAFF">
  </a>
</p>
<p align="center">
  <a href="https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#documentation">Docs</a> | <a href="https://github.com/evanzhoudev/gemini-ai">GitHub</a> | <a href="https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#faq">FAQ</a>
</p>

## Installation

Install with the following command, or the command for your favorite package manager.

```bash
npm install gemini-ai
```

## Quickstart

Make a text request:

```javascript
import Gemini from "gemini-ai";

const gemini = new Gemini(API_KEY);

console.log(await gemini.ask("Hi!"));
```

Make a streaming text request:

```javascript
import Gemini from "gemini-ai";

const gemini = new Gemini(API_KEY);

gemini.ask("Hi!", {
	stream: console.log,
});
```

Chat with Gemini:

```javascript
import Gemini from "gemini-ai";

const gemini = new Gemini(API_KEY);
const chat = gemini.createChat();

console.log(await chat.ask("Hi!"));
console.log(await chat.ask("What's the last thing I said?"));
```

Read the full docs at https://github.com/EvanZhouDev/gemini-ai.

#### Table of Contents

- [**Installation**](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#installation)
- [**Getting an API Key**](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#getting-an-api-key)
- [**Quickstart**](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#quickstart)
- [**Special Features**](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#special-features)
- [**Documentation**](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#documentation)
  - [Initialization](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#inititalization)
  - [Method Patterns](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#method-patterns)
  - [`Gemini.ask()` Method](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#geminiask)
  - [`Gemini.count()` Method](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#geminicount)
  - [`Gemini.embed()` Method](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#geminiembed)
  - [`Gemini.createChat()` Method](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#geminicreatechat)
- [**FAQ**](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#faq)
- [**Contributors**](https://github.com/EvanZhouDev/gemini-ai?tab=readme-ov-file#contributors)
