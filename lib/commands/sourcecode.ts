import { FORMATS } from '../extensions';
import { Message } from 'discord.js';

import { readFileSync as read_file } from 'fs';

export default (home_scope: HomeScope) => {
    const { message, args }
        : { message: Message, args: string[] } = home_scope;

	if (args.length == 0) {
		return message.channel.send(
			"View a command's source code.\n.sourcecode [!command]"
		);
	}

	const command_name = args[0].replace(/^\.|\.ts/, '');
	const src = read_file(`./${command_name}.ts`).toString();

	message.channel.send(src.format(FORMATS.code_block, 'ts'));
};
