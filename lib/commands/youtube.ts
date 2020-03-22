import yt_search from '../api/yt_scrape';
export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	const query = args.join(' ').trim();
	if (query.length === 0 || args.length === 0)
		return message.answer('Well, what should I search for?');
	yt_search({ query })
		.then(message.reply.bind(message))
		.catch(message.answer.bind(message));
};
