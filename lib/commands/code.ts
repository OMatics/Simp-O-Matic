import { readFileSync as read_file } from 'fs';

import { FORMATS } from '../extensions';
import { glue_strings } from '../utils';

export default (homescope : HomeScope) => {
	const { message, args, CONFIG } = homescope;
	const p = CONFIG.commands.prefix;
	
	if (args.length < 1)
		return message.answer('Please provide a command to introspect.');
	
	const command = args[0].startsWith(p) ? args[0].tail() : args[0];

	const expansion = CONFIG.commands.aliases[command];
	if (expansion) return message.channel.send(`\`${p}${command}\``
		+ `is an alias that expands to \`${p}${expansion}\`.`);

	const filename = `${process.cwd()}/lib/commands/${command}.ts`;
	
	try {
		const source = read_file(filename).toString();
		const msg = `Source code for \`${p}${command}\`:`;
		
		if (source.length > 1900) {
			const chunks = glue_strings(source.split('\n'), 1950);

			for (const chunk of chunks)
				message.channel.send(
					chunk.format(FORMATS.code_block, 'typescript'));

			message.channel.send(msg);
		} else {
			message.channel.send(`${msg}\n`
				+ source.format(FORMATS.code_block, 'typescript'));
		}
	} catch {
		message.answer(`Source for \`${p}${command}\``
			+ ` (\`${filename}\`), was not found.`);
	}
};
