import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Rape someone.";
exports.options = [{
    name: "username",
    type: "USER",
    description: "RAPE",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;

	if(!message.options[0].user || message.user.id == message.options[0].user.id)
		return message.reply(
			"You fisted yourself. :point_right: :ok_hand:");

	Action.get(message);
};
