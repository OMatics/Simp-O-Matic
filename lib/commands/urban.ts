import urban_search from '../api/urban';
import '../extensions';
export default home_scope => {
	const { message, args, SECRETS } = home_scope;
	const query = args.join(' ');
	message.answer('Searching Urban Dictionary...');
	urban_search({ query, key: SECRETS.rapid.key }).then(res => {
		if (res['list'].length === 0) {
			message.channel.send(`Congratulations, not even Urban \
			Dictionary knows what you're trying to say.`.squeeze());
			return;
		}
		const entry = res['list'][0];
		const def = entry.definition.replace(/\[|\]/g, '');

		message.channel.send(`**Urban Dictionary** defines \
			‘${query}’, as:\n>>> ${def.trim()}`.squeeze());

		let example = entry.example;
		if (!!example || example.length > 0) {
			example = example.replace(/\[|\]/g, '');
			message.channel.send(`\n**Example**:\n>>> ${example.trim()}`);
		}
		message.channel.send(`Link: ${entry.permalink}`);
	}).catch(e => message.answer(`Error fetching definition:\n${e}`));
}