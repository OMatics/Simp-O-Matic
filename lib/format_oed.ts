import { Attachment } from 'discord.js';
import { pp } from './utils';

// Mmm... spaghetti...
export default (res, message) => {
	let msg = `Definition for ‘${res.word}’, yielded:\n`;
	let has_sent_audio = false;

	const lex_entries = res['results'][0].lexicalEntries;
	let entry_n = 1;
	for (const lex_entry of lex_entries) {
		if (lex_entries.length > 1) {
			msg += `\nLexical Entry №${entry_n}:\n`
			entry_n += 1;
		}
		console.log('Lex entry:', pp(lex_entries))
		for (const entry of Object.values(lex_entry.entries)) {
			const senses = entry['senses'];

			for (const sense of Object.values(senses) as any) {
				let sense_msg = "";
				if (!!sense.definitions && sense.definitions.length > 0) {
					for (const definition
						of Object.values(sense.definitions) as any) {
						sense_msg += `    Defined as (${lex_entry.lexicalCategory.text.toLowerCase()}):\n>         ${definition.capitalize()}\n`;
					}
				}
				if (!!sense.synonyms && sense.synonyms.length > 0) {
					const synonyms = sense.synonyms
						.map(s => `‘${s.text}’`)
						.join(', ');
					sense_msg += `    Synonyms include: ${synonyms}\n`;
				}
				if (sense_msg.trim().length > 0) {
					msg += "\nIn the sense:\n"
					msg += sense_msg;
				}
			}
			const etys = entry['etymologies'];
			if (!!etys && etys.length > 0) {
				msg += '\nEtymology:\n    ';
				msg += etys.join(';\n    ');
				msg += '\n';
			}
		}
		if (!!lex_entry.pronunciations && !has_sent_audio) {
			const prons = Object.values(lex_entry.pronunciations) as any;
			if (!!prons && prons.length > 0) {
				msg += "\nPronunciations:\n"
				for (const pron of prons) {
					if (!!pron.dialects) {
						const dialects = Object.values(pron.dialects);
						msg += `    Dialects of ${dialects.join(', ')}:\n`;
					}
					msg += `        ${pron.phoneticNotation}: [${pron.phoneticSpelling}]\n`;
					if (pron.audioFile) {
						msg += `        Audio file: ${pron.audioFile}\n`;
						has_sent_audio = !has_sent_audio;
						const attach = new Attachment(
							pron.audioFile,
							pron.audioFile.split('/').slice(-1)[0]
						);
						message.channel.send('', attach);
					}
				}
			}
		}
	}
	console.log('Became:', msg);
	return msg;
}
