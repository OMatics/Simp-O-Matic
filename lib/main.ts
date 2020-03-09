import { Discord, On, Client } from '@typeit/discord';
import { Message, Attachment } from 'discord.js';

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
import oed_lookup from './api/oxford';
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
    if (acc.length + msg.length >= 2000) {
        new_messages.push(acc);
        acc = msg;
    } else { acc += msg; }

new_messages.push(acc);
const HELP_MESSAGES = new_messages;

declare module 'discord.js' {
    interface Message {
        answer(...args : any) : void
    }
}

Message.prototype.answer = function (...args) {
    return this.channel.send(`${this.author}, ${args[0]}`,
        ...(args.slice(1)));
};

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
            case 'ping': {
                message.answer("PONGGERS!");
                break;
            } case 'help': {
                message.answer('**HELP:**');
                for (const msg of HELP_MESSAGES)
                    message.channel.send(msg);
                break;
            } case 'id': {
                const reply = `User ID: ${message.author.id}
                    Author: ${message.author}
                    Message ID: ${message.id}`.squeeze();
                console.log(`Replied: ${reply}`);
                message.answer(reply);
                break;
            } case 'search': {
                const query = args.join(' ');

                web_search({
                    type: 'web',
                    query,
                    key: SECRETS.rapid.key
                }).then((res: object) => {
                    if (res['value'].length === 0) {
                        message.answer('No such results found.');
                        return;
                    }
                    message.answer(`Web search for ‘${query}’,
                        found: ${res['value'][0].url}`);
                }).catch(e => message.answer(`Error fetching results:\n${e}`));
                break;
            } case 'image': {
                const query = args.join(' ');

                web_search({
                    type: 'image',
                    query,
                    key: SECRETS.rapid.key
                }).then(res => {
                    if (res['value'].length === 0) {
                        message.answer('No such images found.');
                        return;
                    }
                    message.answer(`Image found for ‘${query}’:
                        ${res['value'][0].url}`);
                }).catch(e =>
                    message.answer(`Error fetching image:\n${e}`));
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
                    let msg = `Definition for ‘${query}’, yielded:\n`;

                    if (!res['results']
                    || res['results'].length == 0
                    || !res['results'][0].lexicalEntries
                    || res['results'][0].lexicalEntries.length == 0
                    || res['results'][0].lexicalEntries[0].entries.length == 0
                    || res['results'][0].lexicalEntries[0].entries[0].senses.length == 0) {
                        message.answer(nasty_reply);
                        return;
                    }

                    const entry = res['results'][0].lexicalEntries[0];
                    const senses = entry.entries[0].senses;
                    console.log('Senses:', pp(senses));
                    for (const sense of Object.values(senses) as any) {
                        let sense_msg = "";
                        if (!!sense.definitions && sense.definitions.length > 0) {
                            for (const definition
                                of Object.values(sense.definitions) as any) {
                                sense_msg += `    Defined as:\n>         ${definition.capitalize()}\n`;
                            }
                        }
                        if (!!sense.synonyms && sense.synonyms.length > 0) {
                            const synonyms = sense.synonyms
                                .map(s => `‘${s.text}’`)
                                .join(', ');
                            sense_msg += `    Synonyms include: ${synonyms}\n`;
                        }
                        if (sense_msg.length > 0) {
                            msg += "In the sense:\n"
                            msg += sense_msg;
                        }
                    }
                    if (!!entry.pronunciations) {
                        const  prons = Object.values(entry.pronunciations) as any;
                        if (!!prons && prons.length > 0) {
                            msg += "Pronunciations:\n"
                            for (const pron of prons) {
                                msg += `    Dialects of ${pron.dialects.join(', ')}:\n`;
                                msg += `        ${pron.phoneticNotation}: [${pron.phoneticSpelling}]\n`;
                                if (pron.audioFile) {
                                    msg += `        Audio file: ${pron.audioFile}\n`;
                                    const attach = new Attachment(
                                        pron.audioFile,
                                        pron.audioFile.split('/').slice(-1)[0]
                                    );
                                    message.channel.send('', attach);
                                }
                            }
                        }
                    }
                    message.channel.send(msg);
                }).catch(e => {
                    if (e.status == 404) {
                        message.channel.send(nasty_reply);
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
            } case 'say': {2
                message.answer(`Me-sa says: “${args.join(' ')}”`);
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

                if (export_string.length < 1980) {
                    message.channel.send("```json\n" + export_string + "\n```");
                }
                const attach = new Attachment(file_dest, file_name);
                message.channel.send("**Export:**", attach);

                message.answer(`A copy of this export (\`export-${today}.json\`) \
                    has been saved to the local file system.`.squeeze());
                break;
            }
            default: {
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

// When deploying to now, we need an HTTP server, since
//  now expects mainly website.
import { createServer } from 'http';
// createServer((_req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(
//         read_file(`${process.cwd()}/public/index.html`).toString(),
//         'utf-8');
// }).listen(3000);
createServer().listen(3000);
