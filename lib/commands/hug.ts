import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Give someone a warm hug!";
exports.options = [{
    name: "username",
    type: "USER",
    description: "You can't hug yourself :(",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	if(!message.options[0].user || message.user.id == message.options[0].user.id)
		return message.reply("You can't hug yourself :(");
	Action.get(message);
};