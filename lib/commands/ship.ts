import { FORMATS } from '../extensions';
import { Message } from 'discord.js';

const fs = require('fs');
const cp = require('child_process');
const fetch = require('node-fetch');

function ps(stream) {
	return new Promise((resolve, reject) => {
		stream.once('error', reject);
		stream.once('finish', resolve);
	});
}

function makeimg(u1, u2){
	var ps1, ps2
	fetch(u1).then(res => {
		ps1 = ps(res.body.pipe(fs.createWriteStream('./u1.png')))
	})
	fetch(u2).then(res => {
		ps2 = ps(res.body.pipe(fs.createWriteStream('./u2.png')))
	})
	Promise.all([ps1, ps2]).then(() => {
		cp.execSync('montage u1.png ../../❤️.png u2.png out.png', {cwd: __dirname})
	})
	return './out.png'
}

export default home_scope => {
    const { message, args,
            HELP_SECTIONS,
            KNOWN_COMMANDS }
        : { message: Message, args: string[],
            HELP_SECTIONS: string[],
            KNOWN_COMMANDS: string[] } = home_scope;

    if (args.length === 0 || args[0] == 'help' ||
        message.mentions.users.size === 0 ||
        message.mentions.users.size > 2)
    {
        message.channel.send(HELP_SECTIONS[KNOWN_COMMANDS.indexOf('ship')].trim());
        return;
    }

    let userAvatars = {
        first: message.mentions.users.size === 1
            ? message.author.avatarURL
            : message.mentions.users.first().avatarURL,
        second: message.mentions.users.last().avatarURL
    };

    const responses = [
        { range: [24, 49],  message: "Not good. :confounded: :broken_heart:" },
        { range: [49, 59],  message: "Nothing is impossible, but... :slight_frown:" },
        { range: [59, 64],  message: "Friends, but maybe... :smirk:" },
        { range: [64, 69],  message: "We have some chemistry going on here... :heart_eyes:" },
        { range: [69, 74],  message: "A match for sure! :relaxed:" },
        { range: [74, 79],  message: "I approve this couple! :kissing_heart:" },
        { range: [79, 84],  message: "They like each other very much!! :blush:" },
        { range: [84, 89],  message: "If both aren't already dating I'd be surprised! :kissing_closed_eyes:" },
        { range: [89, 93],  message: "Both are made for each other! :relaxed:" },
        { range: [93, 97],  message: "They deeply love each other! :blush:" },
        { range: [97, 100], message: "Lovey-dovey couple!! :kissing_heart: :heart: :two_hearts:" },
    ];

    const inRange = ([min, max]: number[], num: number): boolean =>
        num >= min && num < max;

    const getResponse = (num: number): string =>
        responses.filter(res => inRange(res.range, num))[0]?.message || responses[0].message;

    const getPercentage = function (die: number) {
        const bar = {
            size: 10,
            knob: '█',
            empty: '.',
            get filling(): number {
                return Math.round(die / this.size);
            },
            get space(): number {
                return Math.abs(this.filling - this.size);
            }
        }!;

        let percentage = `${die.toString().format(FORMATS.bold)}%`;
        let progressbar = `[${ bar.knob.repeat(bar.filling) }${ bar.empty.repeat(bar.space) }]`.format(FORMATS.block);

        return `${percentage} ${progressbar}`;
    };

    let die: number = Math.floor(Math.random() * 100);

    let response: string =
        `${getPercentage(die)} ${getResponse(die)}`;

    message.channel.send(response, {files: [makeimg(userAvatars.first, userAvatars.second)]});
}
