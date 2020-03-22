export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.channel.send(args.join('').split('').join(' '));
};
