export default (homescope: HomeScope) => {
	const { message, args } = homescope;

	const reply = args.join(' ').trim();
	if (reply.length === 0) return;
	message.channel.send(reply);
};
