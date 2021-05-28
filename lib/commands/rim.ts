import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Rim someones butthole!";
exports.options = [{
    name: "username",
    type: "USER",
    description: "*rim*",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;

	if(!message.options[0].user || message.user.id == message.options[0].user.id)
		return message.reply(
			"You rimmed yourself, bet that tasted soft and warm :stuck_out_tongue_closed_eyes:");

	Action.get(message);
};
