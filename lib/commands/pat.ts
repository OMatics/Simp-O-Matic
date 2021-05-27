import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { FORMATS } from '../extensions';

import Jimp from 'jimp';

const TEMPLATE = "./lib/resources/templates/pat.png";

export default (homescope: HomeScope) => {
	const { message, args } = homescope;

	if (args.length === 0 || message.mentions.users.size === 0) {
		message.channel.send(
			"Pat someone!\n" + ".pat [@user-name]".format(FORMATS.block)
		);
	}

	const size = 200;
	const [x, y] = [200, 108];
	const filename = "patted.png";

	const description =
		`${message.mentions.users.first().username}`.format(FORMATS.bold)
		+ ', you got a pat from '
		+ `${message.author.username}`.format(FORMATS.bold)
		+ ' :blush:';

	const pat = async (image: string) => {
		const template = await Jimp.read(TEMPLATE);
		const img = await Jimp.read(image);
		const composed = template.composite(
			img.resize(Jimp.AUTO, size), x, y,
			{
				mode: Jimp.BLEND_DESTINATION_OVER,
				opacityDest: 1,
				opacitySource: 1
			});

		composed.getBuffer(Jimp.MIME_PNG, (e : Error, buffer: Buffer) => {
			if (e?.message) {
				message.channel.send(
					`Unable to pat ${message.mentions.users.first().username} :(`
				);
				return;
			}

			const attachment = new MessageAttachment(buffer, filename);
			const embed = new MessageEmbed()
				.setColor('#b943e8')
				.setTitle("Incoming pat")
				.setDescription(description)
				.attachFiles([attachment])
				.setImage(`attachment://${filename}`);

			message.channel.send(embed);
		});
	};

	pat(message.mentions.users.first().avatarURL({ 'format': 'png' }));
};
