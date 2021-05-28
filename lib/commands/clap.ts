exports.description = "👏";
exports.options = [{
    name: "input",
    type: "STRING",
    description: "👏",
    required: true
}];
exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.reply(args.join(' 👏 ') + '👏');
};
