import { TextChannel } from 'discord.js';
import ytdl from 'ytdl-core';


const DL_OPTIONS : any = { filter: 'audioonly', dlChunkSize: 0 };

export default async(home_scope: HomeScope) => {
	const { message, args, CONFIG, CLIENT, INSTANCE_VARIABLES } = home_scope;

	if(!message.guild) {
		message.answer("Just use youtube-dl at home.");
		return;
	};

	const guild : string = message.guild.id;
	const GID : Types.GuildInstanceData = INSTANCE_VARIABLES.guilds[guild];

	if(!CONFIG.vc_queue) CONFIG.vc_queue = [];

	switch (args[0]) {
		case "join":
			if (message.member.voice.channel) {
				GID.vc = await message.member.voice.channel.join();
				CONFIG.vc_channel = message.channel.id;
			} else {
				message.reply("Join A Channel First.");
			}
			break;
		case "leave":
			try {
				GID.vc.disconnect();
			} catch (error) {
				message.answer("```" + `${error}` + "```");
			}
			break;
		case "pause":
			if (GID.vc_dispatcher) GID.vc_dispatcher.pause();
			else message.answer("Nothing is playng");
			break;
		case "play":
			if (GID.vc_dispatcher) {
				GID.vc_dispatcher.resume();
			} else {
				GID.vc_dispatcher = GID.vc.play(
					ytdl(CONFIG.vc_queue.pop(), DL_OPTIONS));

				GID.vc_dispatcher.on("finish", () => {
					GID.vc_dispatcher.destroy();
					const next = CONFIG.vc_queue.pop();
					if (next) {
						GID.vc_dispatcher = GID.vc.play(
							ytdl(next, DL_OPTIONS));
						CLIENT.channels.fetch(CONFIG.vc_channel)
							.then((ch: TextChannel) =>
								ch.send(`Now playing: ${next}`));
					}
				})
			}
			break;
		case "d":
			CONFIG.vc_queue.splice(Number(args[1]) - 1, 1);
			break;
		case "i":
			CONFIG.vc_queue.splice(Number(args[1]) - 1, 0, args[2]);
			break;
		case "ls":
			message.answer(ls(CONFIG.vc_queue));
			break;
		case "requeue":
			CONFIG.vc_queue = [];
			message.answer("Queue cleared");
			GID.vc_dispatcher.end();
			break;
		case "skip":
			GID.vc_dispatcher.end();
			break;
		default:
			// TODO: Add checking for valid URIs?
			CONFIG.vc_queue.push(args[0]);
	}
}
function ls(queue : string[]) {  // TODO: This could be more sophisticated.
	return "Queue size: " + queue.length
		+ queue.map((e, i) => `\n ${i + 1}: ${e}`).join('');
}
