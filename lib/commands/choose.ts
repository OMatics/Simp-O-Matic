export default home_scope => {
	const { message, args } = home_scope;
	const a = args.length
		? args.join(' ').split(/\s*(?:,|or)\s*/)
		: ['I need a list.'];
	message.answer(a[Math.floor(Math.random() * a.length)]);
};
