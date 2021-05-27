const RULES = [
	'respond', 'reject',
	'replace', 'trigger'
];

export default (homescope: HomeScope) => {
	const { message, args, CONFIG } = homescope;

	const rule_type = args[0];
	if (!RULES.includes(rule_type))
		return message.reply("`listen` command first argument must"
			+ " be either `respond`, `reject`, `replace` or `trigger`"
			+ "\nSee `help` page for `listen` for more information.");

	const index_str = args[1] || "NaN";
	const index = Number(index_str[0] === '#'
		? index_str.tail()
		: index_str);

	if (!index)
		return message.reply("Second argument must be a number"
			+ " (greater than zero), that represents the index of the rule");

	const rule_no = CONFIG.rules[rule_type].length;
	if (index > rule_no || CONFIG.rules[rule_type][index - 1] === undefined)
		return message.reply(`Index (${index}) is out of range.\n`
			+ `Only ${rule_no} elements exist in ${rule_type} rules.`);

	const ids = message.mentions.users
		.map(user => user.id);

	if (args.length < 3 || ids.length === 0)
		return message.reply("Please provide at least one username"
			+ " (in form of a mention).");

	const rule = CONFIG.rules[rule_type][index - 1];

	if (!rule.listens)
		rule.listens = [];

	rule.listens.push.apply(rule.listens, ids);
	message.reply("Rule listener added successfully.");
};
