export default (homescope: HomeScope) => {
	const { message } = homescope;
	message.reply(`${(4 + Math.random() * 15).round_to(3)}`
		+ ` gallons of milkies have been deposited in your mouth.`);
};
