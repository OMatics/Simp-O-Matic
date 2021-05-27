import git from 'nodegit';
import fetch from 'node-fetch';

import path from 'path';
import { MessageEmbed } from 'discord.js';
import { help_info } from '../utils';

const GIT_DIR = path.resolve(process.cwd(), "./.git");
const GITHUB_API = "https://api.github.com/repos/Demonstrandum/Simp-O-Matic";
const LOGO_URL = "https://raw.githubusercontent.com/Demonstrandum/"
	+ "Simp-O-Matic/master/lib/resources/banners/banner-notext.png";

type History = {
	hash: string,
	message: string,
	author: string
};

const get_history = (max: number): Promise<History[]> =>
	new Promise(async (res, _) => {
		const repo = await git.Repository.open(GIT_DIR);
		const master = await repo.getMasterCommit();
		const history = master.history();

		let count = 0;
		const hist_array: History[] = [];
		history.on("commit", commit => {
			if (count++ >= max) return;
			const entry: History = {
				hash: commit.sha().toString().slice(0, 7),
				message: commit.message().trim(),
				author: commit.author().name()
			};
			hist_array.push(entry);
		});
		history.on("end", () => res(hist_array));
		history.start();
	});

type Breakdown = {
	[key: string]: number
};

const shortlog = async () => {
	const hist = await get_history(Infinity);
	const breakdown: Breakdown = {};
	for (const entry of hist) {
		if (breakdown.hasOwnProperty(entry.author)) {
			breakdown[entry.author] += 1;
		} else {
			breakdown[entry.author] = 1;
		}
	}
	return breakdown;
};

export default async (homescope : HomeScope) => {
	const { message, args, CONFIG } = homescope;

	if (args.length === 0 || args[0] === 'latest') {
		const latest = (await get_history(1))[0];
		return message.channel.send(new MessageEmbed()
			.setTitle(latest.message)
			.setAuthor(latest.author)
			.setDescription("`" + latest.hash + "`")
			.setColor("#ef88c5")
			.setThumbnail(LOGO_URL));
	}

	if (args[0] === 'history') {
		const hist = await get_history(Number(args[1]) || 8);
		let str = "";
		for (const entry of hist)
			str += `\`${entry.hash}\` — ${entry.message} (by ${entry.author})\n`;
		return message.channel.send(str);
	}

	if (args[0].startsWith('cont')) {
		const breakdown = await shortlog();
		return message.channel.send("**Contributors:**\n"
			+ Object.keys(breakdown).map(e => ` - ${e}`).join("\n"));
	}

	if (args[0].startsWith('break')) {
		const breakdown = await shortlog();
		const pad = Object.values(breakdown).reduce((acc, e) =>
			e.toString().length > acc ? e.toString().length : acc, 1);
		const formatted = Object.keys(breakdown).map(e =>
			`\`${breakdown[e].toString().padStart(pad)}\`: ${e}`);
		return message.channel.send("**Commits per Contributor:**\n"
			+ formatted.join("\n"));
	}

	const res = await fetch(GITHUB_API);
	const repo_info = await res.json();

	if (args[0].startsWith('star')) {
		return message.reply(
			`GitHub Stars: :star2: ${repo_info.stargazers_count}`);
	}

	if (args[0].startsWith('watch')) {
		return message.reply(
			`GitHub Watch Count: :eyes: ${repo_info.watchers_count}`);
	}

	if (args[0].startsWith('fork')) {
		return message.reply(
			`GitHub Forks: :writing_hand: ${repo_info.forks_count}`);
	}

	message.reply("That's not how you use that command, here's how:\n"
		+ help_info('git', CONFIG.commands.prefix));
};
