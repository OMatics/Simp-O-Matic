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

export const pastebin_update = async (stringified : string) => {
	await paste.login(PASTE_USER, PASTE_PASS, async (succ, res) => {
		if (!succ)
			return Promise.reject(console.log('Could not log in.'));

		return await paste.edit(PASTE_ID, {
			contents: stringified
		}, (worked, _) => {
			if (!worked)
				return Promise.reject('Error updating paste...');
			return Promise.resolve('Pastebin edit successful!');
		});
	});
	return Promise.resolve('Pastebin update successful');
};
