import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { FORMATS } from '../extensions';

import Jimp from 'jimp';

const TEMPLATE = "./lib/resources/templates/pat.png";

exports.description = "Give someone a pat on the head.";
exports.options = [{
    name: "user",
    type: "USER",
    description: "*pats*",
    required: true
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;

	const size = 200;
	const [x, y] = [200, 108];
	const filename = "patted.png";

	const description =
		`${message.options[0].user.username}`.format(FORMATS.bold)
		+ ', you got a pat from '
		+ `${message.user.username}`.format(FORMATS.bold)
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
				message.reply(
					`Unable to pat ${message.options[0].user.username.username} :(`
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

			message.reply(embed);
		});
	};

	pat(message.mentions.users.first().avatarURL({ 'format': 'png' }));
};
