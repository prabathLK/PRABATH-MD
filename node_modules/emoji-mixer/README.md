# Installation

```sh
npm install emoji-mixer
```

## Emoji Mix URL Generator

This module is designed to generate URLs for mixed emoji images using Google's Android Emoji Kitchen. It consists of several helper functions, an emoji data object and a list of supported emojis.

## Key Components

### Supported Emojis

This is an array of Unicode code point strings. Each string in the array represents an emoji that is supported by the module. For instance, '1fa84' represents the 🪄 emoji, '1f600' represents the 😀 emoji, and so on.
**To see a full list of supported emojis, visit the `index.js` file.**

### Emoji Data

This is a JavaScript object where each key is a Unicode representation of an emoji and the value is an array of objects. Each object represents a pair of emojis that can be combined.
**To see a list of emoji compatibility, visit the `index.js` file.**
**Alternatively, use the `checkSupported()` function on an emoji.**

## Functions

- `toUnicode(input)`Validates and transforms an input into a Unicode representation.
- `googleRequestUrlEmojiPart(emoji)`Transforms an emoji Unicode representation for inclusion in a URL.
- `googleRequestUrl(emojiMixData)`Generates a URL for fetching an emoji combination image from Google's Android Emoji Kitchen.
- `getEmojiCombo(leftEmoji, rightEmoji)`Finds a matching emoji combination from the global emojiCompatibilityData object.
- `getEmojiMixUrl(leftEmoji, rightEmoji, showCompatible)`Generates a URL for an emoji mix image from Google's Android Emoji Kitchen based on the unicode representation of two input emojis.
- `checkSupported(emoji)`
  Checks if a given emoji is supported by looking it up in the `emojiCompatibilityData` object. Returns an array of emoji data associated with this emoji if supported; otherwise, it returns null.

## Usage

Import the main function from the module using ES syntax:

```javascript
// getEmojiMixUrl is the main function,
// while the other helper functions are imported through {}
import getEmojiMixUrl, {
  toUnicode, 
  getEmojiCombo, 
  checkSupported, 
  googleRequestUrl, 
  googleRequestUrlEmojiPart 
} from 'emoji-mixer';

// Example usage.
console.log(getEmojiMixUrl('🔥', '😃'));
```

Alternatively you can use the CommonJS syntax:

```javascript
// Code enclosed in an asynchronous IIFE 
// as await's needed to import ES modules into CommonJS
(async () => {
    // Main function is found in emojiMix.default.
    const emojiMix = await import('emoji-mixer');
    // Helper functions can be imported this way.
    const { 
      toUnicode, 
      getEmojiCombo, 
      checkSupported, 
      googleRequestUrl, 
      googleRequestUrlEmojiPart 
    } = emojiMixer;

    // Example usage.
    console.log(emojiMix.default('🔥', '😃'));
})();
```

## Related

- Inspired by [emoji-kitchen](https://github.com/xsalazar/emoji-kitchen)
