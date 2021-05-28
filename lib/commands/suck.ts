import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Suck on someones fingers uwu...";
exports.options = [{
    name: "username",
    type: "USER",
    description: "Suck on someones fingers uwu...",
}];
exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;

	if(!message.options[0].user || message.user.id == message.options[0].user.id)
		return message.reply(
			"You sucked on your own finger :sweat_drops:");

	Action.get(message);
};
