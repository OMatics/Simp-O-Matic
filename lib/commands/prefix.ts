export default home_scope => {
	const { message, args, CONFIG } = home_scope;
	message.answer(args.length === 1
		? args[0].length === 1
			? `Command prefix changed to: \`${CONFIG.commands.prefix = args[0]}\`.`
			: 'You may only use a prefix that is exactly one character/symbol/grapheme/rune long.'
		: `Current command prefix is: \`${CONFIG.commands.prefix}\`.`);
};
