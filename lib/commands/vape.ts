export default (homescope: HomeScope) => {
	const { message, args } = homescope;
	message.channel.send(args.join('').split('').join(' '));
};
