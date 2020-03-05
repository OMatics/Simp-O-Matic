import { Discord, On, Client } from '@typeit/discord';
import { Message } from 'discord.js';

import { readFileSync as read } from 'fs';
import { execSync } from 'child_process';

import './utils';
import { search } from './search_api';

const BOT_CONFIG = JSON.parse(read('./bot.json', 'utf-8'));
const SECRETS = JSON.parse(execSync('sh ./generate_secrets.sh').toString());

@Discord
export class SimpOMatic {
    private static _client : Client;
    private _prefix : string = BOT_CONFIG.commands.prefix || '!';
    private _not_understood : string = BOT_CONFIG.not_understood
        || "Command not understood";

    constructor() {
        console.log('Configured Variables: ', {
            "_prefix": this._prefix,
            "_not_understood": this._not_understood
        });
        console.log('Secrets: ', SECRETS);
    }

    static start() {
        this._client = new Client();
        this._client.login(
            SECRETS.api.token,
            `${__dirname}/*Discord.ts`
        );
    }

    @On("message")
    async on_message(message : Message, client : Client) {
        console.log('Message acknowledged.');
        if (SimpOMatic._client.user.id === message.author.id
        || message.content[0] !== this._prefix) {
            return;
        }

        console.log('Message received: ', message.content);

        const words = message.content.slice(1).toLowerCase().split(' ');
        const command = words[0];
        const args = words.slice(1);

        switch (command) {
            case "ping":
                message.reply("ponggers.");
                break;
            case "img":
                const query = args.join(' ');
                search({
                    type: "image",
                    query,
                    key: SECRETS.contextual.key
                }).then((res : object) => {
                    if (res['value'].length === 0)
                        message.reply('No such images found.');
                    message.reply(`Image of ${query}: ${res['value'][0].url}`);
                }).catch(err => message.reply('Error fetching image.'));
                break;
            case "milkies":
                message.reply(`${(4 + Math.random() * 15).round_to(3)} gallons of milkies \
                    have been deposited in your mouth.`.squeeze());
                break;
            case "say":
                message.reply(`Me says: "${args.join(' ')}"`);
                break;
            default:
                message.reply(
                    `\`[!!]\` ${this._not_understood}. (\`${command}\`)`);
                break;
        }
    }
}


SimpOMatic.start();
