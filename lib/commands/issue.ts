export default home_scope => {
	const { message, GIT_URL } = home_scope;
	message.answer(`${GIT_URL}/issues`);
}