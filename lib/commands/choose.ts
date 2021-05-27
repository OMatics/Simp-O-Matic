export default (homescope: HomeScope) => {
	const { message, args } = homescope;
	const a = args.length
		? args.join(' ').split(/\s*(?:,|\bor\b)\s*/gi)
		: [ 'I need a list.' ];
	message.reply(a[Math.floor(Math.random() * a.length)]);
};
