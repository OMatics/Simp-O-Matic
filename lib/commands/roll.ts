export default (homescope: HomeScope) => {
	const { message, args } = homescope;
	message.reply(Math.floor(Math.random() * ((+args[0] || 6) + 1)));
};
