// Don't exit immediately.
process.stdin.resume();

// Discord Bot API.
import { Discord, On, Client } from '@typeit/discord';
import { Message, Attachment, TextChannel } from 'discord.js';

// System interaction modules.
import {
	readFileSync  as  read_file,
	writeFileSync as write_file,
	readdirSync as readdirSync
} from 'fs';
import { execSync as shell } from 'child_process';

// Local misc/utility functions.
import './extensions';
import { deep_merge, pp, compile_match,
		 export_config, access, glue_strings } from './utils';
import format_oed from './format_oed';  // O.E.D. JSON entry to markdown.

// Default bot configuration JSON.
import DEFAULT_CONFIG from './default';

// API specific modules.
import web_search from './api/google';
import oed_lookup from './api/oxford';
import urban_search from './api/urban';
import yt_search from './api/yt_scrape';
import { pastebin_latest,
		 pastebin_update,
		 pastebin_url } from './api/pastebin';

// Anything that hasn't been defined in `bot.json`
//  will be taken care of by the defaults.
const CONFIG = deep_merge(
	DEFAULT_CONFIG,
	JSON.parse(read_file('./bot.json', 'utf-8')));

// CONFIG will eventually update to the online version.
pastebin_latest().then(res =>
	deep_merge(CONFIG, res)).catch(console.log);

// Precompile all regular-expressions in known places.
['respond', 'reject', 'replace']
	.each(name => CONFIG.rules[name].mut_map(compile_match))

// Store secrets in an object, retrieved from shell's
//  environment variables.
const SECRETS = JSON.parse(shell('sh ./generate_secrets.sh').toString());

// Load HELP.md file, and split text smart-ly
//  (to fit within 2000 characters).
const [HELP_KEY, HELP, HELP_SOURCE] = read_file('./HELP.md')
	.toString().split('▬▬▬');

const HELP_SECTIONS = HELP.toString()
	.replace(/\n  -/g, '\n      \u25b8')
	.replace(/\n- /g, '@@@\n\u2b25 ')
	.split('@@@')
	.filter(e => !!e && !!e.trim());


// This assumes no two help-entries would ever
//  be greater than 2000 characters long
const HELP_MESSAGES = glue_strings(HELP_SECTIONS);
const ALL_HELP = glue_strings([
	HELP_KEY,
	'\n▬▬▬\n', ...HELP_MESSAGES,
	'\n▬▬▬\n', HELP_SOURCE
]);

const KNOWN_COMMANDS = HELP_SECTIONS.map(e =>
	e.slice(5).replace(/(\s.*)|(`.*)/g, ''));

const GIT_URL = 'https://github.com/Demonstrandum/Simp-O-Matic';

// Log where __dirname and cwd are for deployment.
console.log('File/Execution locations:', {
	'__dirname': __dirname,
	'process.cwd()': process.cwd()
});

@Discord
export class SimpOMatic {
	private static _client : Client;
	private _COMMAND_HISTORY : Message[] = [];

	constructor() {
		console.log('Secrets:', pp(SECRETS));
		console.log('Configured Variables:', pp(CONFIG));
		console.log('Known commands:', pp(KNOWN_COMMANDS));
	}

	static start() {
		this._client = new Client();
		this._client.login(
			SECRETS.api.token,
			`${__dirname}/*Discord.ts`
		);
	}

	process_command(message : Message) {
		const last_command = this._COMMAND_HISTORY.last();
		this._COMMAND_HISTORY.push(message);
		if (this._COMMAND_HISTORY.length > CONFIG.commands.max_history) {
			this._COMMAND_HISTORY.shift();
		}
		const current_command = this._COMMAND_HISTORY.last();

		// Try and slow the fellas down a little.
		if (last_command.channel === current_command.channel) {
			// Only give spam warning if commands are coming
			//  fast _in the same channel_.
			const delta = current_command.createdTimestamp - last_command.createdTimestamp;
			if (last_command.content === current_command.content
				&& delta <= 1400) {
				if (delta <= 400) return;
				return message.answer(`I can't help but notice you're running \
					the same commands over in rather rapid succession.
					Would you like to slow down a little?`.squeeze())
			}
			if (delta <= 900) {
				if (delta <= 300) return;
				return message.answer('Slow down there bucko.');
			}
		}

		const content = message.content.trim().squeeze();
		const words = content.tail().split(' ');
		const args = words.tail();

		let command = words[0].toLowerCase();
		if (CONFIG.commands.aliases.hasOwnProperty(command))
			command = CONFIG.commands.aliases[command].trim().squeeze();

		const expanded_command_words = command.split(' ');
		if (expanded_command_words.length > 1) {
			// This means the alias has expanded to more than just one word.
			command = expanded_command_words.shift();
			expanded_command_words.each(e => args.unshift(e));
		}

		command = command.toLowerCase();
		console.log('Received command:', [command, args]);

		var functions = readdirSync('funcs').map(n => n.slice(0, -3))
		if(functions[command])
			require('./funcs/' + functions[command] + '.js')(message, args, SECRETS, CONFIG)
		
		switch (command) {
			case 'commands': {
				const p = CONFIG.commands.prefix;
				const joined_commands = KNOWN_COMMANDS.slice(0, -1)
					.map(c => `\`${p}${c}\``)
					.join(', ');
				const last_command = `\`${p}${KNOWN_COMMANDS.last()}\``;
				message.reply(`All known commands (excluding aliases): \
					${joined_commands} and ${last_command}`.squeeze());
				break;
			} case 'id': {
				if (args[0]) {
					const matches = args[0].match(/<@!?(\d+)>/)
					if (!matches) {
						message.answer(`Please tag a user, or \
							provide no argument(s) at all.  See \`!help id\``
							.squeeze());
					} else {
						message.answer(`User ID: \`${matches[1]}\``);
					}
					break;
				}
				const reply = `User ID: \`${message.author.id}\`
					Author: ${message.author}
					Message ID: \`${message.id}\``.squeeze();
				console.log(`Replied: ${reply}`);
				message.answer(reply);
				break;
			} case 'get': {
				if (args.length === 0) {
					message.answer('To view the entire object, use the `!export` command.');
					break;
				}
				// Accessing invalid fields will be caught.
				try {
					const accessors = args[0].trim().split('.').squeeze();
					const resolution = access(CONFIG, accessors);
					message.channel.send(` ⇒ \`${resolution}\``);
				} catch (e) {
					message.channel.send(`Invalid object access-path\n`
						+ `Problem: \`\`\`\n${e}\n\`\`\``);
				}
				break;
			} case 'set': {
				if (args.length < 2) {
					message.answer('Please provide two arguments.\nSee `!help set`.');
					break;
				}
				try {
					const accessors = args[0].trim().split('.').squeeze();
					const parent = accessors.pop();
					const obj = access(CONFIG, accessors);
					obj[parent] = JSON.parse(args[1]);

					message.channel.send(`Assignment successful.
						\`${args[0].trim()} = ${obj[parent]}\``.squeeze());
				} catch (e) {
					message.channel.send(`Invalid object access-path,`
						+ `nothing set.\nProblem: \`\`\`\n${e}\n\`\`\``);
				}
				break;
			} case 'alias': {
				const p = CONFIG.commands.prefix;

				if (args.length === 0 || args[0] === 'ls') {
					const lines = Object.keys(CONFIG.commands.aliases)
						.map((e, i) => `${i + 1}.  \`${p}${e}\` ↦ \`${p}${CONFIG.commands.aliases[e]}\``);
					message.answer('List of **Aliases**:\n')
					message.channel.send('**KEY:  `Alias` ↦ `Command it maps to`**\n\n'
					 + lines.join('\n'));
					break;
				}

				// Parse `!alias rm` command.
				if (args[0] === 'rm' && args.length > 1) {
					const aliases = CONFIG.commands.aliases;
					const keys = Object.keys(aliases);
					let match, index, alias;
					if (match = args[1].match(/^#?(\d+)/)) {
						index = Number(match[1]) - 1;
						if (index >= keys.length) {
							message.answer('No alias exists at such an index'
							 + ` (there are only ${keys.length} indices).`);
							break;
						}
						alias = keys[index];
						keys.each((_, i) => i === index
							? delete aliases[alias]
							: null);
					} else {
						alias = args[1];
						if (alias[0] === '!') alias = alias.tail();
						index = keys.indexOf(alias);
						if (index === -1) {
							message.answer(`There does not exist any alias \
								with the name \`${p}${alias}\`.`.squeeze());
							break;
						}
						keys.each((a, _) => a === alias
							? delete alias[alias]
							: null);
					}
					message.answer(`Alias \`${p}${alias}\` at index \
						number ${index + 1}, has been deleted.`.squeeze());
					break;
				}

				// Check last:
				if (args.length > 1) {  // Actually aliasing something.
					args[0] = args[0].trim();
					args[1] = args[1].trim();

					if (args[0][0] === CONFIG.commands.prefix)
						args[0] = args[0].tail();

					if (args[1][0] === CONFIG.commands.prefix)
						args[1] = args[1].tail();

					CONFIG.commands.aliases[args[0]] = args.tail().join(' ');
					message.channel.send(
						'**Alias added:**\n >>> ' +
						`\`${p}${args[0]}\` now maps to \`${p}${args.tail().join(' ')}\``);
				} else {
					if (args.length === 1) {
						if (args[0] in CONFIG.commands.aliases) {
							const aliases = Object.keys(CONFIG.commands.aliases);
							const n = aliases.indexOf(args[0]) + 1;
							message.answer(`${n}.  \`${p}${args[0]}\` ↦ \`${p}${CONFIG.commands.aliases[args[0]]}\``);
							break;
						} else {
							message.answer('No such alias found.');
							break;
						}
					}
					message.answer('Invalid number of arguments to alias,\n'
						+ 'Please see `!help alias`.');
				}
				break;
			} case 'prefix': {
				if (args.length == 1) {
					if (args[0].length !== 1) {
						message.answer(`You may only use a prefix that is
							exactly one character/symbol/grapheme/rune long.`
							.squeeze());
						break;
					}
					CONFIG.commands.prefix = args[0];
					message.answer(`Command prefix changed to: \`${CONFIG.commands.prefix}\`.`);
					break;
				}
				message.answer(`Current command prefix is: \`${CONFIG.commands.prefix}\`.`);
				break;
			} case 'ignore': {
				// Man alive, someone else do this please.
				break;
			} case 'response': {
				// TODO
				break
			} case 'search': {
				const query = args.join(' ').toLowerCase();

				web_search({
					kind: 'web',
					query,
					key: SECRETS.google.api_key,
					id: SECRETS.google.search_id
				}).then((res) => message.answer(res))
				  .catch(e => message.answer(e));
				break;
			} case 'image': {
				const query = args.join(' ').toLowerCase();

				web_search({
					kind: 'image',
					query,
					key: SECRETS.google.api_key,
					id: SECRETS.google.search_id
				}).then(res => message.answer(res))
				  .catch(er => message.answer(er));
				break;
			} case 'youtube': {
				const query = args.join(' ');
				yt_search({ query })
					.then(message.reply.bind(message))
					.catch(message.answer.bind(message));
				break;
			} case 'define': {
				message.answer('Looking in the Oxford English Dictionary...');
				const query = args.join(' ');

				const nasty_reply = `Your word (‘${query}’) is nonsense, either \
					that or they've forgotten to index it.
					I'll let you decide.

					P.S. Try the _Urban Dictionary_ \
					(\`!urban ${query}\`)`.squeeze();

				oed_lookup({
					word: query,
					lang: CONFIG.lang,
					id: SECRETS.oxford.id,
					key: SECRETS.oxford.key
				}).then(res => {
					console.log('Dictionary response:', pp(res));
					if (!res['results']
						|| res['results'].length == 0
						|| !res['results'][0].lexicalEntries
						|| res['results'][0].lexicalEntries.length == 0
						|| res['results'][0].lexicalEntries[0].entries.length == 0
						|| res['results'][0].lexicalEntries[0].entries[0].senses.length == 0) {
						message.answer(nasty_reply);
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
								message.channel.send(part_msg);
								part_msg = line + '\n';
							} else { part_msg += line + '\n' }
						// Send what's left over, and not >2000 characters.
						message.channel.send(part_msg);

						return;
					}
					message.channel.send(msg);
				}).catch(e => {
					if (e.status == 404) {
						message.channel.send(`That 404'd.  ${nasty_reply}`);
					} else {
						message.channel.send(`Error getting definition:\n${e}`);
					}
				});
				break;
			} case 'urban': {
				const query = args.join(' ');
				message.answer('Searching Urban Dictionary...');
				urban_search({ query, key: SECRETS.rapid.key }).then(res => {
					if (res['list'].length === 0) {
						message.channel.send(`Congratulations, not even Urban \
						Dictionary knows what you're trying to say.`.squeeze());
						return;
					}
					const entry = res['list'][0];
					const def = entry.definition.replace(/\[|\]/g, '');

					message.channel.send(`**Urban Dictionary** defines \
						‘${query}’, as:\n>>> ${def.trim()}`.squeeze());

					let example = entry.example;
					if (!!example || example.length > 0) {
						example = example.replace(/\[|\]/g, '');
						message.channel.send(`\n**Example**:\n>>> ${example.trim()}`);
					}
					message.channel.send(`Link: ${entry.permalink}`);
				}).catch(e => message.answer(`Error fetching definition:\n${e}`));
				break;
			} case 'milkies': {
				message.answer(`${(4 + Math.random() * 15).round_to(3)} gallons \
					of milkies have been deposited in your mouth.`.squeeze());
				break;
			} case 'ily': {
				message.answer('Y-you too...');
				break;
			} case 'say': {
				message.answer(`Me-sa says: “${args.join(' ')}”`);
				break;
			} case 'invite': {
				message.answer('Invite link: https://discordapp.com/api/oauth2/authorize?client_id=684895962212204748&permissions=8&scope=bot');
				break;
			} case 'export': {
				let export_string = export_config(CONFIG, {});
				if (export_string.length > 1980) {
					export_string = export_config(CONFIG, { ugly: true });
				}

				const today = (new Date())
					.toISOString()
					.replace(/\..*/, '')
					.split('T')
					.reverse()
					.join('_');

				const file_name = `export-${today}.json`
				const file_dest = `${process.cwd()}/${file_name}`;
				write_file(file_dest, export_config(CONFIG, {}));
				pastebin_update(export_config(CONFIG, {}));

				if (export_string.length < 1980) {
					message.channel.send("```json\n" + export_string + "\n```");
				}
				const attach = new Attachment(file_dest, file_name);
				message.channel.send("**Export:**", attach);

				message.answer(`A copy of this export (\`export-${today}.json\`) \
					has been saved to the local file system.
					Pastebin file: ${pastebin_url}`.squeeze());
				break;
			} case 'ls': {
			   const dirs = {
					'__dirname': __dirname,
					'process.cwd()': process.cwd()
				};
				message.channel.send(`Directories:\n\`\`\`json\n${dirs}\n\`\`\``);
				break;
			} case 'github': {
				message.answer(`${GIT_URL}/`);
				break;
			} case 'fork': {
				message.answer(`${GIT_URL}/fork`)
				break;
			} case 'issue': {
				message.answer(`${GIT_URL}/issues`)
				break;
			} case '': {
				message.answer("That's an empty command...");
				break;
			} default: {
				if (KNOWN_COMMANDS.includes(command)) {
					const p = CONFIG.commands.prefix;
					message.reply(`:scream: *gasp!* — The \`${p}${command}\` \
						command has not been implemented yet. \
						Quick send a pull request! Just type in \
						\`${p}fork\`, and get started...`.squeeze());
					break;
				}
				message.answer(`
					:warning: ${CONFIG.commands.not_understood}.
					> \`${CONFIG.commands.prefix}${command}\``.squeeze());
				break;
			}
		}
	}

	process_generic(message : Message) {
		const { content } = message;
		if (content.includes('bot'))
			message.answer("The hell you sayn' about bots?");
		// TODO: Process _rules_ appropriately.
	}

	async last_message(opts) : Promise<string> {
		const channel = opts.channel as TextChannel;

		if (!opts.offset) opts.offset = 1;
		if (opts.mention) opts.mentioning = opts.mentioning.trim();

		if (opts.command) {
			let commands = this._COMMAND_HISTORY
				.filter(m => m.channel.id === channel.id)

			if (opts.mention) commands = commands.filter(m =>
				m.author.toString() === opts.mentioning);

			const command = commands.last(opts.offset - 1);
			if (!command) {
				channel.send('Cannot expand, no such'
					+ ' command exists in history.');
				return Promise.reject('COMMAND_NOT_IN_HISTORY');
			}
			return Promise.resolve(command.content);
		}

		let filter = _ => true;
		if (opts.mention)
			filter = m => m.author.toString() === opts.mentioning;

		const messages = await channel.fetchMessages({
			limit: CONFIG.commands.max_history
		});
		// Remember that the _latest_ message, is the one that
		//  the user has _just_ sent. This means we ignore the first message.
		return messages.array()
			.filter(filter)
			.get(opts.offset).content;
	}

	async expand(message : Message) : Promise<string> {
		// History expansion with !!, !!@, !!^@, !!<ordinal>, etc.
		const expansions = message.content
			.replace(/(!!@?\^?\d*)/g, '@EXP$1@EXP')
			.replace(/(\s)/g, '@EXP$1@EXP')
			.split('@EXP').squeeze();

		for (let i = 0; i < expansions.length; ++i) {
			if (expansions[i].startsWith('!!')) {
				if (expansions[i].length === 2) {  // !! expansion
					expansions[i] = await this.last_message({
						command: true,
						channel: message.channel
					});
					continue;
				}

				const [opts, offset] = expansions[i].slice(2)
					.replace(/(\d+)/, '#$1')
					.split('#');

				const mention = opts.includes('@');
				const mentioning = expansions[i + 2];
				if (mention) expansions[i + 2] = '';

				expansions[i] = await this.last_message({
					command: !opts.includes('^'),
					mention: mention,
					mentioning: mentioning,
					offset: offset || 1,
					channel: message.channel
				});
			}
		}

		// TODO: Deal with 'EXPANSION_ERROR's in `expansions`.

		return expansions.join('');
	}

	@On("message")
	async on_message(message : Message, client : Client) {
		console.log('Message acknowledged.');
		if (SimpOMatic._client.user.id === message.author.id) {
			return;
		}
		console.log('Message received:', message.content);

		const trimmed = message.content.trim();
		message.content = trimmed;
		// When finished expanding...
		this.expand(message).then(content => {
			if (content.length >= 2000) {
				message.answer("The expansion for that message was"
				+ " over 2000 characters, what the fuck is wrong with you?");
				return;
			}
			message.content = content;
			console.log('Expanded message:', message.content);

			if (message.content[0] === CONFIG.commands.prefix) {
				console.log('Message type: command.')
				this.process_command(message);
			} else {
				console.log('Message type: generic.')
				this.process_generic(message);
			}
		});
	}
}

const on_termination = () => {
	// Back-up the resultant CONFIG to an external file.
	console.log('Cleaning up...');
	write_file(`${process.cwd()}/export-exit.json`, export_config(CONFIG, {}));
	pastebin_update(export_config(CONFIG, {}));
	// Make sure we saved ok.
	new Promise(res => setTimeout(() => {
		res(null)
		console.log('Clean finished.');
		process.exit(0)
	}, 6000));
};

// Start The Simp'O'Matic.
SimpOMatic.start();

// Handle exits.
process.on('exit',    on_termination);
process.on('SIGINT',  on_termination);
process.on('SIGUSR1', on_termination);
process.on('SIGUSR2', on_termination);
process.on('uncaughtException', on_termination);
