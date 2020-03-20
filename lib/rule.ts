import { glue_strings } from './utils';

export const rule = (rule_kind: string) => home_scope => {
	const { message, args,
		CONFIG, KNOWN_COMMANDS,
		HELP_SECTIONS } = home_scope;
	const rules_array = CONFIG.rules[rule_kind];

	if (args.length === 0 || args[0] === 'ls') {
		// Make a pretty list.
		let str = `**${rule_kind.capitalize()} Rules:**\n`;
		if (rules_array.squeeze().length === 0)
			str += "There are none.";

		rules_array.each((entry, i) => {
			str += `${i + 1}.  Matches: \`${entry.match}\``;
			if (entry.response)
				str += `\n     Responds with: ‘${entry.response.shorten()}’`;
			str += '\n';
		});
		for (const msg of glue_strings(str.lines()))
			message.channel.send(msg);
	} else if (args[0] === 'rm') {
		// Remove a rule.
		const match = args[1].match(/#?(\d+)/);
		if (!match || !match[1])
			return message.answer('Please provide a numerical index'
				+ ' as to which rule to remove.');

		const index = Number(match[1]) - 1;
		if (index >= rules_array.length)
			return message(`Cannot delete rule at index ${index + 1}...`
				+ ` There are only ${rules_array.length} ${rule_kind} rules.`);

		message.answer(`Rule matching \`${rules_array[index].match}\``
			+ ` at index location number ${index + 1} has been deleted.`);

		delete CONFIG.rules[rule_kind][index];
	} else if (args.length >= 1) {
		// Add a rule.
		let regex, options, response;
		// Eat up the regex/word...
		if (args[0][0] === '/') { // Slash means we're looking at regex.
			// We look for a non escaped end slash.
			const phrase: string = args.join(' ').tail(); // Exclude the slash.

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
			const after = phrase.slice(i);
			if (after[0] === ' ') {
				options = '';
				response = after.tail();
			} else {
				[options, response] = after
					.replace(/^([a-z]+)(.*)/, '$1-@@@-$2')
					.split('-@@@-').map(s => s.trim());
			}
		} else { // Were looking at a single word.
			// If no regex is given to match, we'll instead match a word
			//  such that it will have to be matched on its own, not
			//  surrounded by other letters or numbers, OR, it may exits
			//  at the begging or end of the line.
			regex = `(^|[^\\p{L}\\p{N}])+${args[0]}s?([^\\p{L}\\p{N}]|$)+`,
				options = 'ui';
			response = args.tail().join(' ').trim();
		}
		// Add the rule to the CONFIG.rules.
		try {
			CONFIG.rules[rule_kind].push({
				match: options.length
					? new RegExp(regex, options)
					: new RegExp(regex),
				response: response.length ? response : null
			});
		} catch (e) {
			message.answer('**Error** creating regular expression!\n'
				+ e.message.toString().format('`'));
			return;
		}
		message.channel.send(`Rule with regular expression matching:\n`
			+ `/${regex}/${options}`.format('```')
			+ `\nhas been added to the list of ${rule_kind} rules.`);
	} else {
		message.answer('Insufficient or nonsensical arguments provided.');
		message.reply(`Here's how you use the command:\n`
			+ HELP_SECTIONS[KNOWN_COMMANDS.indexOf(rule_kind)]);
	}
};
