import yt_search from '../api/yt_scrape';
export default home_scope => {
	const { message, args } = home_scope;
	const query = args.join(' ');
	yt_search({ query })
		.then(message.reply.bind(message))
		.catch(message.answer.bind(message));
}
