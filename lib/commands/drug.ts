export default async (home_scope: HomeScope) => {
	const { CLIENT, message, args, Drugs } = home_scope;
	const arg = args.length > 0 ? args.shift() : 'help'

	try {
		message.content = `--${arg} ${args.join(' ')}`;
		Drugs.execute(CLIENT, message);
	} catch (e) {
		message.answer(`Failed to execute \`${arg}\` command for Drug-O-Matic.`
			+ "\n```\n" + `${e}` + "\n```")
	}
};
