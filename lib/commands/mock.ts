export default (homescope: HomeScope) => {
	// TODO: if no args, mock the previous message,
	//   but this could be implemented via .alias and !!^.
	const { message, args } = homescope;
	let b = true;
	message.channel.send([...args.join(' ').toLowerCase()].map(l =>
		(l === l.toUpperCase()) ? l : ((b = !b) ? l.toUpperCase() : l)
	).join('') || 'sAy SoMeThInG wIlL yA?');
};
