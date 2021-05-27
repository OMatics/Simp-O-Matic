export default (homescope: HomeScope) => {
	const { message, args, CONFIG } = homescope;
	message.reply(args.length === 1
		? args[0].length === 1
			? `Command prefix changed to: \`${CONFIG.commands.prefix = args[0]}\`.`
			: 'You may only use a prefix that is exactly one character/symbol/grapheme/rune long.'
		: `Current command prefix is: \`${CONFIG.commands.prefix}\`.`);
};
