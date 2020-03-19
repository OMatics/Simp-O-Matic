export default home_scope => {
	//todo: if no args, mock the previous message, but this could be implemented via .alias and !!^
	const { message, args } = home_scope;
	let b = false;
	message.answer([...args.join(' ').toLowerCase()].map(l => {
		if(l == l.toUpperCase())
			return l
		else
			return (b = !b)?l.toUpperCase():l
	}).join() || 'sAy SoMeThInG wIlL yA?')
}