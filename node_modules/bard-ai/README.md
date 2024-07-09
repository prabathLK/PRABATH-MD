<h1 align="center">
  <code>bard-ai</code> v2
</h1>
<h3 align="center">More Powerful. More Capable.</h3>
<p align="center">
  <a aria-label="NPM Version" href="https://www.npmjs.com/package/bard-ai">
    <img alt="" src="https://img.shields.io/npm/v/bard-ai.svg?label=NPM&logo=npm&style=for-the-badge&color=F2984A&logoColor=white">
  </a>
  <a aria-label="NPM Download Count" href="https://www.npmjs.com/package/bard-ai">
    <img alt="" src="https://img.shields.io/npm/dt/bard-ai?label=Downloads&style=for-the-badge&color=D2667B">
  </a>
  <a aria-label="bard-ai Size" href="https://www.npmjs.com/package/bard-ai">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/bard-ai?style=for-the-badge&color=8B77CD">
  </a>
  <a aria-label="Join the community on Slack" href="https://join.slack.com/t/bard-aiworkspace/shared_invite/zt-1y1g3570m-Hx_N3IShMYBMkR6jpRyRjw">
    <img alt="" src="https://img.shields.io/badge/Slack-339AE0?style=for-the-badge&logo=slack&logoColor=white&label=Community">
  </a>
</p>
<p align="center">
  <a href="https://bard-ai.js.org">Docs</a> | <a href="https://github.com/evanzhoudev/bard-ai">GitHub</a> | <a href="https://bard-ai.js.org/faq">FAQ</a>
</p>

### Features

-   🍪 [**Multi-Cookie Use**](https://bard-ai.js.org/basics/initialization/): Have multiple Bard instances
-   🖼️ [**Google Lens Support**](https://bard-ai.js.org/advanced/google-lens/): Powerful image recognition
-   📷 [**Image Output**](https://bard-ai.js.org/advanced/json/#image-json): Access images from Google
-   🌐 [**Contextual Conversations**](https://bard-ai.js.org/basics/chat/): Maintain conversation context

## Quick Start

Copy the cookie labled `__Secure-1PSID` on bard.google.com, and use it in the code here:

```javascript
import Bard from "bard-ai";

let myBard = new Bard(COOKIE);

console.log(await myBard.ask("Hello, world!"));
```

Continue to explore full features, including Google Lens integration, with the [docs](https://bard-ai-docs.vercel.app/).

<h2 align="center">Contributors</h2>
<p align="center">A special shoutout to these amazing indviduals:</p>
<table>
  <tr valign="middle">
    <td width="20%" align="center" rowspan="2" colspan="2">
      <a href="https://github.com/acheong08">
      <img src="https://images.weserv.nl/?url=github.com/acheong08.png?v=4&h=300&w=300&fit=cover&mask=circle&maxage=7d" width="128">
      </a>
      <br>
      <a href="https://github.com/acheong08">@acheong08</a>
      <br>
      Original Python Bard API
    </td>
    <td width="20%" align="center" rowspan="2" colspan="2">
      <a href="https://github.com/thatxliner">
      <img src="https://images.weserv.nl/?url=github.com/thatxliner.png?v=4&h=300&w=300&fit=cover&mask=circle&maxage=7d" width="128">
      </a>
      <br>
      <a href="https://github.com/thatxliner">@ThatXliner</a>
      <br>
      Maintainer
    </td>
    <td width="20%" align="center" rowspan="2" colspan="2">
      <a href="https://github.com/Aldhanekaa">
      <img src="https://images.weserv.nl/?url=github.com/Aldhanekaa.png?v=4&h=300&w=300&fit=cover&mask=circle&maxage=7d" width="128">
      </a>
      <br>
      <a href="https://github.com/Aldhanekaa">@Aldhanekaa</a>
      <br>
      Typescript and Feature Developer, Maintainer
    </td>
    <td width="20%" align="center" rowspan="2" colspan="2">
      <a href="https://github.com/RFS-ADRENO">
      <img src="https://images.weserv.nl/?url=github.com/RFS-ADRENO.png?v=4&h=300&w=300&fit=cover&mask=circle&maxage=7d" width="128">
      </a>
      <br>
      <a href="https://github.com/RFS-ADRENO">@RFS-ADRENO</a>
      <br>
      TypeScript Developer, Maintainer
    </td>
  </tr>
</table>
<p align="center">
  However, we thank every person that helps in the development process of this library, no matter that be in code, ideas, or anything else.
</p>

<h3 align="center">
  <a href="https://bard-ai-docs.vercel.app">Read the docs</a> to get started.
</h3>
