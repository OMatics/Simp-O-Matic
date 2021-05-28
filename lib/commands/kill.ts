import { MessageAttachment } from 'discord.js';
import Action from '../action';

exports.description = "Kill someone.";
exports.options = [{
    name: "username",
    type: "USER",
    description: "KILL",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	
	const attached = new MessageAttachment(
			'https://img2.gelbooru.com/images/12/86/1286caaa436406cc4e283e8fd0277a74.png', 
			'suicide.png');
			
	if(!message.options[0].user || message.user.id == message.options[0].user.id){
		message.reply("You killed yourself.");
		message.channel.send(attached);
	} else{
		Action.get(message);
	}
};
