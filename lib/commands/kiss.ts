import { MessageEmbed } from 'discord.js';
import { FORMATS } from '.././extensions';

export default home_scope => {
    const { message, args } = home_scope;

    if (args.length === 0 || message.mentions.users.size === 0) {
        message.channel.send("You kissed your own hand. :face_with_hand_over_mouth:");
        return;
    }

    let author = message.author.username; 
    let to = message.mentions.users.first().username;

    const embed = new MessageEmbed()
        .setColor('#ba3d8a')
        .setTitle('Some title')
        .setDescription(`${to.format(FORMATS.bold)}, you got a kissu from ${author.format(FORMATS.bold)}! :flushed:`)
        .setImage('https://i.imgur.com/lz1BY2x.gif')

    message.channel.send(embed);
};
