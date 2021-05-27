// .whitelistchannels #channel1 #channel2
// .whitelistchannels without any arguments turns off the function
export default async (homescope: HomeScope) => {
	const { message, CONFIG } = homescope;

	if (!CONFIG.whitelistchannels)
		CONFIG.whitelistchannels = [];

	CONFIG.whitelistchannels.push.apply(
		CONFIG.whitelistchannels,
		[...message.mentions.channels.keys()]);
}
