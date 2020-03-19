import { Message } from 'discord.js';

const EMOJIS = {
    joyful: ["(* ^ ω ^)", " (o^▽^o)", " (≧◡≦)", " ☆⌒ヽ(*\"､^*)chu", " ( ˘⌣˘)♡(˘⌣˘ )", " xD"],
    embarrassed: [" (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)..", " (*^.^*)..,", "..,", ",,,", "... ", ".. ", " mmm.."],
    confused: [" (o_O)?", " (°ロ°) !?", " (ーー;)?", " owo?"],
    sparkles: [" *:･ﾟ✧*:･ﾟ✧ ", " ･ﾟﾟ･｡ ", " ♥♡♥ ", " uguu.., "]
};

const MAPPINGS = {
    words: [
        [/you(\'?)re/, 'ur'],
        [/fuck/, 'fug'],
        [/shit/, 'poopoo'],
        [/asshole/, 'b-butthole'],
        [/ass/, 'boi pussy'],
        [/dad|father/, 'daddy'],
        [/tbh/, 'desu'],
        [/cute/, 'kawaii'],
        [/bitch/, 'meanie']
    ],
    letters: {
        'l': [
            [-2, 'le', 'll'],
            [-3, 'les', 'lls'],
            [/[lr]/g, 'w']
        ],
        'r': [
            [-2, 'er', 're'],
            [-3, 'ers', 'res'],
            [/r/g, 'w']
        ]
    }
}

const MARKS = {
    '.': ['joyful', 3],
    '?': ['confused', 2],
    '!': ['joyful', 2],
    ',': ['embarrassed', 3]
};

interface scope {
    message: Message,
    args: string[]
}

export default home_scope => {
    const { message, args } : scope = home_scope;

    if (args.length === 0 || args[0] == 'help') {
        message.channel.send("OwO *notices text* What's this?");
        return;
    }

    const uwuify = (word: string) => {
        let tail = word[word.length - 1];
        let end = "";

        const randomize = ([emoji, chance], precise = false) => {
            let probability = Math.floor(Math.random() * chance);
            let emojitype = EMOJIS[emoji];

            if (probability === 0 || precise)
                return emojitype[Math.floor(Math.random() * emojitype.length - 1) + 1];
        };

        if (Object.keys(MARKS).includes(tail)) {
            word = word.slice(0, -1);
            end = randomize(MARKS[tail]);

            if (typeof end === 'undefined')
                end = randomize(['sparkles', 4], true);
        }

        const enclose = (word: string) => word + end + ' ';

        const transform = (word: string) => {
            let stream = "";

            const subsetOf = (w: string, side: any) =>
                w.slice(side[0]) === side[1] || w.slice(side[0]) === side[2];

            const replaceFrom = (w: string, side: any, replacements: any) =>
                enclose(w.slice(0, side[0]).replace(replacements[0], replacements[1]) + w.slice(side[0]));

            const defaultReplace = (w: string, replacement: any) =>
                enclose(w.replace(replacement[0], replacement[1]));

            for (let letter in MAPPINGS.letters) {
                if (word.indexOf(letter) > -1) {
                    let [left, right, replaces] = MAPPINGS.letters[letter];

                    if (subsetOf(word, left))
                        stream += replaceFrom(word, left, replaces);
                    else if (subsetOf(word, right))
                        stream += replaceFrom(word, right, replaces);
                    else {
                        stream += defaultReplace(word, replaces);
                        return stream;
                    }
                }
            }
        };

        const stutter = (stream: string) => {
            if (stream.length > 2 && stream[0].match(/[a-z]/i)) {
                let probability = Math.floor(Math.random() * 5);
                if (probability == 0)
                    return stream[0] + '-' + stream;
            }
            return stream;
        };

        const replace_swearwords = (stream: any) => {
            for (let word of MAPPINGS.words) {
                let [regex, replacement] = word;

                regex = new RegExp(regex);

                if (regex.test(stream))
                    return stream.replace(regex, replacement);
            }
            return stream;
        };

        let stream = transform(word);

        if (typeof stream === 'undefined')
            stream = enclose(word);

        stream = replace_swearwords(stream);
        stream = stutter(stream);

        return stream
    };

    let result = args
        .join(' ')
        .toLowerCase()
        .split(' ')
        .map(uwuify);

    message.channel.send(result.join(' '));
};
