const RULES = [
	'respond', 'reject',
	'replace', 'trigger'
];

exports.description = "Specify rules only to listen to specific users";
exports.options = [{
    name: "ruletype",
    type: "STRING",
    description: "Specify rule-type",
    choices: [{respond: "respond"}, {reject: "reject"}, {replace: "replace"}, {trigger: "trigger"}],
    required: true
}, {
	name: "index",
	type: "INTEGER",
	description: "Rule at index",
	required: true
}, {
	name: "user",
	type: "USER",
	description: "Apply only to this user",
	required: true
}];

exports.main = (home_scope: HomeScope) => {
	const { message, CONFIG } = home_scope;

	const rule_type = message.options[0].value;

	const index = message.options[1].value;

	const rule_no = CONFIG.rules[rule_type].length;
	if (index > rule_no || CONFIG.rules[rule_type][index - 1] === undefined)
		return message.reply(`Index (${index}) is out of range.\n`
			+ `Only ${rule_no} elements exist in ${rule_type} rules.`);

	const ids = message.options[2].user;
	const rule = CONFIG.rules[rule_type][index - 1];

	if (!rule.listens)
		rule.listens = [];

	rule.listens.push.apply(rule.listens, ids);
	message.reply("Rule listener added successfully.");
};
