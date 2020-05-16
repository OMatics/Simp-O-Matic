const RULES = [
	'respond', 'reject',
	'replace', 'trigger'
];

export default (home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	const rule_type = args[0];
	if (!RULES.includes(rule_type))
		return message.answer("`listen` command first argument must"
			+ " be either `respond`, `reject`, `replace` or `trigger`"
			+ "\nSee `help` page for `listen` for more information.");

	const index_str = args[1] || "";
	const index = Number(index_str[0] === '#'
		? index_str.tail()
		: index_str);

	if (!index)
		return message.answer("Second argument must be a number"
			+ " (greater than zero), that represents the index of the rule");

	const rule_no = CONFIG.rules[rule_type].length;
	if (index > rule_no || CONFIG.rules[rule_type][index - 1] === undefined)
		return message.answer(`Index (${index}) is out of range.\n`
			+ `Only ${rule_no} elements exist in ${rule_type} rules.`);

	const ids = message.mentions.users
		.map(user => user.id);

	if (args.length < 3 || ids.length === 0)
		return message.answer("Please provide at least one username"
			+ " (in form of a mention).");

	const rule = CONFIG.rules[rule_type][index - 1];

	if (!rule.listens)
		rule.listens = [];

	rule.listens.push.apply(rule.listens, ids);
	message.answer("Rule listener added successfully.");
};
