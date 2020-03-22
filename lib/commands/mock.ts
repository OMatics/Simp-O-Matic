export default (home_scope: HomeScope) => {
	// TODO: if no args, mock the previous message,
	//   but this could be implemented via .alias and !!^.
	const { message, args } = home_scope;
	let b = true;
	message.channel.send([...args.join(' ').toLowerCase()].map(l =>
		(l === l.toUpperCase()) ? l : ((b = !b) ? l.toUpperCase() : l)
	).join('') || 'sAy SoMeThInG wIlL yA?');
};
