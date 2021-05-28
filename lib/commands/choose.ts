exports.description = "Choose randomly from a list of items, separated by commas.";
exports.options = [{
	name: "csv",
	type: "STRING",
	description: "Comma-separated value.",
	required: true
}];

exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	const a = args.length
		? args.join(' ').split(/\s*(?:,|\bor\b)\s*/gi)
		: [ 'I need a list.' ];
	message.reply(a[Math.floor(Math.random() * a.length)]);
};
