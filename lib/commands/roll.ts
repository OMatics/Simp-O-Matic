export default home_scope => {
	const { message, args } = home_scope;
	message.answer(Math.floor(Math.random() * ((+args[0] || 6) + 1)));
};
