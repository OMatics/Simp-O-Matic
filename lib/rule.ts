import { glue_strings, help_info } from './utils';

export const rule = (rule_kind: string) => (home_scope: HomeScope) => {
	const { message, CONFIG } = home_scope;
	const presentation = message.guild.commands.resolve(CONFIG.appcmd[rule_kind]);
	const rules_array = CONFIG.rules[rule_kind];

	if (message.options[0].name == "rm"){
		delete CONFIG.rules[rule_kind][message.options[0].options[0].value];
	}

	if (message.options[0].name = "add") {
		// Add a rule.
		let regex, options, response;
		// Eat up the regex/word...
		if (message.options[0].options[0].value[0] === '/') { // Slash means we're looking at regex.
			// We look for a non escaped end slash.
			const phrase: string = message.options[0].options[0].value; // Exclude the slash.

			let i = 0;
			do {
				if (phrase.slice(i, i + 2) === '\\/') i += 2; // escaped /.
				else if (phrase[i] === '/') break; // end of regex.
				if (i >= phrase.length) {
					message.reply('Having real trouble parsing that m8...');
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
			regex = `(^|[^\\p{L}\\p{N}])+${message.options[0].options[0].value}s?([^\\p{L}\\p{N}]|$)+`,
				options = 'ui';
		}
		response = message.options[0].options[1].value;
		const p = CONFIG.commands.prefix;
		if (response.startsWith(p) && rule_kind === 'trigger') {
			response = response.slice(p.length);
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
			message.reply('**Error** creating regular expression!\n'
				+ e.message.toString().format('`'));
			return;
		}
		message.reply(`Rule with regular expression matching:\n`
			+ `/${regex}/${options}`.format('```')
			+ `\nhas been added to the list of ${rule_kind} rules.`);
	} else {
		message.reply('Insufficient or nonsensical arguments provided.');
		message.webhook.send(`Here's how you use the command:\n`
			+ help_info(rule_kind, CONFIG.commands.prefix));
	}

	presentation.options[1].options[0].choices = rules_array.map((entry, i) => {
		return {
			name: i + `.  Matches: \`${entry.match}\`` + entry.response ? `     Responds with: ‘${entry.response.shorten()}` : "",
			value: i
		}
	});

	message.guild.commands.edit(CONFIG.appcmd[rule_kind], presentation);

};
