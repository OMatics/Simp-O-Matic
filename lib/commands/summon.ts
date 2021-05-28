import { help_info } from '../utils';

exports.description = "Summon someone to the server by making the bot poke them in their DMs about it.";
exports.options = [{
    name: "username",
    type: "USER",
    description: "[user-name]",
    required: true
}];
exports.main = (home_scope : HomeScope) => {
	const { message, CONFIG } = home_scope;
	message.client.users.fetch(message.options[0].user.id)
		.then(user => user.send(
			`Psssst. Hey, come over to ${message.guild.name} :point_left:\n`
			+ `(${message.member.user.tag} is trying to summon you).`))
		.catch(err => {
			message.reply(err);
		});
	message.reply("summonning...", {ephemeral: true});
};