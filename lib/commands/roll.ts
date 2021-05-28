exports.description = "Roll a dice."
exports.options = [{
    name: "max",
    type: "INTEGER",
    description: "Default upper bound is 6.",
}];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply(Math.floor(Math.random() * ((+message.options[0].value || 6) + 1)));
};
