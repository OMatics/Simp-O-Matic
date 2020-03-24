export default (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.channel.send(
		message.guild.emojis.cache.map(x => x.name.emojify).join(' ')
	);
};
