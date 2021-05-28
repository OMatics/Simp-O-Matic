exports.description = "Abbreviates a series of words into an initialism/acronym.";
exports.options = [{
	name: "input",
	type: "STRING",
	description: "Series of words",
	required: true
}];

exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	const words = args.map(w => w.trim().capitalize());
	message.reply(words.map(w =>
		[...w].find(c =>
			isNaN(c as any)
				? c.toLowerCase() != c.toUpperCase()
				: c)
			|| '')
		.join('').toUpperCase() + ` (${words.join(' ')})`)
}
