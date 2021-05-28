import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Purr at someone!";
exports.options = [{
    name: "username",
    type: "USER",
    description: "*purr*",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;

	if(!message.options[0].user || message.user.id == message.options[0].user.id)
		return message.reply(
			"You're purringgggggg, good kitten! :cat:");

	Action.get(message);
};
