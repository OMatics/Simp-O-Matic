export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;

	const reply = args.join(' ').trim();
	if (reply.length === 0) return;
	message.channel.send(reply);
};
