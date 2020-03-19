import fetch from 'node-fetch';
const URL = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en&key=457653';

export default home_scope => {
	const { message } = home_scope;
	fetch(URL)
		.catch(_   => message.channel.send("Couldn't get your quote qwq..."))
		.then(res  => res.text())
		.then(body => message.channel.send(body));
};
