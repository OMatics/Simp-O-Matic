exports.description = "Replace some elements of your text with a certain U+1F171.";
exports.options = [{
    name: "toptext",
    type: "STRING",
    description: "Bottom text",
    required: true
}];

exports.main = (home_scope: HomeScope) => {
    const { message, args } = home_scope;

    const input = (args.length === 0)
        ? "b"
        : args.join(' ').toLowerCase();

    const alphabet = 'pb';

    const letters = [...input].map((chr: any) =>
        isNaN(chr) && alphabet.includes(chr)
            ? `b`.emojify()
            : chr);

    message.reply(letters.join(' '));
};
