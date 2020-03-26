import { Message, User } from 'discord.js';
import { FORMATS } from '../extensions';

declare global {
	namespace Types {
		type ScoreStats = {
			missed: number,
			scored: number
		};

		export type Mask = '_' | '.' | '-' | ':';

		export interface Score {
			[id: string]: ScoreStats;
		}

		export interface Guess {
			id: string;
			answer: string;
			attempt?: string;
		}

		export interface HangmanConfig {
			attempt_limit: number;
			mask: Mask;
		}

		export interface Messages {
			help: string;
			lose: string;
			miss: string;
			in_progress: string;
			win: (id: string) => string;
			start: (word: string) => string;
			guess: (attempt: string) => string;
			result: (missed: number,
					scored: number) => string;
		}

		export enum Status {
			Started,
			InProgress
		}
	}

	interface Array<T> {
		result(): string;
		pick(): string;
	}

	interface String {
		mask_with(mask: Types.Mask): string[];
	}
}

Array.prototype.result = function () {
	return this.join('');
};

Array.prototype.pick = function (): string {
	return this[Math.floor(Math.random() * this.length)];
};

String.prototype.mask_with = function (mask: Types.Mask = '_') {
	return [...(mask.repeat(this.length))];
};

const WORDS: string[] = [
	"hello",
	"world"
];

let GAME_STATUS: Types.Status;

const scores: Types.Score = {
	"29138138129139128": {
		missed: 0,
		scored: 0
	}
};

const CONFIG: Types.HangmanConfig = {
	attempt_limit: 10,
	mask: '_'
};

const MESSAGES: Types.Messages = {
	help: "To start a new hangman game"
		+ ".hangman new\n".format(FORMATS.block)
		+ "Make a guess: "
		+ ".hangman [@letter]\n".format(FORMATS.block)
		+ "Guess the full word: "
		+ ".hangman [@word]".format(FORMATS.block),
	in_progress: "A hangman game is already in progress!",
	lose: "You reached the number of attempts. You lose!",
	miss: "You missed :(",
	start: (word) =>
		`The word is ${word.length} letters long.\n` +
		`Make a guess!`,
	win: (id) =>
		`Congrats ${id}, you won the game!`,
	guess: (attempt) =>
		`You guessed: ${attempt}`,
	result: (missed, scored) =>
		`Missed: ${missed}\n` +
		`Scored: ${scored}`,
};

// export default (home_scope: HomeScope) => {
//	const { message, args } = home_scope;

	// if (args.length === 0 || args[0] === 'help')
	//	message.channel.send(MESSAGES.help);

const args = ['new'];

const start = (w: string) => {
	console.log(MESSAGES.start(w));
	GAME_STATUS = Types.Status.Started;
};

const answer = WORDS.pick();

const [id, attempts, output]: [string, number, string[]] = [
	// message.author,
	"494924924924999",
	CONFIG.attempt_limit,
	answer.mask_with(CONFIG.mask)
];

const score = (u_id: string) =>
	scores[u_id].scored++;

const miss = (u_id: string) =>
	scores[u_id].missed++;

const guessed = (attempt: string) =>
	MESSAGES.guess(attempt);

const hasWon = () =>
	!output.includes(CONFIG.mask);

const lose = () =>
	console.log(MESSAGES.lose);
	// message.channel.send(MESSAGES.lose);

const win = (u_id: string) => {
	score(u_id);
	const { missed, scored } = scores[u_id];
	MESSAGES.win(u_id);
	MESSAGES.result(missed, scored);
};

// FIX THESE SHADOW VARIABLES (id, answer)
const guess = ({ id, answer, attempt }: Types.Guess) => {
	if (GAME_STATUS !== (Types.Status.Started | Types.Status.InProgress)) {
		console.log(MESSAGES.in_progress);
		return;
	}

	guessed(attempt);

	if (attempt.length === answer.length)
		(attempt === answer) ? win(id) : miss(id);

	if (answer.indexOf(attempt) !== -1) {
		miss(id);

		return (scores[id].missed >= attempts)
			? lose()
			: output.result();
	}

	[...answer]
		.each((letter: string, i: number) => {
			if (letter === attempt)
				output[i] = attempt.toUpperCase();

			if (typeof (output[i]) === 'undefined')
				output[i] = CONFIG.mask;
		});

	score(id);
	return output.result();
};

if (args[0] === 'new')
	start(answer);
else {
	guess({ id, answer, attempt: args[0] });

	if (hasWon())
		win(id);
}

// };
