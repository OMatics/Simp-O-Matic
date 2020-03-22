import { recursive_regex_to_string, deep_copy,
		 glue_strings, access} from '../utils';

export default (home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	if (args.length === 0) {  // Or use '.' as argument.
		message.answer('To view the entire object, use the `!export` command.');
		return;
	}
	// Accessing invalid fields will be caught.
	try {
		const accessors = args[0].trim().split('.').squeeze();

		const resolution = JSON.stringify(
			recursive_regex_to_string(
				deep_copy(access(CONFIG, accessors))), null, 4);

		const msgs = glue_strings(resolution.trim()
			.replace(/\n/g, '\n@@@').split('@@@'), 1980)
			.map(s => '```js\n' + s + '\n```');

		for (const msg of msgs)
			message.channel.send(msg);
	} catch (e) {
		message.channel.send(`Invalid object access-path\n`
			+ `Problem: \`\`\`\n${e}\n\`\`\``);
	}
};
