// .whitelistchannels #channel1 #channel2
// .whitelistchannels without any arguments turns off the function
export default async (home_scope: HomeScope) => {
	const { message, CONFIG } = home_scope;

	if (!CONFIG.whitelistchannels)
		CONFIG.whitelistchannels = [];

	CONFIG.whitelistchannels.push.apply(
		CONFIG.whitelistchannels,
		[...message.mentions.channels.keys()]);
}
