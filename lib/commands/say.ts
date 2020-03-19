export default home_scope => {
	const { message, args } = home_scope;
	message.answer(`Me-sa says: “${args.join(' ')}”`);
};
