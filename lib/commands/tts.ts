import * as cp from 'child_process';
import { VoiceConnection } from 'discord.js';

export default async (hs : HomeScope) => {
	const { message, args, INSTANCE_VARIABLES } = hs;

	if (!message.guild) {
		message.reply("Stop talking to yourself, loser.");
		return;
	}

	const guild = message.guild.id
	const GID = INSTANCE_VARIABLES.guilds[guild];

	if (!GID.vc) {
		message.reply("Let me join your voice-chat first.");
		return;
	} else if (GID.vc_dispatcher && GID.vc_current_stream) {
		GID.vc_dispatcher.pause();
		GID.vc_current_stream.pause();
	}

	const text = args.join(' ');

	// Generate speech.
	const child = cp.spawn('espeak', ['-s170', text, '--stdout'], {
		stdio: ['ignore', 'pipe', 'ignore']
	});
	const stream = child.stdout;

	const dispatcher = GID.vc.play(stream);

	dispatcher.on('finish', () => {
		child.kill();
		dispatcher.destroy();

		if (GID.vc_current_stream) {
			// THIS DOES NOT WORK.  I cannot seem to get the song to
			// resume (if there was a song playing).  I've tried
			// many ways, but someone else is going to have to figure
			// it out.
			GID.vc_current_stream.resume();
			GID.vc_dispatcher = GID.vc.play(GID.vc_current_stream);
			console.log("Resumed playback.");
		}

		console.log("Finished speaking.");
	});
};
