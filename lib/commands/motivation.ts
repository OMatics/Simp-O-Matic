import fetch, { Response } from 'node-fetch';
const URL = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en&key=457653';

export default (homescope: HomeScope) => {
	const { message } = homescope;
	fetch(URL)
		.catch((e: Response) => {
			message.channel.send("Couldn't get your quote qwq...");
			return e;
		})
		.then(res  => res.text())
		.then(body => message.channel.send(body));
};
