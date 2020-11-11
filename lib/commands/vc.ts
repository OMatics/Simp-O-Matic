import { TextChannel } from 'discord.js';
import ytdl from 'ytdl-core';

const DL_OPTIONS : any = {
	filter: 'audioonly',
	dlChunkSize: 0,
	quality: 'highestaudio'
};

export default async(home_scope: HomeScope) => {
	const { message, args, CONFIG, CLIENT, INSTANCE_VARIABLES } = home_scope;

	if(!message.guild) {
		message.answer("Just use youtube-dl at home.");
		return;
	};

	const guild : string = message.guild.id;
	const GID : Types.GuildInstanceData = INSTANCE_VARIABLES.guilds[guild];

	if(!CONFIG.vc_queue) CONFIG.vc_queue = [];

	const attempt_prefetch = (url: string): boolean => {
		let stream = null;
		try {
			stream = ytdl(url, DL_OPTIONS);
		} catch (e) { console.log(e); }

		if (stream) {
			GID.vc_prefetch[url] = stream;
			return true;
		}
		return false;
	};

	switch (args[0]) {
	case "join": {
		if (message.member.voice.channel) {
			GID.vc = await message.member.voice.channel.join();
			CONFIG.vc_channel = message.channel.id;
			message.reply("Joined your voice chat.");
		} else {
			message.reply("Join a voice channel first.");
		}
		break;
	} case "leave": {
		try {
			GID.vc.disconnect();
			GID.vc.channel.leave();
		} catch (error) {
			message.answer("```" + `${error}` + "```");
		}
		break;
	} case "pause": {
		if (GID.vc_dispatcher) {
			GID.vc_dispatcher.pause();
			message.answer("Paused playback.");
		}
		else {
			message.answer("Nothing is playing");
		}
		break;
	} case "play": {
		if (GID.vc_dispatcher) {
			GID.vc_dispatcher.resume();
			message.answer("Resuming playback.");
		} else {
			if (CONFIG.vc_queue.length === 0) {
				message.answer("Please add a URL to the queue first.");
				return;
			}

			const stream = GID.vc_prefetch[CONFIG.vc_queue.pop()];
			GID.vc_current_stream = stream;
			GID.vc_dispatcher = GID.vc.play(stream);
			message.channel.send("Playing media from queue...");

			const end_handler = () => {
				GID.vc_dispatcher.destroy();
				const next = CONFIG.vc_queue.pop();
				if (next) {
					const stream = GID.vc_prefetch[next];
					GID.vc_current_stream = stream;
					GID.vc_dispatcher = GID.vc.play(stream);
					CLIENT.channels.fetch(CONFIG.vc_channel)
						.then((ch: TextChannel) =>
							ch.send(`Now playing: ${next}`));
				}
			}

			GID.vc_dispatcher.on('finish', end_handler);
			GID.vc_current_stream.on('end', () => {
				GID.vc_dispatcher.end();
			});
		}
		break;
	} case "d": {
		const pos = Number(args[1]);
		CONFIG.vc_queue.splice(pos - 1, 1);
		message.answer(`Removed media from queue at index ${pos}.`);
		break;
	} case "i": {
		const pos = Number(args[1]);
		const url = args[2];
		const success = attempt_prefetch(url);
		if (success) {
			CONFIG.vc_queue.splice(pos - 1, 0, url);
			message.answer(`Inserted into queue at index ${pos}.`);
		} else {
			message.answer("URL or media-type not valid.");
		}
		break;
	} case "ls": {
		message.answer(ls(CONFIG.vc_queue));
		break;
	} case "requeue": {
		CONFIG.vc_queue = [];
		GID.vc_current_stream = null;
		message.answer("Queue cleared");
		GID.vc_dispatcher.end();
		break;
	} case "skip": {
		GID.vc_dispatcher.end();
		GID.vc_current_stream.destroy();
		message.answer("Skipping...");
		break;
	} default: {
		const url = args[0];
		const success = attempt_prefetch(url);
		if (success) {
			CONFIG.vc_queue.push(url);
			message.answer("Succesfully added media to queue.");
		} else {
			message.answer("URL or media-type not valid.");
		}
	}
	}
}

function ls(queue : string[]) {  // TODO: This could be more sophisticated.
	return "Queue size: " + queue.length
		+ queue.map((e, i) => `\n ${i + 1}. ${e}`).join('');
}
