export default (home_scope: HomeScope) => {
	const { message } = home_scope;
			.catch(console.warn);
	message.channel.send(
		"**GNU Affero GPLv3 (`AGPL-3.0`), _Free_ as in Freedom.**");
	message.channel.send("<:AGPL:740958423008411678>");
};
