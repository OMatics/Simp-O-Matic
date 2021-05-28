import oed_lookup from '../api/oxford';
import format_oed from '../format_oed';  // O.E.D. JSON entry to markdown.

exports.description = "Looks a word up in the Oxford English Dictionary.";
exports.options = [{
    name: "word",
    type: "STRING",
    description: "Looks a word up in the Oxford English Dictionary.",
    required: true
}];

exports.main = (home_scope : HomeScope) => {
	const { message, args,
			CONFIG, SECRETS } = home_scope;

	message.reply('Looking in the Oxford English Dictionary...');
	const query = args.join(' ');

	const p = CONFIG.commands.prefix;
	const nasty_editReply = `Your word (‘${query}’) is nonsense, either \
					that or they've forgotten to index it.
					I'll let you decide.

					P.S. Try the _Urban Dictionary_ \
					(\`${p}urban ${query}\`)`.squeeze();

	oed_lookup({
		word: query,
		lang: 'en',
		id: SECRETS.oxford.id,
		key: SECRETS.oxford.key
	}).then(res => {
		if (!res['results']
			|| res['results'].length === 0
			|| !res['results'][0].lexicalEntries
			|| res['results'][0].lexicalEntries.length === 0
			|| res['results'][0].lexicalEntries[0].entries.length === 0
			|| res['results'][0].lexicalEntries[0].entries[0].senses.length === 0) {
			message.editReply(nasty_editReply);
			return;
		}
		// Format the dictionary entry as a string.
		const msg = format_oed(res, message);

		if (msg.length >= 2000) { // This should be rare (try defining `run').
			let part_msg = "";
			// This assumes no two lines would ever
			//   amount to more than 2000 characters.
			for (const line of msg.split(/\n/g))
				if (part_msg.length + line.length >= 2000) {
					message.editReply(part_msg);
					part_msg = line + '\n';
				} else { part_msg += line + '\n'; }
			// Send what's left over, and not >2000 characters.
			message.editReply(part_msg);

			return;
		}
		message.editReply(msg);
	}).catch(e => {
		if (e.status === 404) {
			message.editReply(`That 404'd.  ${nasty_editReply}`);
		} else {
			message.editReply(`Error getting definition:\n${e}`);
		}
	});
}
