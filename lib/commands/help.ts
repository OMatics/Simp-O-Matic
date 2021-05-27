import { prefix_friendly } from '../utils';


export default (homescope: HomeScope) => {
	const { message, args, HELP_SECTIONS,
			KNOWN_COMMANDS, CONFIG, ALL_HELP,
			HELP_KEY, HELP_SOURCE, expand_alias } = homescope;

	const p = CONFIG.commands.prefix;

	const [help_key, help_source] = [HELP_KEY, HELP_SOURCE]
		.map(s => prefix_friendly(s, p));
	const [help_sections, all_help] = [HELP_SECTIONS, ALL_HELP]
		.map(e => e.map(s => prefix_friendly(s, p)));

	if (args.length === 0 || args[0] === 'help') {
		message.channel.send(help_sections[0]);
		return;
	}

	if (args[0] === 'key')
		return message.channel.send(help_key);
	if (args[0] === 'source')
		return message.channel.send(help_source);
	if (args[0] === 'all') {
		for (const msg of all_help)
			message.channel.send(msg);
		return;
	}

	// Assume the user is now asking for help with a command:
	//   Sanitise:
	let command : string = args[0].trim();
	if (command.head() === p)
		command = command.tail();
	command = expand_alias(command, args, message).toLowerCase();

	const help_index = KNOWN_COMMANDS.indexOf(command);

	if (help_index === -1)
		return message.reply(`No such command/help-page (\`${p}${command}\`).`);

	message.reply(`**Help (\`${p}${command}\`):**\n`
		+ help_sections[help_index].trim());
};
