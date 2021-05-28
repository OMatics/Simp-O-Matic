exports.description = "Ask a question, receive a response.";
exports.options = [{
	name: "question",
	type: "STRING",
	description: "Ask a question, receive a response.",
	required: true
}];

import { prefix_friendly, help_info } from '../utils';

exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;

	const responses: string[] = [
		"Perhaps.",
		"Yep.",
		"Nope.",
		"For sure.",
		"Maybe, maybe not.",
		"As I see it, yes.",
		"Ask again later.",
		"Better not tell you now.",
		"Cannot predict now.",
		"Concentrate and ask again.",
		"Don’t count on it.",
		"It is certain.",
		"It is decidedly so.",
		"Most likely.",
		"My reply is no.",
		"My sources say no.",
		"Outlook not so good.",
		"Outlook good.",
		"Reply hazy, try again.",
		"Signs point to yes.",
		"Very doubtful.",
		"Without a doubt.",
		"Yes.",
		"Yes – definitely.",
		"You may rely on it.",
		"1%",
		"50%",
		"100%"
	];

	message.reply(":8ball: "
		+ responses[Math.floor(Math.random() * responses.length)]);
};
