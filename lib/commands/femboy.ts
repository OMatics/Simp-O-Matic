import { prefix_friendly, help_info } from '../utils';

export default (home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	if (args.length === 0 || args[0] === 'help') {
		message.channel.send(help_info('femboy', CONFIG.commands.prefix));
		return;
	}

	const responses: string[] = [
		"I am going to fuck you so hard (cums).",
		"I will put my cock inside of your asshole (moans).",
        "I want your tongue inside of me teehee.",
        "Please let me your bottom bby boy haha.",
        "Spread it open for me owo.",
        "Please kiss me =3.",
        "I really want to fuck you :3.",
        "My bussy is ready and unlubed hehe.",
        "My boy pussy really hurts from your dick uwu.",

	];

	message.answer(":uwu: "
		+ responses[Math.floor(Math.random() * responses.length)]);
};
