import { TextChannel } from 'discord.js';
import * as cp from 'child_process';

const YTDL_OPTIONS = [
	'--audio-format', 'opus',
	'-i', '--no-continue', '-o', '-' // Send to STDOUT.
];

export default async (home_scope: HomeScope) => {
	const { message, args, CONFIG, CLIENT, INSTANCE_VARIABLES } = home_scope;

	if (!message.guild) {
		message.answer("Just use youtube-dl at home.");
		return;
	}

	const guild : string = message.guild.id;
	const GID : Types.GuildInstanceData = INSTANCE_VARIABLES.guilds[guild];

	if (!CONFIG.vc_queue) CONFIG.vc_queue = [];
	if (!GID.vc_prefetch) GID.vc_prefetch = {};

	const attempt_prefetch = (url: string): boolean => {
		let stream = null;
		try {
			const child = cp.spawn('youtube-dl', [...YTDL_OPTIONS, url], {
				stdio: ['ignore', 'pipe', 'pipe']
			});
			child.stdout.on('end', () => {
				child.stdout.pause();
				child.stderr.pause();
				child.kill();
			});
			child.on('close', async (code) => {
				if (code && code !== 0) {
					console.log(`Exited with code ${code}:`);
					console.log(await child.stderr.utf8());
					stream = null;
					child.stdout = null;
					GID.vc_prefetch[url] = null;
					CONFIG.vc_queue = CONFIG.vc_queue.filter(q => q !== url);
					message.answer("Error downloading media.");
				}
				child.kill();
			});
			stream = child.stdout;
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
			message.reply("Joined voice chat.");
		} else {
			message.reply("Join a voice channel first.");
		}
		break;
	} case "leave": {
		try {
			GID.vc.disconnect();
			GID.vc.channel.leave();
			message.answer("Let's listen again some time :3");
		} catch (error) {
			message.answer("```" + `${error}` + "```");
		}
		break;
	} case "stop":
	  case "pause": {
		if (GID.vc_dispatcher && !GID.vc_dispatcher.paused) {
			GID.vc_dispatcher.pause();
			message.answer("Paused playback.");
		} else {
			message.answer("Nothing is playing");
		}
		break;
	} case "resume":
	  case "play": {
		if (!GID.vc) {
			message.answer("Let me join a voice channel first.");
			return;
		}
		if (GID.vc_dispatcher && GID.vc_dispatcher.paused) {
			GID.vc_dispatcher.resume();
			message.answer("Resuming playback.");
			return;
		}

		if (CONFIG.vc_queue.length === 0) {
			message.answer("Please add a URL to the queue first.");
			return;
		}

		const set_event_listeners = () => {
			const end_handler = () => {
				console.log('VC dispatcher finished.')
				GID.vc_dispatcher.destroy();
				if (CONFIG.vc_queue.length === 0) {
					CLIENT.channels.fetch(CONFIG.vc_channel)
						.then((ch: TextChannel) =>
							ch.send("Media queue ended."));
					return;
				}
				const next = CONFIG.vc_queue.shift();
				const stream = GID.vc_prefetch[next];
				GID.vc_current_stream = stream;
				GID.vc_dispatcher = GID.vc.play(stream);
				set_event_listeners();

				CLIENT.channels.fetch(CONFIG.vc_channel)
					.then((ch: TextChannel) =>
						ch.send(`Now playing: ${next}`));
			};

			GID.vc_dispatcher.on('error', e => {
				console.error(`Dispatcher error (${e}):\n${e.stack}`);
				CLIENT.channels
					.fetch(CONFIG.vc_channel).then((ch: TextChannel) =>
						ch.send(`Got error during playback: \`${e}\``));
			});
			GID.vc_dispatcher.on('finish', end_handler);
			GID.vc_current_stream.on('end', () => {
				console.log('VC stream ended.');
				CLIENT.channels.fetch(CONFIG.vc_channel)
					.then((ch: TextChannel) =>
						ch.send("Stream ended."));
				GID.vc_dispatcher.end();
			});
		};

		const stream = GID.vc_prefetch[CONFIG.vc_queue.shift()];
		GID.vc_current_stream = stream;
		GID.vc_dispatcher = GID.vc.play(stream);
		message.channel.send("Playing media from queue...");
		set_event_listeners();

		break;
	} case "rm":
	  case "remove":
	  case "d":
	  case "delete": {
		const pos = Number(args[1]);
		CONFIG.vc_queue.splice(pos - 1, 1);
		message.answer(`Removed media from queue at index ${pos}.`);
		break;
	} case "insert":
	  case "i": {
		const pos = Number(args[1]);
		const url = args[2];
		if (attempt_prefetch(url)) {
			CONFIG.vc_queue.splice(pos - 1, 0, url);
			message.answer(`Inserting into queue at index ${pos}.`);
		}
		break;
	} case "queue":
	  case "list":
	  case "ls": {
		message.answer(ls(CONFIG.vc_queue));
		break;
	} case "clear":
	  case "requeue": {
		CONFIG.vc_queue = [];
		GID.vc_current_stream = null;
		message.answer("Queue cleared");
		GID.vc_dispatcher.end();
		break;
	} case "next":
	  case "skip": {
		GID.vc_dispatcher.end();
		GID.vc_current_stream.destroy();
		message.answer("Skipping...");
		break;
	} default: {
		const url = args[0];
		if (attempt_prefetch(url)) {
			CONFIG.vc_queue.push(url);
			message.answer("Adding media to queue...");
		}
	}
	}
}

function ls(queue : string[]) {  // TODO: This could be more sophisticated.
	return "Queue size: " + queue.length
		+ queue.map((e, i) => `\n ${i + 1}. ${e}`).join('');
}
