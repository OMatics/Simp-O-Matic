export default home_scope => {
	const { message, args } = home_scope;
	const a = args.join(' ').split(/\s*(?:,|or)\s*/);
	message.answer(a[Math.floor(Math.random() * a.length)]);
};
