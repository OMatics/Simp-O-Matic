import unirest from 'unirest';

type Options = {
	query : string,
	key : string
};

export const urban_search = (options : Options) => new Promise((resolve, reject) => {
	console.log('Searching Urban Dictionary, with options: ', options);

	const url = 'https://mashape-community-urban-dictionary.p.rapidapi.com/define';

	const req = unirest('GET', url);

	req.query({
		"term": options.query
	});

	req.headers({
		"x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
		"x-rapidapi-key": options.key
	});

	req.end(res => {
		if (res.error) return reject(res.error);
		return resolve(res.body);
	});
});

export default urban_search;
