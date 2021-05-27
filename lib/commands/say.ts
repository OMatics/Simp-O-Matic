export default (homescope: HomeScope) => {
	const { message, args } = homescope;
	message.reply(`Me-sa says: “${args.join(' ')}”`);
};
