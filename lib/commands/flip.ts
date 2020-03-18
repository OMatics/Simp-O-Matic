export default home_scope => {
	const { message } = home_scope;
	message.answer(Math.random() < 0.5 ? 'Heads!' : 'Tails!');
};
