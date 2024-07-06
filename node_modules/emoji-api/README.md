# EmojiAPI
Simple Emoji API.

# Installing

```sh
$ npm i emoji-api
```

# Example

```js
// ESM
import * as emoji from "emoji-api";
// CJS
const emoji = require("emoji-api");

console.log(emoji.get("🥺"));

/*
Emoji {
  _data: {
    emoji: '🥺',
    name: 'pleading face',
    group: 'Smileys & Emotion',
    sub_group: 'face-concerned',
    codepoints: '1F97A'
  }
}
*/

console.log(emoji.get("🥺").formattedName); // Pleading Face
console.log(emoji.get("🥺").twemoji()); // https://twemoji.maxcdn.com/v/latest/72x72/1f97a.png
```

## Arrange emojis by category

```js
const { arrange } = require("emoji-api");

console.log(arrange()); // { "Smileys & Emotion": [Emoji, Emoji, ...], ... }
```

# Other Examples

```js
console.log(emoji.all()); // [Emoji, Emoji, Emoji, ...]
console.log(emoji.emojiToUnicode("🥺")); // 1f97a
console.log(emoji.unicodeToEmoji("1f97a")); // 🥺
```