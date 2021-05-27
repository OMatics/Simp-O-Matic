export default (homescope: HomeScope) => {
	const { message } = homescope;
	message.channel.send(
		message.guild.emojis.cache.map(x => x.toString()).join(' ')
	);
};
