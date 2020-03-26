export default (home_scope: HomeScope) => {
	const { message } = home_scope;
	const now = new Date();
	message.channel.send(`Local time relative to bot:
		${now.toString()} / ${now.toISOString().format('`')}
		${now.valueOf().toString().format('`')}`.squeeze());
};
