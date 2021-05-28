import { Message } from 'discord.js';
import Action from '../action';

exports.description = "Blow a kiss to someone you like!";
exports.options = [{
    name: "username",
    type: "USER",
    description: "Blow a kiss to someone you like!",
}];
exports.main = (home_scope: HomeScope) => {
	const { message }= home_scope;

	if(!message.options[0].user || message.user.id == message.options[0].user.id){
		return message.reply("You kissed your own hand. :face_with_hand_over_mouth:");
	}
	Action.get(message);
};
