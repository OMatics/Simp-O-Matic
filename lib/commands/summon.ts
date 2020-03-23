import { FORMATS } from '../extensions';

export default (home_scope : HomeScope) => {
	const { message, args } = home_scope;

	if (args.length === 0 || args[0] === 'help'
		|| message.mentions.users.size == 0) {
		message.answer(
			"Poke someone and I'll summon them over here!\n"
				.format(FORMATS.italics) +
			".summon [@user-name]"
				.format(FORMATS.block)
		);
		return;
	}

	message.client.fetchUser(message.mentions.users.first().id)
		.then(user => {
			user.send(
				`Psssst. Hey, come over to ${message.guild.name} :point-left:`
			)
	});
};
