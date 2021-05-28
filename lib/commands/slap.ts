import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Slap someone hard in the face!";
exports.options = [{
    name: "username",
    type: "USER",
    description: "Slap someone hard in the face!",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;

	if(!message.options[0].user || message.user.id == message.options[0].user.id)
		return message.reply(
			"You slapped yourself in the face. :hand_splayed:");

	Action.get(message);
};
