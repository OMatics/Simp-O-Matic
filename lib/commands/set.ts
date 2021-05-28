import { access } from '../utils';

exports.description = "Set a value in the runtime JavaScript configuration object.";
exports.options = [{
    name: "accessor",
    type: "STRING",
    description: "[accessor]",
    required: true
}, {
	name: "value",
	type: "STRING",
	description: "[json-value]",
	required: true
}];
exports.main = (home_scope: HomeScope) => {
	const { message, CONFIG } = home_scope;

	try {
		const accessors = message.options[0].value.trim().split('.').squeeze();
		const parent = accessors.pop();
		const obj = access(CONFIG, accessors);
		obj[parent] = JSON.parse(message.options[1].value);
		const normal = JSON.dump(obj[parent], null, 4);

		message.reply(`Assignment successful.
			\`${message.options[0].value} = ${normal}\``.squeeze());
	} catch (e) {
		message.reply(`Invalid object access-path,`
			+ `nothing set.\nProblem: \`\`\`\n${e}\n\`\`\``);
	}
};
