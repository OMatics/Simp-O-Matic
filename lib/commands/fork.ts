export default (home_scope: HomeScope) => {
	const { message, GIT_URL } = home_scope;
	message.answer(`${GIT_URL}/fork`);
};
