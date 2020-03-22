export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.answer(`Me-sa says: “${args.join(' ')}”`);
};
