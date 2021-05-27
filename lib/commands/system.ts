import { help_info } from '../utils';
const sys_channel = (channel_id: string) =>
	(channel_id)
		? `is set to <#${channel_id}>.`
		: `has not been set.`;

export default (homescope: HomeScope) => {
	const { message, args, CONFIG } = homescope;
	const { uptime } = message.client;

	if (args.length === 0 || args[0] === 'status') {
		let msg = `**Bot up and running.**\n`;
		msg += `${uptime} milliseconds since last re-boot.\n`;
		msg += `system-information channel `;
		msg += sys_channel(CONFIG.system_channel);
		msg += `\nSee \`${CONFIG.commands.prefix}help system\` for more information.`;
		message.reply(msg);
		return;
	}

	if (args[0] === 'channel') {
		const { channels } = message.mentions;
		if (channels.size === 0)
			return message.reply('System-information channel '
				+ sys_channel(CONFIG.system_channel));
		CONFIG.system_channel = channels.first().id;
		return message.reply(
			`System-information channel set to <#${CONFIG.system_channel}>.`);
	}

	message.reply(help_info('system', CONFIG.commands.prefix));
};
