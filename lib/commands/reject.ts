export default home_scope => {
	const { message, args,
			CONFIG, KNOWN_COMMANDS,
			HELP_SECTIONS } = home_scope;
	const { reject }: { reject: any[] } = CONFIG.rules;
	console.log('reject command entered.');
	if (args.length === 0 || args[0] === 'ls') {
		console.log('listing commands...');
		// Make a pretty list.
		let str = "**Rejection Rules:**\n";
		reject.each((rule, i) => {
			str += `${i + 1}.  Matches: ${rule.match}`;
			if (rule.response)
				str += `\n    Responds with: ‘${rule.response}’`;
			str += '\n';
		});
		message.channel.send(str);
	} else if (args[0] === 'rm') {
		// Remove a rule.
		const match = args[1].match(/#?(\d+)/);
		if (!match || !match[1])
			return message.answer('Please provide a numerical index'
				+ ' as to which rule to remove.');

		const index = Number(match[1]) - 1;
		if (index >= reject.length)
			return message(`Cannot delete rule at index ${index + 1}...`
				+ ` There are only ${reject.length} rejection rules.`);

		message.answer(`Rule matching \`${reject[index].match}\``
			+ ` at index location #${index + 1} has been deleted.`);

		delete CONFIG.rules.reject[index];
	} else if (args.length >= 1) {
		// Add a rule.
		let regex, options, response;
		// Eat up the regex/word...
		if (args[0][0] === '/') { // Slash means we're looking at regex.
			// We look for a non escaped end slash.
			const phrase : string = args.join(' ').tail(); // Exclude the slash.

			let i = 0;
			do {
				if (phrase.slice(i, i + 2) === '\\/') i += 2; // escaped /.
				else if (phrase[i] === '/') break; // end of regex.
				if (i >= phrase.length) {
					message.answer('Having real trouble parsing that m8...');
					return;
				}
				else i += 1; // nothing interesting.
			} while (true);
			i += 1;

			regex = phrase.slice(0, i - 1); // Exclude the slash.
			const after = phrase.slice(i).trim();
			[options, response] = after
				.replace(/^([a-z]+)(.*)/, '$1-@@@-$2')
				.split('-@@@-').map(s => s.trim());
		} else { // Were looking at a single word.
			// If no regex is given to match, we'll instead match a word
			//  such that it will have to be matched on its own, not
			//  surrounded by other letters or numbers, OR, it may exits
			//  at the begging or end of the line.
			regex = `(^|[^\\p{L}\\p{N}])+${args[0]}?([^\\p{L}\\p{N}]|$)+`,
			options = 'ui';
			response = args.tail().join(' ').trim();
		}
		// Add the rule to the CONFIG.rules.
		CONFIG.rules.reject.push({
			match: options.length
				? new RegExp(regex, options)
				: new RegExp(regex),
			response: response.length ? response : null
		});
		message.channel.send(`Rule with regular expression matching:\n`
			+ `/${regex}/${options}`.format('```')
			+ `\nhas been added to the list of rejection rules.`);
	} else {
		message.answer('Insufficient or nonsensical arguments provided.');
		message.reply(`Here's how you use the command:\n`
			+ HELP_SECTIONS[KNOWN_COMMANDS.indexOf('reject')]);
	}
};
