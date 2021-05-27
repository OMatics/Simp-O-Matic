export default async (homescope: HomeScope) => {
	const { CLIENT, message, args, Drugs } = homescope;
	const arg = args.length > 0 ? args.shift() : 'help'

	try {
		message.content = `--${arg} ${args.join(' ')}`;
		Drugs.execute(CLIENT, message);
	} catch (e) {
		message.reply(`Failed to execute \`${arg}\` command for Drug-O-Matic.`
			+ "\n```\n" + `${e}` + "\n```")
	}
};
