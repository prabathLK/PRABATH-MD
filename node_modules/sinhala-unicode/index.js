const amalee_unicode = require('./lib/amalee_unicode')
const bamini_unicode = require('./lib/bamini_unicode')
const dlmanel_unicode = require('./lib/dlmanel_unicode')
const fmabaya_unicode = require('./lib/fmabaya_unicode')
const kaputa_unicode = require('./lib/kaputa_unicode')
const singlish_phonetic_unicode = require('./lib/singlish_phonetic_unicode')
const singlish_unicode = require('./lib/singlish_unicode')
const tanglish_unicode = require('./lib/tanglish_unicode')
const thibus_unicode = require('./lib/thibus_unicode')
const unicode_bamini = require('./lib/unicode_bamini')
const unicode_dlmanel = require('./lib/unicode_dlmanel')
const unicode_kaputa = require('./lib/unicode_kaputa')
const unicode_tiptaka = require('./lib/unicode_tiptaka')

function replaceOneByOne(text, array) {
	for(one of array) {
		text = text.replace(one[0], one[1])
	}

	return text
}

module.exports = {
	amaleeToUnicode : (text) => {
		return replaceOneByOne(text, amalee_unicode)
	},
	bamaniToUnicode : (text) => {
		return replaceOneByOne(text, bamini_unicode)
	},
	dlManelToUnicode : (text) => {
		return replaceOneByOne(text, dlmanel_unicode)
	},
	fmAbayaToUnicode : (text) => {
		return replaceOneByOne(text, fmabaya_unicode)
	},
	kaputaToUnicode : (text) => {
		return replaceOneByOne(text, kaputa_unicode)
	},
	tanglishToUnicode : (text) => {
		return replaceOneByOne(text, tanglish_unicode)
	},
	thibusToUnicode : (text) => {
		return replaceOneByOne(text, thibus_unicode)
	},
	unicodeToBamini : (text) => {
		return replaceOneByOne(text, unicode_bamini)
	},
	unicodeToDlManel : (text) => {
		return replaceOneByOne(text, unicode_dlmanel)
	},
	unicodeToKaputa : (text) => {
		return replaceOneByOne(text, unicode_kaputa)
	},
	unicodeToTiptaka : (text) => {
		return replaceOneByOne(text, unicode_tiptaka)
	},
	singlishPhoneticToUnicode : singlish_phonetic_unicode,
	singlishToUnicode : singlish_unicode,
}