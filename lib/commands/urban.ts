import urban_search from '../api/urban';
import '../extensions';
exports.description = "Looks up a piece of slang in the *Urban Dictionary.*";
exports.options = [{
    name: "slang",
    type: "STRING",
    description: "Looks up a piece of slang in the Urban Dictionary.",
    required: true
}];
exports.main = (home_scope: HomeScope) => {
	const { message, args, SECRETS } = home_scope;
	const query = args.join(' ');
	message.reply('Searching Urban Dictionary...');
	urban_search({ query, key: SECRETS.rapid.key }).then(res => {
		if (res['list'].length === 0) {
			message.editReply(`Congratulations, not even Urban \
			Dictionary knows what you're trying to say.`.squeeze());
			return;
		}
		const entry = res['list'][0];
		const def = entry.definition.replace(/\[|\]/g, '');

		message.editReply(`**Urban Dictionary** defines \
			‘${query}’, as:\n>>> ${def.trim()}`.squeeze());

		let example = entry.example;
		if (!!example || example.length > 0) {
			example = example.replace(/\[|\]/g, '');
			message.editReply(`\n**Example**:\n>>> ${example.trim()}`);
		}
		message.editReply(`Link: ${entry.permalink}`);
	}).catch(e => message.editReply(`Error fetching definition:\n${e}`));
};
