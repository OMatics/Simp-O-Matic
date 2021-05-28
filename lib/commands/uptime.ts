import { FORMATS } from '../extensions';

exports.description = "Display how long the bot has been running for.";
exports.options = [];
exports.main = (home_scope : HomeScope) => {
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

	message.reply(
		`I've been running for: ` +
			(`${days} days, ` +
			 `${hours} hours, ` +
			 `${mins} minutes and ` +
			 `${secs} seconds.`
			).format(FORMATS.bold)
	);
};
