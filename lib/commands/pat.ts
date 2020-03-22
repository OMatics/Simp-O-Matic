import { Message, Attachment, RichEmbed } from 'discord.js';
import { FORMATS } from '../extensions';

import Jimp from 'jimp';

const TEMPLATE = "./lib/resources/pat-template.png";

interface Scope {
    message: Message;
    args: any;
}

export default (home_scope: Scope) => {
	const { message, args } = home_scope;

    if (args.length == 0) {
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

            const attachment = new Attachment(buffer, filename);
			const embed = new RichEmbed()
				.setColor('#b943e8')
                .setTitle("Incoming pat")
				.setDescription(description)
                .attachFile(attachment)
				.setImage(`attachment://${filename}`);

            message.channel.send(embed);
        });
    };

    pat(message.mentions.users.first().avatarURL);
};
