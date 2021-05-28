import web_search from '../api/google';

exports.description = "Performs a web-search and returns the most appropriate URL found.";
exports.options = [{
    name: "search",
    type: "STRING",
    description: "[web-search-terms]",
    required: true
}];

exports.main = (home_scope: HomeScope) => {
	const { message, args, SECRETS } = home_scope;
	const query = args.join(' ').toLowerCase();
	message.defer().then(console.log);
	web_search({
		kind: 'web',
		query,
		key: SECRETS.google.api_key,
		id: SECRETS.google.search_id,
		nsfw: message.channel.nsfw
	}).then((res) => message.editReply(res))
		.catch(e => message.editReply(e));
};
