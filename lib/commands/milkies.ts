export default (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.answer(`${(4 + Math.random() * 15).round_to(3)}`
		+ ` gallons of milkies have been deposited in your mouth.`);
};
