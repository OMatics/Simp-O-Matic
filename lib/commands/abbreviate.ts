export default async (homescope: HomeScope) => {
	const { message, args } = homescope;
	const words = args.map(w => w.trim().capitalize());
	message.channel.send(words.map(w =>
		[...w].find(c =>
			isNaN(c as any)
				? c.toLowerCase() != c.toUpperCase()
				: c)
			|| '')
		.join('').toUpperCase() + ` (${words.join(' ')})`)
}
