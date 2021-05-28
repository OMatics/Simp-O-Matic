import { access } from '../utils';

export default (homescope: HomeScope) => {
	const { message, args, CONFIG } = homescope;

	if (args.length < 2)
		return message.reply(`Please provide two arguments.\n`
			+ `See \`${CONFIG.commands.prefix}help set\`.`);

	try {
		const accessors = args[0].trim().split('.').squeeze();
		const parent = accessors.pop();
		const obj = access(CONFIG, accessors);
		obj[parent] = JSON.parse(args.tail().join(' '));
		const normal = JSON.dump(obj[parent], null, 4);

		message.channel.send(`Assignment successful.
			\`${args[0].trim()} = ${normal}\``.squeeze());
	} catch (e) {
		message.channel.send(`Invalid object access-path or JSON value,`
			+ `nothing set.\nProblem: \`\`\`\n${e}\n\`\`\``);
	}
};
