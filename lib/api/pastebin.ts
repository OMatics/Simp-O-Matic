import paste from 'better-pastebin';

const PASTE_USER = "knutsen";
const PASTE_PASS = process.env['PASTEBIN_PASSWORD'];
const PASTE_ID = "V37uQYQB";
export const pastebin_url = `https://pastebin.com/${PASTE_ID}`;

paste.setDevKey(process.env['PASTEBIN_KEY']);

export const pastebin_latest = () => new Promise((resolve, reject) => {
	paste.get(PASTE_ID, (succ, res) => {
		if (!succ)
			return reject('Error getting paste.');
		resolve(JSON.parse(res));
	});
});

export const pastebin_update = async function (stringified : string) {
	await paste.login(PASTE_USER, PASTE_PASS, async function (succ, res) {
		if (!succ)
			return Promise.reject(console.log('Could not log in.'));

		return await paste.edit(PASTE_ID, {
			contents: stringified
		}, async function (succ, _res) {
			if (!succ)
				return console.log('Error updating paste...');
		});
	});
};
