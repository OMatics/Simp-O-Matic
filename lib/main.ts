// Don't exit immediately.
process.stdin.resume();

// Discord Bot API.
import { Discord, On, Client } from '@typeit/discord';
import { Message, MessageAttachment, TextChannel } from 'discord.js';

// System interaction modules.
import {
	readFileSync  as  read_file,
	writeFileSync as write_file,
	readdirSync   as  read_dir
} from 'fs';
import { execSync as shell } from 'child_process';

// Local misc/utility functions.
import './extensions';
import { deep_merge, pp, compile_match,
		 export_config, access, glue_strings,
		 deep_copy, recursive_regex_to_string } from './utils';

// Default bot configuration for a Guild, JSON.
import DEFAULT_GUILD_CONFIG from './default';

// API specific modules.
import web_search from './api/google';
import { pastebin_latest,
		 pastebin_update,
		 pastebin_url } from './api/pastebin';

// Anything that hasn't been defined in `bot.json`
//  will be taken care of by the defaults.
let GLOBAL_CONFIG : GlobalConfigType = {
	name: "Simp'O'Matic",
	tag: "#1634",
	permissions: 8,
	lang: 'en',

	guilds: {
		"337815809097465856": deep_copy(DEFAULT_GUILD_CONFIG)
	}
};

// Store secrets in an object, retrieved from shell's
//  environment variables.
const SECRETS = JSON.parse(shell('sh ./generate_secrets.sh').toString());

// Load HELP.md file, and split text smart-ly
//  (to fit within 2000 characters).
const [HELP_KEY, HELP, HELP_SOURCE] = read_file('./HELP.md')
	.toString().split('▬▬▬');

export const HELP_SECTIONS = HELP.toString()
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

export const KNOWN_COMMANDS = HELP_SECTIONS.map(e =>
	e.slice(5).replace(/(\s.*)|(`.*)/g, '').toLowerCase());

const GIT_URL = 'https://github.com/Demonstrandum/Simp-O-Matic';

// Log where __dirname and cwd are for deployment.
console.log('File/Execution locations:', {
	'__dirname': __dirname,
	'process.cwd()': process.cwd()
});

@Discord
export class SimpOMatic {
	private static _CLIENT : Client;
	private _COMMAND_HISTORY : Message[] = [];

	static start() {
		this._CLIENT = new Client();
		this._CLIENT.login(
			SECRETS.api.token,
			`${__dirname}/*Discord.ts`
		);
		console.log('Secrets:', pp(SECRETS));
		console.log('Known commands:', pp(KNOWN_COMMANDS));
	}

	expand_alias(operator: string, args: string[], message: Message) {
		const CONFIG = GLOBAL_CONFIG.guilds[message.guild.id];

		const expander = (unexpanded: string) => {
			let expansion = unexpanded;
			if (CONFIG.commands.aliases.hasOwnProperty(unexpanded))
				expansion = CONFIG.commands.aliases[unexpanded].trim().squeeze();

			const expanded_command_words = expansion.split(' ');
			if (expanded_command_words.length > 1) {
				// This means the alias has expanded to more than just one word.
				expansion = expanded_command_words.shift();
				expanded_command_words.reverse().each(e => args.unshift(e));
			}
			return expansion;
		};
		// Continue expanding until we have no more change.
		let i = 0;
		let expanded = expander(operator);
		while (expanded !== operator) {
			operator = expanded;
			expanded = expander(operator);
			if (i > 300) return 'CYCLIC_ALIAS';
			++i;
		}
		return expanded;
	}

	process_command(message : Message) {
		const CONFIG = GLOBAL_CONFIG.guilds[message.guild.id];

		if (message.content.startsWith('..')) return;

		const last_command = this._COMMAND_HISTORY.last();
		this._COMMAND_HISTORY.push(message);
		if (this._COMMAND_HISTORY.length > CONFIG.commands.max_history) {
			this._COMMAND_HISTORY.shift();
		}
		const current_command = this._COMMAND_HISTORY.last();

		// Try and slow the fellas down a little.
		if (!!last_command
			&& last_command.channel === current_command.channel
			&& last_command.author.id === current_command.author.id) {
			// Only give spam warning if commands are coming
			//  fast _in the same channel_.
			const delta = current_command.createdTimestamp - last_command.createdTimestamp;
			if (last_command.content === current_command.content
				&& delta <= 1400) {
				if (delta <= 400) return;
				return message.answer(`I can't help but notice you're running \
					the same commands over in rather rapid succession.
					Would you like to slow down a little?`.squeeze());
			}
			if (delta <= 900) {
				if (delta <= 300) return;
				return message.answer('Slow down there bucko.');
			}
		}

		const content = message.content.trim().squeeze();
		const words = content.tail().split(' ');
		const args = words.tail();

		let operator = words[0].toLowerCase();
		// Expansion of aliases will expand aliases used within
		//   the alias definition too. Yay.
		operator = this.expand_alias(operator, args, message);
		if (operator === 'CYCLIC_ALIAS') {
			message.reply('The command you just used has aliases that go'
				+ ' 300 levels deep, or the alias is cyclically dependant.'
				+ '\n**Fix this immediately.**');
			return;
		}
		operator = operator.toLowerCase();
		console.log('Received command:', [operator, args]);

		const homescope : HomeScope = {  // Basic 'home-scope' is passed in.
			message, args,
			HELP_SOURCE, HELP_KEY, GIT_URL,
			HELP_MESSAGES, HELP_SECTIONS, ALL_HELP,
			CONFIG, SECRETS, KNOWN_COMMANDS,
			expand_alias: this.expand_alias };

		const commands = read_dir(`${__dirname}/commands`)
			.map(n => n.slice(0, -3));
		if (commands.includes(operator))
			return import(`./commands/${operator}`).then(mod =>
				mod.default(homescope));

		switch (operator) {
			case 'commands': {
				const p = CONFIG.commands.prefix;
				const joined_commands = KNOWN_COMMANDS.slice(0, -1)
					.map(c => `\`${p}${c}\``)
					.join(', ');
				const final_command = `\`${p}${KNOWN_COMMANDS.last()}\``;
				message.reply(`All known commands (excluding aliases): \
					${joined_commands} and ${final_command}`.squeeze());
				break;
			} case 'export': {
				let export_string = export_config(GLOBAL_CONFIG, {});
				if (export_string.length > 1980) {
					export_string = export_config(GLOBAL_CONFIG, { ugly: true });
				}

				const today = (new Date())
					.toISOString()
					.replace(/\..*/, '')
					.split('T')
					.reverse()
					.join('_');

				const file_name = `export-${today}.json`;
				const file_dest = `${process.cwd()}/${file_name}`;
				write_file(file_dest, export_config(GLOBAL_CONFIG, {}));
				pastebin_update(export_config(GLOBAL_CONFIG, {}));

				if (export_string.length < 1980) {
					message.channel.send("```json\n" + export_string + "\n```");
				}
				const attach = new MessageAttachment(file_dest, file_name);
				message.channel.send("**Export:**", attach);

				message.answer(`A copy of this export (\`export-${today}.json\`) \
					has been saved to the local file system.
					Pastebin file: ${pastebin_url}`.squeeze());
				break;
			} case 'ls': {
			   const dirs = JSON.stringify({
					'__dirname': __dirname,
					'process.cwd()': process.cwd()
				});
				message.channel.send(`Directories:\n\`\`\`json\n${dirs}\n\`\`\``);
				break;
			} case '': {
				message.answer("That's an empty command...");
				break;
			} default: {
				if (KNOWN_COMMANDS.includes(operator)) {
					const p = CONFIG.commands.prefix;
					message.reply(`:scream: *gasp!* — The \`${p}${operator}\` \
						command has not been implemented yet. \
						Quick send a pull request! Just type in \
						\`${p}fork\`, and get started...`.squeeze());
					break;
				}
				message.answer(`
					:warning: ${CONFIG.commands.not_understood}.
					> \`${CONFIG.commands.prefix}${operator}\``.squeeze());
				break;
			}
		}
	}

	process_generic(message : Message) {
		const CONFIG = GLOBAL_CONFIG.guilds[message.guild.id];

		const { content } = message;
		if (!content) return; // Message with no content (deleted)...
		for (const responder of CONFIG.rules.respond) {
			if (!responder) continue; // Sparse arrays!
			const match = content.match(responder.match);
			const { response } = responder;
			if (match && response) message.answer(response);
		}
		for (const rejecter of CONFIG.rules.reject) {
			if (!rejecter) continue; // Sparse arrays!
			const match = content.match(rejecter.match);
			const { response } = rejecter;
			if (match) {
				if (response) message.answer(response);
				if (message.deletable) {
					message.delete();
					break;
				}
			}
		}
	}

	async last_message(opts) : Promise<string> {
		const CONFIG = GLOBAL_CONFIG.guilds[opts.guild.id];
		const channel = opts.channel as TextChannel;

		if (!opts.offset) opts.offset = 1;
		if (opts.mention) opts.mentioning = opts.mentioning.trim();

		if (opts.command) {
			let commands = this._COMMAND_HISTORY
				.filter(m => m.channel.id === channel.id);

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

		let filter = m => m.content;
		if (opts.mention)
			filter = m => m.content && m.author.toString() === opts.mentioning;
		const messages = await channel.messages.fetch({
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
						channel: message.channel,
						guild: message.guild
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
					mention, mentioning,
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
		const guild_id = message.guild.id;

		// Initialise completely new Guilds.
		if (!GLOBAL_CONFIG.guilds.hasOwnProperty(guild_id))
			GLOBAL_CONFIG.guilds[guild_id] = deep_copy(DEFAULT_GUILD_CONFIG);

		const CONFIG = GLOBAL_CONFIG.guilds[guild_id];
		// Ignore empty messages...
		if (!message.content) return;

		console.log('Message acknowledged.');
		console.log('Message from Guild ID:', guild_id);
		if (SimpOMatic._CLIENT.user.id === message.author.id) {
			return;
		}
		console.log('Message received:', message.content);

		try {
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
					console.log('Message type: command.');
					this.process_command(message);
				} else {
					console.log('Message type: generic.');
					this.process_generic(message);
				}
			});
		} catch (e) {
			console.warn(e);
			message.answer(`Something went very wrong (\`${e.message}\`):\n`
				+ `${e.stack}`.format('```'));
		}
	}
}

function on_termination() {
	// Back-up the resultant CONFIG to an external file.
	console.log('Cleaning up...');
	write_file(`${process.cwd()}/export-exit.json`, export_config(GLOBAL_CONFIG, {}));
	pastebin_update(export_config(GLOBAL_CONFIG, {}));
	// Make sure we saved ok.
	setTimeout(() => {
		console.log('Clean finished.');
		process.exit(0);
	}, 6000).unref();
}

// Handle exits.
process.on('exit',    on_termination);
process.on('SIGINT',  on_termination);
process.on('SIGTERM', on_termination);
process.on('SIGUSR1', on_termination);
process.on('SIGUSR2', on_termination);
process.on('uncaughtException', on_termination);

// CONFIG will eventually update to the online version.
pastebin_latest().then(res => {
	GLOBAL_CONFIG = deep_merge(GLOBAL_CONFIG, res);
	// Remove any duplicates.
	const gc_string = export_config(GLOBAL_CONFIG, { ugly: true });
	GLOBAL_CONFIG = JSON.parse(gc_string);
	// Precompile all regular-expressions in known places.
	for(const guild in GLOBAL_CONFIG.guilds)
		if (GLOBAL_CONFIG.guilds.hasOwnProperty(guild))
			['respond', 'reject', 'replace']
				.each(name =>
					GLOBAL_CONFIG.guilds[guild].rules[name]
						.mut_map(compile_match));

	// Start The Simp'O'Matic.
	SimpOMatic.start();
}).catch(console.warn);

