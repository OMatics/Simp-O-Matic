import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Give someone a lickety lick!";
exports.options = [{
    name: "username",
    type: "USER",
    description: "Give someone a lickety lick!",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;

	if(!message.options[0].user || message.user.id == message.options[0].user.id)
		return message.reply(
			"You licked your own hand... Tastes salty :yum:");

	Action.get(message);
};
