import unirest from 'unirest';

type Options = {
	query : string,
	type : 'image' | 'web' | 'news',
	key : string
};

export const web_search = (options : Options) => new Promise((resolve, reject) => {
	console.log('Searching the web, with options: ', options);

	const api = `${options.type.capitalize()}SearchAPI`;
	const url = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search';

	const req = unirest('GET', `${url}/${api}`);

	req.query({
		"autoCorrect": "false",
		"pageNumber": "1",
		"pageSize": "10",
		"q": options.query,
		"safeSearch": "false"
	});

	req.headers({
		"x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
		"x-rapidapi-key": options.key
	});

	req.end(res => {
		if (res.error) return reject(res.error);
		return resolve(res.body);
	});
});

export default web_search;
