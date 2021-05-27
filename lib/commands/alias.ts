import { glue_strings } from '../utils';

export default (homescope: HomeScope) => {
	const { message, args, CONFIG } = homescope;
	const p = CONFIG.commands.prefix;

	if (args.length === 0 || args[0] === 'ls') {
		const lines = Object.keys(CONFIG.commands.aliases)
			.map((e, i) => `${i + 1}.  \`${p}${e}\` ↦ \`${p}${CONFIG.commands.aliases[e].shorten(60)}\`\n`);
		message.reply('List of **Aliases**:\n');
		lines.unshift('**KEY:  `alias` ↦ `command it maps to`**\n\n');

		for (const msg of glue_strings(lines))
			message.channel.send(msg);

		return;
	}

	// Parse `!alias rm` command.
	if (args[0] === 'rm' && args.length > 1) {
		const aliases = CONFIG.commands.aliases;
		const keys = Object.keys(aliases);
		let match, index, alias;
		if (match = args[1].match(/^#?(\d+)/)) {
			index = Number(match[1]) - 1;
			if (index >= keys.length) {
				message.reply('No alias exists at such an index'
					+ ` (there are only ${keys.length} indices).`);
				return;
			}
			alias = keys[index];
		} else {
			alias = args[1];
			if (alias[0] === p) alias = alias.tail();
			index = keys.indexOf(alias);
			if (index === -1) {
				message.reply(`There does not exist any alias \
								with the name \`${p}${alias}\`.`.squeeze());
				return;
			}
		}
		keys.each((_, i) => i === index
			? delete aliases[alias]
			: null);
		message.reply(`Alias \`${p}${alias}\` at index \
						number ${index + 1}, has been deleted.`.squeeze());
		return;
	}

	// Check last:
	if (args.length > 1) {  // Actually aliasing something.
		args[0] = args[0].trim();
		args[1] = args[1].trim();

		if (args[0][0] === CONFIG.commands.prefix)
			args[0] = args[0].tail();
		args[0] = args[0].toLowerCase();

		if (args[1][0] === CONFIG.commands.prefix)
			args[1] = args[1].tail();

		CONFIG.commands.aliases[args[0]] = args.tail().join(' ');
		message.channel.send(
			'**Alias added:**\n >>> ' +
			`\`${p}${args[0]}\` now maps to \`${p}${args.tail().join(' ')}\``);
	} else {
		if (args.length === 1) {
            if (args[0][0] === CONFIG.commands.prefix)
				args[0] = args[0].tail();

			if (args[0] in CONFIG.commands.aliases) {
				const aliases = Object.keys(CONFIG.commands.aliases);
				const n = aliases.indexOf(args[0]) + 1;
				message.reply(`${n}.  \`${p}${args[0]}\` ↦ \`${p}${CONFIG.commands.aliases[args[0]]}\``);
				return;
			} else {
				message.reply('No such alias found.');
				return;
			}
		}
		message.reply('Invalid number of arguments to alias,\n'
			+ `Please see \`${CONFIG.commands.prefix}help alias\`.`);
	}
};
