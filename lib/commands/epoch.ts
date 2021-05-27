export default (homescope: HomeScope) => {
	const { message } = homescope;
	const now = new Date();
	message.channel.send(`Local time relative to bot:
		${now.toString()} / ${now.toISOString().format('`')}
		${now.valueOf().toString().format('`')}`.squeeze());
};
