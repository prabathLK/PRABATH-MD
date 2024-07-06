# Temp Mail Generator

A temporary mail generator script.

## Disclaimer

This is an unofficial module and is not affiliated with or endorsed by [https://tempmail.email/](https://tempmail.email/). This module was created based on data scraped from the https://tempmail.email/ site, but it is not officially associated with it.

## Installation

```
npm install @black-king/temp-mail-gen
```

## Usage

**Create an email:**

```javascript
const TempMailGenerator = require('@black-king/temp-mail-gen');

const tempMailGen = new TempMailGenerator();

(async () => {
  const email = await tempMailGen.generateEmail();
  console.log('Email:', email);
})();
```

**Check for messages:**

```javascript
(async () => {
  const email = await tempMailGen.generateEmail();
  console.log('Email:', email);

  const messages = await tempMailGen.checkMessages(email);
  if (messages.length > 0) {
    console.log('New messages:');
    messages.forEach(async (message) => {
      console.log('Message:', message);
    });
  } else {
    console.log('No new messages.');
  }
})();
```

**Get message content:**

```javascript
(async () => {
  // Create an email
  const email = await tempMailGen.generateEmail();
  console.log('Email:', email);

  // Check for new messages later
  const messages = await tempMailGen.checkMessages(email);
  if (messages.length > 0) {
    messages.forEach(async (message) => {
      console.log('Subject:', message);

      // Get email message content
      const content = await tempMailGen.getContent(message.id);

      // If you want message content as HTML
      console.log("\n==========================================\n");
      console.log('Html:', content);

      // If you want message content as markdown
      const TurndownService = require('turndown'); // make sure to install it, npm install turndown
      const turndownService = new TurndownService();
      console.log("\n==========================================\n");
      const markdownEmail = turndownService.turndown(content);
    });
  } else {
    console.log('No new messages.');
  }
})();
```

Output is based on whether you choose markdown or HTML.

**Note:** This is not limited to a 10-minute duration; you can use it for any email generated using this. ( I've only tested it for one day; I don't know what happens when using old emails for more than one day. Test it yourself. )

If you want to get new emails from older emails you generated, try this modification:

```javascript
(async () => {
  // Create an email
  const email = 'oldemailyougenerated@through.this';
  console.log('Email:', email);

  // Check for new messages later
  const messages = await tempMailGen.checkMessages(email);
  if (messages.length > 0) {
    messages.forEach(async (message) => {
      console.log('Subject:', message);

      // Get email message content
      const content = await tempMailGen.getContent(message.id);

      // If you want message content as HTML
      console.log("\n==========================================\n");
      console.log('Html:', content);

      // If you want message content as markdown
      const TurndownService = require('turndown'); // make sure to install it, npm install turndown
      const turndownService = new TurndownService();
      console.log("\n==========================================\n");
      const markdownEmail = turndownService.turndown(content);
    });
  } else {
    console.log('No new messages.');
  }
})();
```

## License
Licensed under MIT.

## Author
[SACHIBOT](https://github.com/SACHIBOT)

Note that Axios is used for making HTTP requests, but you can use node-fetch if you prefer.