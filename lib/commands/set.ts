import { access } from '../utils';

export default (home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	if (args.length < 2)
		return message.answer(`Please provide two arguments.\n`
			+ `See \`${CONFIG.commands.prefix}help set\`.`);

	try {
		const accessors = args[0].trim().split('.').squeeze();
		const parent = accessors.pop();
		const obj = access(CONFIG, accessors);
		obj[parent] = JSON.parse(args[1]);
		const normal = JSON.stringify(obj[parent], null, 4);

		message.channel.send(`Assignment successful.
						\`${args[0].trim()} = ${normal}\``.squeeze());
	} catch (e) {
		message.channel.send(`Invalid object access-path,`
			+ `nothing set.\nProblem: \`\`\`\n${e}\n\`\`\``);
	}
};
