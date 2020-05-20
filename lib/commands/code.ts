import { readFileSync as read_file } from 'fs';

export default (homescope : HomeScope) => {
	const { message, args, CONFIG } = homescope;
	const p = CONFIG.commands.prefix;
	
	if (args.length < 1)
		return message.answer('Please provide a command to introspect.');
	
	const command = args[0].startsWith(p) ? args[0].tail() : args[0];

	const expansion = CONFIG.commands.aliases[command];
	if (expansion) return message.channel.send(`\`${p}${command}\``
		+ `is a command that expands to \`${p}${expansion}\`.`);

	const filename = `${process.cwd()}/lib/commands/${command}.ts`;
	
	try {
		const source = read_file(filename);
		const msg = `Source code for \`${p}${command}\`:`
			+ "\n```typescript\n" + source + "\n```";
		message.channel.send(msg);
	} catch {
		message.answer(`Source for \`${p}${command}\``
			+ ` (\`${filename}\`), was not found.`);
	}
};
