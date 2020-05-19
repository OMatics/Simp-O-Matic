export default async (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.channel.send(args.map(w => [...w].find(c => isNaN(c)?c.toLowerCase() != c.toUpperCase():c) || '').join('').toUpperCase() + ` (${args})`)
}