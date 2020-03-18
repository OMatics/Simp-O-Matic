import unirest from 'unirest';

type Options = {
	word : string,
	lang : string,
	id : string,
	key : string
}

export const oed_lookup = (options : Options) => new Promise((resolve, reject) => {
	console.log('Searching Oxford English Dictionary, with options: ', options);

	const url = 'https://od-api.oxforddictionaries.com:443/api/v2/entries';

	const word = options.word.toLowerCase();
	const req = unirest('GET', `${url}/${options.lang}/${word}`);

	req.headers({
		"app_id":  options.id,
		"app_key": options.key
	});

	req.end(res => {
		if (res.error) return reject(res.error);
		return resolve(res.body);
	});
});

export default oed_lookup;
