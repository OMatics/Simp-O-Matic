import { FORMATS } from './extensions';
import { Message, MessageEmbed } from 'discord.js';

type ActionType = 'kiss' | 'suck' | 'rape' | 'slap' | 'hug' | 'lick' | 'rim' | 'kill' | 'purr';

interface Actions {
	title: string;
	message: string;
	images: string[];
	emoji?: string;
	transitiveness?: boolean;
}

const ACTIONS: Record<ActionType, Actions> = {
	kiss: {
		title: "Uh-oh... You're getting a kissu!",
		message: "you got a kissu",
		emoji: "flushed",
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
			"https://media1.tenor.com/images/4d14fcf8c24b4401ba28c551448b4e76/tenor.gif?itemid=7363594",
			"https://media1.tenor.com/images/72bb319ed9510d8d04103ca784bc2d96/tenor.gif?itemid=11250101",
			"https://media1.tenor.com/images/032f033f9525b11c718a135c7d0cad1e/tenor.gif?itemid=16800169",
			"https://media1.tenor.com/images/4a817781d52c841bf63da5503933d5dd/tenor.gif?itemid=16713451",
			"https://media1.tenor.com/images/27a1c3c76e18fbcaa39811a1f9d47bf2/tenor.gif?itemid=15583305",  // Lol...
			"https://media1.tenor.com/images/a6dea39e02e2156c32632f2d262cf36b/tenor.gif?itemid=11258451",
			"https://media1.tenor.com/images/09f3547ad0ee0f4b7834aa1ac0f58f35/tenor.gif?itemid=7841278",
		]
	},
	suck: {
		title: "Time for the suckywucky!",
		message: "is sucking on",
		emoji: "drooling_face",
		images: [
			"https://media1.tenor.com/images/5b94662a631d4276cf135b274f0ce9af/tenor.gif?itemid=14848171",
			"https://media1.tenor.com/images/0281295f20ebee2741b23a27898001da/tenor.gif?itemid=12607433",
			"https://media1.tenor.com/images/76624038f138085c7717062fa8a3d547/tenor.gif?itemid=15987810",
			"https://media1.tenor.com/images/ee25cfc39c61a1b1478dcfe72e7116e0/tenor.gif?itemid=16442725",
			"https://media1.tenor.com/images/359d9a5038eb688e9d5b25eead83ad3e/tenor.gif?itemid=4854805",
			"https://media1.tenor.com/images/783188d1592d16bcc83f52639fad8fcb/tenor.gif?itemid=10816601",
		],
		transitiveness: true
	},
	rape: {
		title: "Don't struggle :)",
		message: "raped",
		emoji: "clown",
		images: [
			"https://i.imgur.com/rdZHqDX.gif",
			"https://i.imgur.com/DdUkVBo.gif",
			"https://i.imgur.com/EcBew8x.gif",
			"https://i.imgur.com/0iEZleS.gif",
			"https://giant.gfycat.com/GroundedTenderKitten.gif",
			"https://media1.tenor.com/images/8f668350ed3dca15ad95fcd2ae2d93bd/tenor.gif?itemid=5769476",
			"https://media1.tenor.com/images/5e62e705a680e8f49ad0fb30e8e3c6dd/tenor.gif?itemid=15304437",
			"https://media1.tenor.com/images/b1613fda51b951fe42453bf90f89b209/tenor.gif?itemid=13082428",
			"https://cdn.discordapp.com/attachments/710852599208869910/775210248255307776/1568253225448.gif",
		],
		transitiveness: true
	},
	slap: {
		title: "Ouchie! You've been slapped!",
		message: "you got a slap",
		emoji: 'back_of_hand',
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
		]
	},
	hug: {
		title: "Uguu~~ You got a warm hug!",
		message: "you got a hug",
		emoji: 'hugging',
		images: [
			"https://cdn.weeb.sh/images/rkIK_u7Pb.gif",
			"https://cdn.weeb.sh/images/SJByY_QwW.gif",
			"https://cdn.weeb.sh/images/rkYetOXwW.gif",
			"https://cdn.weeb.sh/images/S1a0DJhqG.gif",
			"https://cdn.weeb.sh/images/SJfEks3Rb.gif",
			"https://cdn.weeb.sh/images/HyNJIaVCb.gif",
			"https://media1.tenor.com/images/adbfbc5c70e669c269ef8d4af1508242/tenor.gif?itemid=12449173",
			"https://media1.tenor.com/images/d2a2b216ef3bc74406f661049f937999/tenor.gif?itemid=17023255",
			"https://media1.tenor.com/images/667d8a04d2390a8c6bf33caca9bfb9a6/tenor.gif?itemid=5352915",
			"https://media1.tenor.com/images/5d604335b3b9a087ff089c7e96498ae3/tenor.gif?itemid=14566835",
			"https://media1.tenor.com/images/8cf8eafae079be517f61d7f65e3c813f/tenor.gif?itemid=9554711",
			"https://media1.tenor.com/images/a8cbc11ee331c62aaf03420d99696da0/tenor.gif?itemid=9556155",
			"https://media1.tenor.com/images/5dbb6d29ac9f63d7815a95997ecbae56/tenor.gif?itemid=13356108",
			"https://media1.tenor.com/images/19cf84b7a56e9a64fe7fd5559ad287bf/tenor.gif?itemid=10243168",
		]
	},
	lick: {
		title: "You got a wet lick!",
		message: "you got a lick",
		emoji: 'tongue',
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
			"https://media1.tenor.com/images/2b846c6bb5dc0b03dfe7776bc581608c/tenor.gif?itemid=11268572",
			"https://media1.tenor.com/images/faa1937f75b548bec3bb0e48061620a2/tenor.gif?itemid=15900647",
			"https://media1.tenor.com/images/0a2cdce1fc35a069cdcb992f89c8855b/tenor.gif?itemid=4859151",
			"https://media1.tenor.com/images/efd46743771a78e493e66b5d26cd2af1/tenor.gif?itemid=14002773",

		]
	},
	rim: {
		title: "Your butthole is getting licked! (it's so soft and yummy!!)",
		message: "you got a rimjob",
		emoji: 'stuck_out_tongue',
		images: [
			"https://media1.tenor.com/images/0a2cdce1fc35a069cdcb992f89c8855b/tenor.gif?itemid=4859151",
			"https://media1.tenor.com/images/2c15d00633af18a31a1d45aeb6e7ae0d/tenor.gif?itemid=9152683",
			"https://media1.tenor.com/images/1063e876a461f4be347b496a9ecd271c/tenor.gif?itemid=9340107",
			"https://media1.tenor.com/images/29b9e96dfcc7d66ca30c6b7117ed664c/tenor.gif?itemid=12656500",
			"https://media1.tenor.com/images/069076cc8054bb8b114c5a37eec70a1f/tenor.gif?itemid=13248504",
			"https://media1.tenor.com/images/bfd48eb1b2f0b4b5073cc400baf01e03/tenor.gif?itemid=7557353",
			"https://img2.gelbooru.com/images/94/83/94833376ed7271f08c75385204fbcd1f.gif",
			"https://img.rule34.xxx//images/1149/9362d2e884efc6e49b665be3268d4f02d66674a3.gif?1148722",
		]
	},
	kill: {
		title: "You have died.",
		message: "killed",
		emoji: 'skull',
		images: [
			"https://img2.gelbooru.com/images/7c/9c/7c9cdd15e03df0a2ba06b9bb9aa98180.png",
		],
		transitiveness: true
	},
	purr: {
		title: "You are being purred at!",
		message: "purred at",
		emoji: 'cat',
		images: [
			"https://cdn.discordapp.com/attachments/768154669037125712/773217352081735710/giphy.gif",
			"https://cdn.discordapp.com/attachments/768154669037125712/773217347884417024/giphy_2.gif"
		],
		transitiveness: true
	}
};

export default class Action {
	private static description(
		subject: string,
		object: string,
		{ message: verb, emoji, transitiveness = false }: Actions): string
	{
		const description = transitiveness
			? `${subject} ${verb} ${object}!`
			: `${object}, ${verb} from ${subject}!`

		return emoji
			? `${description} ${emoji.emojify()}`
			: description;
	}

	static get(action: ActionType, message: Message): MessageEmbed {
		const [author, to] = [message.author, message.mentions.users.first()]
			.map(m => message.guild.members.resolve(m))
			.map(u => u.displayName);
		const reaction: Actions = ACTIONS[action];
		const images = reaction.images;
		const image = images[(Number(message.cleanContent.split(' ')[1]) || (Math.floor(Math.random() * images.length) + 1)) - 1];

		const embed = new MessageEmbed()
			.setColor('#ba3d8a')
			.setTitle(reaction.title)
			.setDescription(
				this.description(
					author.format(FORMATS.bold),
					to.format(FORMATS.bold),
					reaction)
			)
			.setImage(image);

		return embed;
	}
}
