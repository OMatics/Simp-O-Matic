exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.reply(args.join(' ').trim());
};
