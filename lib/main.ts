import { Discord, On, Client } from '@typeit/discord';
import { Message, MessageAttachment } from 'discord.js';

import {
    readFileSync  as  read_file,
    writeFileSync as write_file,
} from 'fs';
import { execSync as shell } from 'child_process';
import { inspect } from 'util';

import './extensions';
import { deep_merge, pp, compile_match, export_config } from './utils';
import DEFAULT_CONFIG from './default';
import web_search from './api/web';
import urban_search from './api/urban';

// Anything that hasn't been defined in `bot.json`
//  will be taken care of by the defaults.
const CONFIG = deep_merge(
    DEFAULT_CONFIG,
    JSON.parse(read_file('./bot.json', 'utf-8')));

// Precompile all regular-expressions in known places.
['respond', 'reject', 'replace']
    .forEach(name => CONFIG.rules[name].mut_map(compile_match))

// Store secrets in an object, retrieved from shell's
//  environment variables.
const SECRETS = JSON.parse(shell('sh ./generate_secrets.sh').toString());

// Load HELP.md file, and split text smart-ly
//  (to fit within 2000 characters).
const HELP = read_file('./HELP.md');
const help_sections = HELP.toString()
    .replace(/\n  -/g, '\n      \u25b8')
    .replace(/\n- /g, '@@@\n\u2b25 ')
    .split('@@@');

let acc = "";
let new_messages = [];

for (const msg of help_sections)
    if (acc.length + msg.length >= 1990) {
        new_messages.push(acc);
        acc = "";
    } else { acc += msg; }

new_messages.push(acc);
const HELP_MESSAGES = new_messages;

console.log(HELP_MESSAGES);

@Discord
export class SimpOMatic {
    private static _client : Client;

    constructor() {
        console.log('Secrets:', pp(SECRETS));
        console.log('Configured Variables:', pp(CONFIG));
    }

    static start() {
        this._client = new Client();
        this._client.login(
            SECRETS.api.token,
            `${__dirname}/*Discord.ts`
        );
    }

    process_command(message : Message) {
        const words = message.content.slice(1).split(' ');

        let command = words[0];
        if (CONFIG.commands.aliases.hasOwnProperty(command))
            command = CONFIG.commands.aliases[command];
        command = command.toLowerCase();

        const args = words.slice(1);

        console.log('Received command: ', [command, args]);

        switch (command) {
            case "ping": {
                message.reply("PONGGERS!");
                break;
            } case 'help': {
                message.reply('**HELP:**');
                for (const msg of HELP_MESSAGES)
                    message.channel.send(msg);
                break;
            } case "id": {
                const reply = `User ID: ${message.author.id}
                    Author: ${message.author}
                    Message ID: ${message.id}`.squeeze();
                console.log(`Replied: ${reply}`);
                message.reply(reply);
                break;
            } case "search": {
                const query = args.join(' ');

                web_search({
                    type: "search",
                    query,
                    key: SECRETS.rapid.key
                }).then((res: object) => {
                    if (res['value'].length === 0) {
                        message.reply('No such results found.');
                        return;
                    }
                    message.reply(`Web search for ‘${query}’, found: ${res['value'][0].url}`);
                }).catch(e => message.reply(`Error fetching results:\n${e}`));
                break;
            } case "image": {
                const query = args.join(' ');

                web_search({
                    type: "image",
                    query,
                    key: SECRETS.rapid.key
                }).then(res => {
                    if (res['value'].length === 0) {
                        message.reply('No such images found.');
                        return;
                    }
                    message.reply(`Image found for ‘${query}’: ${res['value'][0].url}`);
                }).catch(e =>
                    message.reply(`Error fetching image:\n${e}`));
                break;
            } case "urban": {
                const query = args.join(' ');
                urban_search({ query, key: SECRETS.rapid.key }).then(res => {
                    if (res['list'].length === 0) {
                        message.reply(`Congratulations, not even Urban \
                        Dictionary knows what you're trying to say.`.squeeze());
                        return;
                    }
                    const entry = res['list'][0];
                    const def = entry.definition.replace(/\[|\]/g, '');

                    message.reply(`Urban Dictionary defines \
                        ‘${query}’, as:\n> ${def}`.squeeze());
                    message.channel.send(`Link: ${entry.permalink}`);
                }).catch(e => message.reply(`Error fetching definition:\n${e}`));
                break;
            } case "milkies": {
                message.reply(`${(4 + Math.random() * 15).round_to(3)} gallons \
                    of milkies have been deposited in your mouth.`.squeeze());
                break;
            } case "say": {2
                message.reply(`Me-sa says: “${args.join(' ')}”`);
                break;
            } case "export": {
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

                if (export_string.length < 1980) {
                    message.channel.send("```json\n" + export_string + "\n```");
                } else {
                    const attach = new MessageAttachment(file_dest);
                    attach.name = file_name;
                    message.channel.send("**Export:**", attach);
                }

                message.reply(`A copy of this export (\`export-${today}.json\`) \
                    has been saved to the local file system.`.squeeze());
                break;
            }
            default: {
                message.reply(`
                    :warning: ${CONFIG.commands.not_understood}.
                    > \`${CONFIG.commands.prefix}${command}\``.squeeze());
                break;
            }
        }
    }

    process_generic(message : Message) {
        const { content } = message;
        if (content.includes('bot'))
            message.reply("The hell you sayn' about bots?");
        // TODO: Process _rules_ appropriately.
    }

    @On("message")
    async on_message(message : Message, client : Client) {
        console.log('Message acknowledged.');
        if (SimpOMatic._client.user.id === message.author.id) {
            return;
        }
        console.log('Message received:', message.content);

        if (message.content[0] === CONFIG.commands.prefix) {
            console.log('Message type: command.')
            this.process_command(message);
        } else {
            console.log('Message type: generic.')
            this.process_generic(message);
        }
    }
}

// Start The Simp'O'Matic.
SimpOMatic.start();

// Back-up the resultant CONFIG to an external file.
write_file(`${process.cwd()}/export.json`, export_config(CONFIG, {}));
