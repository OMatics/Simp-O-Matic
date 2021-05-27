export default (homescope: HomeScope) => {
	const { message } = homescope;
	message.reply(Math.random() < 0.5 ? 'Heads!' : 'Tails!');
};
