export default home_scope => {
	const { message, args } = home_scope;
	message.channel.send(args.join('👏'));
}