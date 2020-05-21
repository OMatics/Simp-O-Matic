export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	const a = args.length
		? args.join(' ').split(/\s*(?:,|\bor\b)\s*/gi)
		: [ 'I need a list.' ];
	message.answer(a[Math.floor(Math.random() * a.length)]);
};
