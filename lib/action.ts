import { FORMATS } from './extensions';
import { Message, MessageEmbed } from 'discord.js';

type ActionType = 'kiss' | 'rape' | 'slap' | 'hug' | 'lick';

interface Actions {
	title: string;
	message: string,
	images: string[],
	transitiveness: boolean
}

const ACTIONS: Record<ActionType, Actions> = {
	kiss: {
		title: "Uh-oh... You're getting a kissu!",
		message: "",
		images: [
			"https://i.imgur.com/a5rkTna.gif",
			"https://i.imgur.com/AnYC2Xi.gif",
			"https://i.imgur.com/9PbQ9Zl.gif",
			"https://i.imgur.com/QZhWnaf.gif",
			"https://i.imgur.com/1PEBQB6.gif",
			"https://i.imgur.com/qW6BWEn.gif",
			"https://i.imgur.com/79hpwpn.gif",
			"https://i.imgur.com/RpxJYVD.gif",
			"https://i.imgur.com/8fcnQFS.gif",
		],
		transitiveness: true
	},
	rape: {
		title: "Don't struggle :)",
		message: "raped",
		images: [
			"https://tenor.com/biv7G.gif",
			"https://i.imgur.com/rdZHqDX.gif",
			"https://i.imgur.com/DdUkVBo.gif",
			"https://i.imgur.com/EcBew8x.gif",
			"https://i.imgur.com/0iEZleS.gif",
		],
		transitiveness: true
	},
	slap: {
		title: "Ouchie! You've been slapped!",
		message: "you got a slap",
		images: [
			"https://cdn.weeb.sh/images/HkskD56OG.gif",
			"https://cdn.weeb.sh/images/BJSpWec1M.gif",
			"https://cdn.weeb.sh/images/Hk6JVkFPb.gif",
			"https://cdn.weeb.sh/images/By2iXyFw-.gif",
			"https://cdn.weeb.sh/images/H1n57yYP-.gif",
			"https://cdn.weeb.sh/images/B1oCmkFw-.gif",
			"https://cdn.weeb.sh/images/SkKn-xc1f.gif",
			"https://cdn.weeb.sh/images/H16aQJFvb.gif",
			"https://cdn.weeb.sh/images/HkK2mkYPZ.gif",
			"https://cdn.weeb.sh/images/BJ8o71tD-.gif",
		],
		transitiveness: false
	},
	hug: {
		title: "Uguu~~ You got a warm hug!",
		message: "you got a hug",
		images: [
			"https://cdn.weeb.sh/images/rkIK_u7Pb.gif",
			"https://cdn.weeb.sh/images/SJByY_QwW.gif",
			"https://cdn.weeb.sh/images/rkYetOXwW.gif",
			"https://cdn.weeb.sh/images/S1a0DJhqG.gif",
			"https://cdn.weeb.sh/images/SJfEks3Rb.gif",
			"https://cdn.weeb.sh/images/HyNJIaVCb.gif",
		],
		transitiveness: false
	},
	lick: {
		title: "You got a wet lick!",
		message: "you got a lick",
		images: [
			"https://cdn.weeb.sh/images/H1zlgRuvZ.gif",
			"https://cdn.weeb.sh/images/Bkagl0uvb.gif",
			"https://cdn.weeb.sh/images/Syg8gx0OP-.gif",
			"https://cdn.weeb.sh/images/ryGpGsnAZ.gif",
			"https://cdn.weeb.sh/images/rykRHmB6W.gif",
			"https://cdn.weeb.sh/images/S1Ill0_vW.gif",
			"https://cdn.weeb.sh/images/H1EJxR_vZ.gif",
			"https://cdn.weeb.sh/images/H1EJxR_vZ.gif",
			"https://cdn.weeb.sh/images/HkEqiExdf.gif",
		],
		transitiveness: false
	}
};

const description_string = (subject, object, verb, transitiveness) =>
	transitiveness
		? subject.format(FORMATS.bold) + ` ${verb} ` + object.format(FORMATS.bold) + '! :flushed:'
		: object.format(FORMATS.bold) + `, ${verb} from ` + subject.format(FORMATS.bold) + '! :flushed:';

export default class Action {
	static get(action: ActionType, message: Message): MessageEmbed {
		const { username: author } = message.author;
		const { username: to }     = message.mentions.users.first();

		const reaction = ACTIONS[action];
		const images   = reaction.images;
		const image    = images[Math.floor(Math.random() * images.length)];

		const embed = new MessageEmbed()
			.setColor('#ba3d8a')
			.setTitle(reaction.title)
			.setDescription(description_string(author, to, reaction.message, reaction.transitiveness))
			.setImage(image);

		return embed;
	}
}
