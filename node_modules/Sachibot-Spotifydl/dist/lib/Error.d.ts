export default class SpotifyDlError extends Error {
    message: string;
    name: string;
    constructor(message: string, name?: string);
}
