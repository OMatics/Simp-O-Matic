export default home_scope => {
	const { message, args } = home_scope,
	a = args.join(' ').split(',');
	message.answer(a[Math.floor(Math.random() * a.length)]);
}
