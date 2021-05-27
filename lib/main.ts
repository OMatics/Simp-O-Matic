// Don't exit immediately.
process.stdin.resume();

// Discord Bot API.
import { Discord, On, Client } from '@typeit/discord';
import { Message,
		 MessageAttachment,
		 MessageEmbed,
		 VoiceConnection,
		 StreamDispatcher,
		 TextChannel } from 'discord.js';

// System interaction modules.
import {
	readFileSync  as  read_file,
	writeFileSync as write_file,
	readdirSync   as  read_dir
} from 'fs';
import { execSync as shell, exec } from 'child_process';

// Local misc/utility functions.
import './extensions';
import { deep_merge, pp, compile_match,
		 export_config, access, glue_strings,
		 deep_copy, recursive_regex_to_string,
		 jsonblob_pull, timestamp } from './utils';

// Default bot configuration for a Guild, JSON.
import DEFAULT_GUILD_CONFIG from './default';

// API specific modules.
import * as JSONBlob from './api/jsonblob';
import { Guild } from 'discord.js';
import { Timer } from './commands/cron';

// Global instance variables
const INSTANCE_VARIABLES = {
	guilds: {}
}

const PACKAGE = JSON.parse(read_file('./package.json').toString());
export const VERSION = PACKAGE['version'] || "0.0.0";

// Anything that hasn't been defined in `bot.json`
//  will be taken care of by the defaults.
let GLOBAL_CONFIG : Types.GlobalConfig = {
	name: "Simp'O'Matic",
	tag: "#1634",
	version: VERSION,
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

const WELCOME_MESSAGES = [
	"Welcome USER_NAME, what brings you to these parts?"
];

const FAREWELL_MESSAGES = [
	"See you later alligator, USER_TAG...",
	"Bye USER_TAG, we won't miss you."
];

// Log where __dirname and cwd are for deployment.
console.log('File/Execution locations:', {
	'__dirname': __dirname,
	'process.cwd()': process.cwd()
});

const system_message = async (client: Client, msg: any) => {
	for (const guild in GLOBAL_CONFIG.guilds)
		if (GLOBAL_CONFIG.guilds.hasOwnProperty(guild)
			&& GLOBAL_CONFIG.guilds[guild].system_channel
			&& client !== null)
			client.channels
				.fetch(GLOBAL_CONFIG.guilds[guild].system_channel)
				.then((c: TextChannel) =>
					c.send(msg));
};

import server from './web';

// Load drug-o-matic 'sub-bot'
import CommandSystem from 'DoseBot-Redux/command-system';
const Drugs = CommandSystem()
Drugs.load(() => {
  console.log('`drug` command system loaded.');
});

@Discord
export class SimpOMatic {
	private static _CLIENT : Client;
	private _COMMAND_HISTORY : Message[] = [];

	static init_guild(guild: Guild) {
		const guild_id = guild.id;
		// Set default configuration.
		GLOBAL_CONFIG.guilds[guild_id] = deep_copy(DEFAULT_GUILD_CONFIG);
		INSTANCE_VARIABLES.guilds[guild_id] = {};
		// Set system-messages and main channels to some default.
		const default_channel = guild.channels.cache.find(channel =>
			channel.permissionsFor(guild.me).has("SEND_MESSAGES"));

		if (default_channel) {
			GLOBAL_CONFIG.guilds[guild_id].main_channel
				= GLOBAL_CONFIG.guilds[guild_id].system_channel
				= default_channel.id;
		}
	}

	static start() {
		const client = this._CLIENT = new Client();
		const logged_in = client.login(
			SECRETS.api.token,
			`${__dirname}/*Discord.ts`
		);
		logged_in.then(() => console.log('Bot logged in.'));
		client.on('ready', () => this.events());

		// Clone local `.git'.
		exec('./clone_nocheckout.sh', {
			cwd: process.cwd()
		});

		return this._CLIENT;
	}

	static events() {
		console.log('Bloated software ready to do work!');

		const client = this._CLIENT;
		system_message(client, "**We're back online baby!**");
		client.on('guildCreate', guild => {
			if (!GLOBAL_CONFIG.guilds.hasOwnProperty(guild.id))
				this.init_guild(guild);
			// TODO:
			// Ask them to set a main channel and system channel via commands.
			// Ask them to read !help and !commands and !aliases.
			// etc.
		});
		client.on('guildMemberAdd', member => {
			const guild_id = member.guild.id;
			const main_channel = GLOBAL_CONFIG.guilds[guild_id].main_channel;
			if (main_channel) {
				const channel = member.guild.channels.cache.find(c =>
					c.id === main_channel) as TextChannel;
				if (channel && channel.send)
					// Greet member.
					channel.send(WELCOME_MESSAGES
						.choose()
						.replace('USER_NAME', member.user.toString()));
			}
		});
		client.on('guildMemberRemove', member => {
			const guild_id = member.guild.id;
			const main_channel = GLOBAL_CONFIG.guilds[guild_id].main_channel;
			if (main_channel) {
				const channel = member.guild.channels.cache.find(c =>
					c.id === main_channel) as TextChannel;
				if (channel && channel.send)
					// Wave goodbye to member.
					channel.send(FAREWELL_MESSAGES
						.choose()
						.replace('USER_TAG', member.nickname
							|| member.user.tag.split('#').first()));
			}
		});

		for (const guild in GLOBAL_CONFIG.guilds)
			if (GLOBAL_CONFIG.guilds.hasOwnProperty(guild))
				INSTANCE_VARIABLES.guilds[guild] = {};


		// TODO: In web-server, check for correct secret.
		// Send messages on web-hooks.
		server(GLOBAL_CONFIG, body => {
			if (body.ref === "refs/heads/master" || body.action) {
				const embed = new MessageEmbed()
					.setColor("#ef88c5")
					.setURL(body.repository.html_url)
					.setThumbnail("https://raw.githubusercontent.com/Demonstrandum/Simp-O-Matic/master/lib/resources/banners/banner-notext.png")
					.setAuthor(body.sender.login, body.sender.avatar_url);

				// New commit.
				if (body.head_commit) {
					const push_embed = embed
						.setTitle("Latest Commit")
						.setDescription(body.head_commit.message)
						.setURL(body.head_commit.url);

					system_message(client, push_embed);
				// Star Added.
				} else if (body.starred_at) {
					const star_embed = embed
						.setTitle("Star Added!");
					system_message(client, star_embed);
				// Pull Request.
				} else if (body.pull_request) {
					const pr = body.pull_request;
					const pull_embed = embed
						.setTitle("Pull Request")
						.setURL(pr.url)
						.setDescription(`“${pr.title}” (**#${pr.number}**)`
							+ ` was ${body.action}.`);
				}
			} else if (body.ref) {
				// Ignore this.
				console.log("Non-master related git event.");
			} else if (body.console === true) {
				if (body.secret !== process.env["WEB_SECRET"]) {
					return;
				}
				const send_message = (msg: string, guild?) => {
					if (guild
					&& GLOBAL_CONFIG.guilds.hasOwnProperty(guild)
					&& GLOBAL_CONFIG.guilds[guild].system_channel) {
						client.channels
							.fetch(GLOBAL_CONFIG.guilds[guild].system_channel)
							.then((c: TextChannel) => c.send(msg));
					} else if (guild) {
						console.log(`Guild: '${guild}', does not exist.`);
					} else {
						system_message(client, msg);
					}
				}
				if (body.message) {
					send_message(body.message, body.guild);
				} else if (body.command) {
					// TODO?
				}
			} else {
				// For now, this won't be silent.
				system_message(client, "Received unknown data:\n```json\n"
					+ JSON.dump(body, null, 4).slice(0, 1930)
					+ "```");
			}
		});
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
		return expanded.toLowerCase();
	}

	process_command(message : Message, ignore_spam: boolean = false) {
		console.log('[command] Processing.');
		const CONFIG = GLOBAL_CONFIG.guilds[message.guild.id];

		if (message.content.startsWith('..')) return;

		if  (CONFIG.whitelistchannels
		&&   CONFIG.whitelistchannels.length > 0
		&&  !CONFIG.whitelistchannels.includes(message.channel.id))
			return;

		console.log('[command] Whitelisted.');

		const last_command = this._COMMAND_HISTORY.last();
		this._COMMAND_HISTORY.push(message);
		if (this._COMMAND_HISTORY.length > CONFIG.commands.max_history) {
			this._COMMAND_HISTORY.shift();
		}
		const current_command = this._COMMAND_HISTORY.last();

		if (!ignore_spam) {
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
					return message.reply(`I can't help but notice you're running \
the same commands over in rather rapid succession.
Would you like to slow down a little?`.squeeze());
				}
				if (delta <= 900) {
					if (delta <= 300) return;
					return message.reply('Slow down there bucko.');
				}
			}
		}

		console.log('[command] Not spam.');

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
			console.log('[command] Aliases cyclic. Aborting.');
			return;
		}

		operator = operator.toLowerCase();
		console.log('Received command:', [operator, args]);
		CONFIG.stats = CONFIG.stats || <Types.Stats>{};
		CONFIG.stats.commands = CONFIG.stats.commands || {};
		CONFIG.stats.commands[operator] =
			++CONFIG.stats.commands[operator] || 1;

		const homescope : HomeScope = {  // Basic 'home-scope' is passed in.
			message, args,
			HELP_SOURCE, HELP_KEY, GIT_URL,
			HELP_MESSAGES, HELP_SECTIONS, ALL_HELP,
			CONFIG, SECRETS, KNOWN_COMMANDS,
			expand_alias: this.expand_alias,
			CLIENT: SimpOMatic._CLIENT, VERSION,
			main: this, INSTANCE_VARIABLES, Drugs
		};

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

				const today = timestamp();
				const file_name = `export-${today}.json`;
				const file_dest = `${process.cwd()}/${file_name}`;
				write_file(file_dest, export_config(GLOBAL_CONFIG, {}));
				JSONBlob.update(export_config(GLOBAL_CONFIG, {}));

				if (export_string.length < 1980) {
					message.channel.send("```json\n" + export_string + "\n```");
				}
				const attach = new MessageAttachment(file_dest, file_name);
				message.channel.send("**Export:**", attach);

				message.reply(`A copy of this export (\`export-${today}.json\`)`
					+ ` has been saved to the local file system.`);
				break;
			} case 'refresh': {
				message.reply('Pulling JSON blob...');
				jsonblob_pull(GLOBAL_CONFIG).then((res: Types.GlobalConfig) => {
					GLOBAL_CONFIG = res;
					message.reply('Dynamic configuration refresh succeded.');
				}).catch(e => {
					message.reply('Could not update from JSON blob:\n```'
						+ e.toString() + '```');
				});
				break;
			} case 'ls': {
			   const dirs = JSON.dump({
					'__dirname': __dirname,
					'process.cwd()': process.cwd()
				});
				message.channel.send(`Directories:\n\`\`\`json\n${dirs}\n\`\`\``);
				break;
			} case '': {
				message.reply("That's an empty command...");
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

				const has_punct = CONFIG.commands.not_understood.punctuation();
				message.reply(`
					:warning: ${CONFIG.commands.not_understood}${has_punct?'':'.'}
					> \`${CONFIG.commands.prefix}${operator}\``.squeeze());
				break;
			}
		}
	}

	process_generic(message : Message) {
		const CONFIG = GLOBAL_CONFIG.guilds[message.guild.id];

		const { content } = message;  // Original content.
		if (!content) return; // Message with no content (deleted)...
		for (const responder of CONFIG.rules.respond) {
			if (!responder) continue; // Sparse arrays!
			const match = content.match(responder.match);
			const { response } = responder;

			if (responder.listens
			&& responder.listens.length > 0
			&& !responder.listens.includes(message.author.id))
				continue;

			if (match && response) message.reply(response);
		}
		for (const triggerer of CONFIG.rules.trigger) {
			if (!triggerer) continue; // Sparse arrays!
			const match = content.match(triggerer.match);
			const { response } = triggerer;

			if (triggerer.listens
				&& triggerer.listens.length > 0
				&& !triggerer.listens.includes(message.author.id))
				continue;

			if (match && response) {
				const p = CONFIG.commands.prefix;
				message.content = `${p}${response}`;
				// Send it back as a command.
				this.on_message(message, SimpOMatic._CLIENT);
			}
		}
		for (const rejecter of CONFIG.rules.reject) {
			if (!rejecter) continue; // Sparse arrays!
			const match = content.match(rejecter.match);
			const { response } = rejecter;

			if (rejecter.listens
				&& rejecter.listens.length > 0
				&& !rejecter.listens.includes(message.author.id))
				continue;

			if (match) {
				if (response) message.reply(response);
				if (message.deletable) {
					message.delete();
					break;
				}
			}
		}
	}

	async last_message(opts) : Promise<string> {
		const channel = opts.channel as TextChannel;
		const CONFIG = GLOBAL_CONFIG.guilds[channel.guild.id];

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
			.replace(/(!![@\^]?[\^@]?\d*)/g, '@EXP$1@EXP')
			.replace(/(\s)/g, '@EXP$1@EXP')
			.split('@EXP').squeeze();

		for (let i = 0; i < expansions.length; ++i) {
			if (expansions[i].startsWith('!!')) {
				if (expansions[i].length === 2) {  // !! expansion
					expansions[i] = await this.last_message({
						command: true,
						channel: message.channel,
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
					channel: message.channel,
				});
			}
		}

		// TODO: Deal with 'EXPANSION_ERROR's in `expansions`.

		return expansions.join('');
	}

	@On("message")
	async on_message(message : Message, client : Client, ignore_spam=false) {
		const guild_id = message.guild.id;

		// Initialise completely new Guilds.
		if (!GLOBAL_CONFIG.guilds.hasOwnProperty(guild_id))
			SimpOMatic.init_guild(message.guild);

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
					message.reply("The expansion for that message was"
					+ " over 2000 characters, what the fuck is wrong with you?");
					return;
				}
				message.content = content;
				console.log('Expanded message:', message.content);

				if (message.content[0] === CONFIG.commands.prefix) {
					console.log('Message type: command.');
					this.process_command(message, ignore_spam);
				} else {
					console.log('Message type: generic.');
					this.process_generic(message);
				}
			});
		} catch (e) {
			console.warn(e);
			message.reply(`Something went very wrong (\`${e.message}\`):\n`
				+ `${e.stack}`.format('```'));
		}
	}
}

let CLIENT: Client = null;

let term_count = 0;

function on_termination(error_type, e?: Error) {
	if (term_count > 15) return;
	term_count += 1;
	// Back-up the resultant CONFIG to an external file.
	console.warn(`Received ${error_type}, shutting down.`);
	if (e) console.warn(e);
	// Message all system channels.
	console.log('Sending system messages.');
	system_message(CLIENT,
		`Bot got \`${error_type}\` signal.\n`
		+ `**Shutting down...**`);

	const exported = export_config(GLOBAL_CONFIG, {});

	write_file(`${process.cwd()}/export-exit.json`, exported);
	write_file(`${process.cwd()}/export-${timestamp()}.json`, exported);

	JSONBlob.update(exported)
		.then(_ => {
			console.log('Finished JSONBlob update.');
			system_message(CLIENT, `Current configuration saved.`);
		}).catch(e => {
			console.warn('JSONBlob not saved!', e);
			system_message(CLIENT, `Could not export configuration.\n${e}`);
		});

	// Make sure we saved ok.
	setTimeout(() => {
		console.log('Clean finished.');
		process.exit(0);
	}, 7000);  // If we haven't exited in 7s, just exit anyway.
}

// Handle exits.
const global_this = this;
process
	.on('beforeExit', on_termination.bind(this, 'beforeExit'))
	.on('exit',       on_termination.bind(this, 'exit'))
	.on('SIGTERM',    on_termination.bind(this, 'SIGTERM'))
	.on('SIGINT',     on_termination.bind(this, 'SIGINT'))
	.on('SIGUSR1',    on_termination.bind(this, 'SIGUSR1'))
	.on('SIGUSR2',    on_termination.bind(this, 'SIGUSR2'))
	.on('uncaughtException', e =>
		on_termination.bind(global_this, 'exception', e));

process.on('uncaughtException', (e) => e);

// GLOBAL_CONFIG will eventually update to the online version.
jsonblob_pull(GLOBAL_CONFIG).then((res: Types.GlobalConfig) => {
	GLOBAL_CONFIG = res;
	// Start The Simp'O'Matic.
	CLIENT = SimpOMatic.start();
}).catch(console.warn);
