import { readFileSync as read_file } from 'fs';
import path from 'path';

import git from 'nodegit';

import { FORMATS } from '../extensions';
import { glue_strings } from '../utils';

const GIT_DIR = path.resolve(process.cwd(), "./.git");

type Authors = Record<string, number>;

const file_authors = async (filename: string): Promise<Authors> => {
	const authors = <Authors>{};

	const repo = await git.Repository.open(GIT_DIR);
	const blame = await git.Blame.file(repo, filename, ['p']);
	
	for (let i = 0; i < blame.getHunkCount(); i++) {
		// Hunk has bad type signatures, someone should tell `nodegit'.
		const hunk: any = blame.getHunkByIndex(i);
		const oid = hunk.finalCommitId();
		const commit = await repo.getCommit(oid);
		const name = commit.author().name();
			
		if (authors.hasOwnProperty(name)) authors[name] += 1;
		else                              authors[name]  = 1;
	}

	return authors;
};


export default async (homescope : HomeScope) => {
	const { message, args, CONFIG } = homescope;
	const p = CONFIG.commands.prefix;
	
	if (args.length < 1)
		return message.answer('Please provide a command to introspect.');
	
	const command = args[0].startsWith(p) ? args[0].tail() : args[0];

	if (command.match(/\//g))
		return message.answer("No paths allowed...");

	const expansion = CONFIG.commands.aliases[command];
	if (expansion) return message.channel.send(`\`${p}${command}\``
		+ `is an alias that expands to \`${p}${expansion}\`.`);

	const filename = `lib/commands/${command}.ts`;
	
	try {
		const source = read_file(`${process.cwd()}/${filename}`)
			.toString();
		const authors = await file_authors(filename);
		const author_str = "\n**Author(s)**: " + Object.keys(authors)
			.map(author => `(\`${authors[author]}\`) ${author}`)
			.join(', ');

		const msg = `Source code for \`${p}${command}\`:\n`;
		
		const msg_len = [msg, source, author_str]
			.reduce((acc, s) => acc + s.length, 0);

		if (msg_len > 1990) {
			const chunks = glue_strings(source.split(/^/m), 1950);

			message.channel.send(msg);
			for (const chunk of chunks)
				message.channel.send(
					chunk.format(FORMATS.code_block, 'typescript'));
			message.channel.send(author_str);
		} else {
			message.channel.send(msg
				+ source.format(FORMATS.code_block, 'typescript')
				+ author_str);
		}
	} catch (error) {
		console.log(`Error in code.ts: ${error}`);
		message.answer(`Source for \`${p}${command}\``
			+ ` (\`${process.cwd()}/${filename}\`), was not found.`);
	}
};
