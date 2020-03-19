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
};

const MARKS = {
    '.': ['joyful', 3],
    '?': ['confused', 2],
    '!': ['joyful', 2],
    ',': ['embarrassed', 3]
};

interface Scope {
    message: Message;
    args: string[];
}

export default home_scope => {
    const { message, args } : Scope = home_scope;

    if (args.length === 0 || args[0] === 'help') {
        message.channel.send("OwO *notices text* What's this?");
        return;
    }

    const uwuify = (word: string) => {
        const tail = word[word.length - 1];
        let end = "";

        const randomize = ([emoji, chance], precise = false) => {
            const probability = Math.floor(Math.random() * chance);
            const emojitype = EMOJIS[emoji];

            if (probability === 0 || precise)
                return emojitype[Math.floor(Math.random() * emojitype.length - 1) + 1];
        };

        if (Object.keys(MARKS).includes(tail)) {
            word = word.slice(0, -1);
            end = randomize(MARKS[tail]);

            if (typeof end === 'undefined')
                end = randomize(['sparkles', 4], true);
        }

        const enclose = (w: string) => w + end + ' ';

        const transform = (w: string) => {
            let stream = "";

            const subsetOf = (sw: string, side: any) =>
                sw.slice(side[0]) === side[1] || sw.slice(side[0]) === side[2];

            const replaceFrom = (sw: string, side: any, replacements: any) =>
                enclose(sw.slice(0, side[0]).replace(replacements[0], replacements[1]) + sw.slice(side[0]));

            const defaultReplace = (sw: string, replacement: any) =>
                enclose(sw.replace(replacement[0], replacement[1]));

            for (const letter in MAPPINGS.letters) {
                if (w.indexOf(letter) > -1) {
                    const [left, right, replaces] = MAPPINGS.letters[letter];

                    if (subsetOf(w, left))
                        stream += replaceFrom(w, left, replaces);
                    else if (subsetOf(w, right))
                        stream += replaceFrom(w, right, replaces);
                    else {
                        stream += defaultReplace(w, replaces);
                        return stream;
                    }
                }
            }
        };

        const stutter = (stream: string) => {
            if (stream.length > 2 && stream[0].match(/[a-z]/i)) {
                const probability = Math.floor(Math.random() * 5);
                if (probability === 0)
                    return stream[0] + '-' + stream;
            }
            return stream;
        };

        const replace_swearwords = (stream: any) => {
            for (const w of MAPPINGS.words) {
                let [regex, replacement] = w;

                regex = new RegExp(regex);

                if (regex.test(stream))
                    return stream.replace(regex, replacement);
            }
            return stream;
        };

        let transformed = transform(word);

        if (typeof transformed === 'undefined')
            transformed = enclose(word);

        transformed = replace_swearwords(transformed);
        transformed = stutter(transformed);

        return transformed;
    };

    const result = args
        .join(' ')
        .toLowerCase()
        .split(' ')
        .map(uwuify);

    message.channel.send(result.join(' '));
};
