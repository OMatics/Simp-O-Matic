import fetch, { Response } from 'node-fetch';
const URL = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en&key=457653';

exports.description = "Get a motivational quote (for when you're feeling a lil down).";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	fetch(URL)
		.catch((e: Response) => {
			message.reply("Couldn't get your quote qwq...");
			return e;
		})
		.then(res  => res.text())
		.then(body => message.reply(body));
};