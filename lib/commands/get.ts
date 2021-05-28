import { recursive_regex_to_string, deep_copy,
		 glue_strings, access} from '../utils';

exports.description = "Get a runtime configuration variable, using JavaScript object dot-notation.";
exports.options = [{
    name: "accessor",
    type: "STRING",
    description: "Get a runtime configuration variable, using JavaScript object dot-notation.",
    required: true
}];
exports.main = (home_scope: HomeScope) => {
	const { message, CONFIG } = home_scope;

	// Accessing invalid fields will be caught.
	try {
		const accessors = message.options[0].value.trim().split('.').squeeze();

		const resolution = JSON.dump(
			recursive_regex_to_string(
				deep_copy(access(CONFIG, accessors))), null, 4);

		const msgs = glue_strings(resolution.trim()
			.replace(/\n/g, '\n@@@').split('@@@'), 1980)
			.map(s => '```js\n' + s + '\n```');

		for (const msg of msgs)
			message.reply(msg);
	} catch (e) {
		message.reply(`Invalid object access-path\n`
			+ `Problem: \`\`\`\n${e}\n${e.stack}\n\`\`\``);
	}
};
