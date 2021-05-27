export default (homescope: HomeScope) => {
	const { message, GIT_URL } = homescope;
	message.reply(`${GIT_URL}/fork`);
};
