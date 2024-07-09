export function extractTooManyRequestsInfo(html) {
    const ip = html.match(/IP address: (.+?)<br>/)?.[1] || '';
    const time = html.match(/Time: (.+?)<br>/)?.[1] || '';
    const url = (html.match(/URL: (.+?)<br>/)?.[1] || '').replace(/&amp;/g, '&');
    return { ip, time, url };
}
//# sourceMappingURL=helpers.js.map