export default function audioType (buf) {
	if (!buf) return;

	buf = new Uint8Array(buf.buffer || buf)

	if (isWav(buf)) return 'wav';
	if (isMp3(buf)) return 'mp3';
	if (isFlac(buf)) return 'flac';
	if (isM4a(buf)) return 'm4a';
	if (isOpus(buf)) return 'opus'; // overlaps with ogg, so must come first
	if (isOgg(buf)) return 'oga';
	if (isQoa(buf)) return 'qoa';
};

export function isMp3 (buf) {
	if (!buf || buf.length < 3) return

	return (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || // id3
		( buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0 ) || // no tag
		( buf[0] === 0x54 && buf[1] === 0x41 && buf[2] === 0x47) // 'TAG'
};

export function isWav(buf) {
	if (!buf || buf.length < 12) return

	return buf[0] === 82 &&
		buf[1] === 73 &&
		buf[2] === 70 &&
		buf[3] === 70 &&
		buf[8] === 87 &&
		buf[9] === 65 &&
		buf[10] === 86 &&
		buf[11] === 69;
}

export function isOgg(buf) {
	if (!buf || buf.length < 4) return;

	return  buf[0] === 79 &&
		buf[1] === 103 &&
		buf[2] === 103 &&
		buf[3] === 83;
}

export function isFlac(buf) {
	if (!buf || buf.length < 4) return;

	return buf[0] === 102 &&
		buf[1] === 76 &&
		buf[2] === 97 &&
		buf[3] === 67;
}

export function isM4a(buf) {
	if (!buf || buf.length < 8) return;

	return (buf[4] === 102 &&
		buf[5] === 116 &&
		buf[6] === 121 &&
		buf[7] === 112) || (
			buf[0] === 77 &&
			buf[1] === 52 &&
			buf[2] === 65 &&
			buf[3] === 32
		);
}

export function isOpus(buf) {
	if (!buf || buf.length < 36) return

	// Bytes 0 to 3: detect general OGG (OPUS is OGG)
	// Bytes 28 to 35: detect OPUS
	return buf[0] === 79 &&
		buf[1] === 103 &&
		buf[2] === 103 &&
		buf[3] === 83 &&
		buf[28] === 79 &&
		buf[29] === 112 &&
		buf[30] === 117 &&
		buf[31] === 115 &&
		buf[32] === 72 &&
		buf[33] === 101 &&
		buf[34] === 97 &&
		buf[35] === 100;
}

export function isQoa(buf) {
	if (!buf) return
	return (buf[0] === 0x71 && buf[1] === 0x6f && buf[2] === 0x61 && buf[3] === 0x66)
}