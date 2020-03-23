import { help_info } from '../utils';

export default (home_scope : HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	if (args.length === 0 || args[0] === 'help'
	|| message.mentions.users.size === 0)
		return message.reply(help_info('summon', CONFIG.commands.prefix));

	message.client.users.fetch(message.mentions.users.first().id)
		.then(user => user.send(
			`Psssst. Hey, come over to ${message.guild.name} :point_left:\n`
			+ `(${message.member.user.tag} is trying to summon you).`))
		.catch(err => {
			message.channel.send(err);
		});
};
