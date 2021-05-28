import web_search from '../api/google';

exports.description = "Searches for images specified by the terms given, and sends a link to the most relevant one.";
exports.options = [{
    name: "image",
    type: "STRING",
    description: "[image-search-terms]",
    required: true
}];

exports.main = (home_scope: HomeScope) => {
	const { message, args, SECRETS } = home_scope;
	const query = args.join(' ').toLowerCase();
	message.defer().then(console.log);
	web_search({
		kind: 'image',
		query,
		key: SECRETS.google.api_key,
		id: SECRETS.google.search_id,
		nsfw: message.channel.nsfw
	}).then(res => message.editReply(res))
		.catch(er => message.editReply(er));
};
