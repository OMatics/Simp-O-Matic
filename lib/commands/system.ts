import { help_info } from '../utils';
const sys_channel = (channel_id: string) =>
	(channel_id)
		? `is set to <#${channel_id}>.`
		: `has not been set.`;

exports.description = "Get messages about current bot-status.";
exports.options = [{
	name: "status",
	type: "SUB_COMMAND",
	description: "Get brief information about current bot-status."
}, {
	name: "channel",
	type: "SUB_COMMAND",
	description: "Get the currently set channel for receiving technical messages.",
	options: [{
		name: "channel",
		type: "CHANNEL",
		description: "Set the new system-info messages channel."
	}]
}];
exports.main = (home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;
	const { uptime } = message.client;

	if (message.options[0].name === 'status') {
		let msg = `**Bot up and running.**\n`;
		msg += `${uptime} milliseconds since last re-boot.\n`;
		msg += `system-information channel `;
		msg += sys_channel(CONFIG.system_channel);
		msg += `\nSee \`${CONFIG.commands.prefix}help system\` for more information.`;
		message.reply(msg);
		return;
	}

	if (message.options[0].name === 'channel') {
		if (message.options[0].options[0].channel){
			CONFIG.system_channel = message.options[0].options[0].channel.id;
			return message.reply(
			`System-information channel set to <#${CONFIG.system_channel}>.`);
		} else{
			return message.reply('System-information channel '
				+ sys_channel(CONFIG.system_channel));
		}

	}

	message.reply(help_info('system', CONFIG.commands.prefix));
};