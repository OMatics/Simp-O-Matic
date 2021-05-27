export default (homescope: HomeScope) => {
	const { message } = homescope;
	message.channel.send(
		"**GNU Affero GPLv3 (`AGPL-3.0`), _Free_ as in Freedom.**");
	message.channel.send("<:AGPL:740958423008411678>");
};
