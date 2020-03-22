import { FORMATS } from '../extensions';

export default (home_scope : HomeScope) => {
	const { message } = home_scope;

	const { uptime } = message.client;
	let seconds = uptime / 1000;

	const [days, hours] = [
		Math.floor(seconds / 86400),
		Math.floor(seconds / 3600)
	];

	seconds %= 3600;

	const [mins, secs] = [
		Math.floor(seconds / 60),
		Math.round(seconds % 60)
	];

	message.channel.send(
		`I've been running for: ` +
			(`${days} days, ` +
			 `${hours} hours, ` +
			 `${mins} minutes and ` +
			 `${secs} seconds.`
			).format(FORMATS.bold)
	);
};
