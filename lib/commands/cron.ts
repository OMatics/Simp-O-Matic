import { FORMATS } from '../extensions';
import { help_info } from '../utils';
import DEFAULT_GUILD_CONFIG from '../default';

type Greenwich = 'pm' | 'am';
type Ordinal   = 'st' | 'nd' | 'rd' | 'th';

interface Schedule {
	hours?: string;
	minutes?: string;
	dayOfMonth?: string;
	month?: string;
	dayOfWeek?: string;
	greenwich?: Greenwich;
	ordinal?: Ordinal;
}

interface Command {
	name: string;
	args?: string[];
}

interface Cron {
	id: number;
	schedule?: Schedule;
	command?: Command;
	executed_at?: number;
}

const MATCHERS = {
	hour_mins:
		/^(((0|1)[0-9])|2[0-3]):[0-5][0-9]\s?(pm|am)?$/i,
	day_of_month:
		/(?:\b)(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])(st|nd|rd|th)?)(?:\b|\/)/i,
	weekdays: 'sun mon tue wed thu fri sat'.split(' '),
	months: 'jan feb mar apr may jun jul aug sep oct nov dec'
		.split(' ').map(month => month.capitalize()),
	prefix: (x: string) => new RegExp("^\\" + x),
	ordinals: /st|nd|rd|th/,
	greenwich: /pm|am/
};

const RESPONSES = {
	help: {
		rm: 'The syntax for removing a cron job is: '
			+ '.cron rm #[job-index]'.format(FORMATS.block),
		command: ':warning: There is no command to execute the cron job on.',
		schedule: ':warning: There is no schedule to execute the command on.'
	},
	empty: ":warning: There are no cron jobs being executed.",
	removed: (id: number) =>
		`Removed cron job #${id.toString().format(FORMATS.bold)}.`,
	added: (cron: Cron) =>
		`New cron (#${cron.id.toString().format(FORMATS.bold)}) has been added.`,
	list: (cron: Cron) => {
		const { schedule } = cron;
		let result: string = "";

		result += `#${cron.id} `.format(FORMATS.bold);
		result += `${cron.command.name.shorten(20)}`.format(FORMATS.block);

		if (schedule?.hours && schedule?.minutes) {
			result += `: ${schedule.hours}:${schedule.minutes}`;
			if (schedule?.greenwich)
				result += `${schedule.greenwich.toUpperCase()}`;
			result += ' :clock3: ';
		}

		if (schedule?.dayOfWeek) {
			const weekday = MATCHERS.weekdays[
				Number(schedule.dayOfWeek) - 1
			]?.toUpperCase();

			result += `${weekday}, `;
		}

		if (schedule?.dayOfMonth) {
			const month = MATCHERS.months[
				Number(schedule.month) - 1
			]?.capitalize();

			result += `${month} ${schedule.dayOfMonth}`;

			if (schedule?.ordinal)
				result += `${schedule.ordinal}`;
		}

		return result;
	}
};

export class Timer {
	private homescope: HomeScope;

	constructor(homescope: HomeScope) {
		this.homescope = homescope;
	}

	compare(job: Cron): void {
		const current = new Date();
		current.setDate(current.getDate());
		current.setUTCHours(current.getHours() % 12);
		current.setSeconds(0);
		current.setMilliseconds(0);

		if (current.getTime() === this.timestamp(job))
			this.dispatch(job, current.getTime());
	}

	timestamp(job: Cron): number {
		const date = new Date();
		const { hours, minutes, month, dayOfMonth } = job.schedule;

		date.setUTCHours(Number(hours), Number(minutes), 0);
		date.setMonth(Number(month) - 1);
		date.setMilliseconds(0);
		date.setDate(Number(dayOfMonth));

		return date.getTime();
	}

	dispatch(job: Cron, timespan: number) {
		if (job.executed_at === timespan)
			return;

		console.log('Executed cron job #' + job.id);

		this.homescope.message.content =
			`${this.homescope.CONFIG.commands.prefix} ${job.command.name} ${job.command.args.join(' ')}`;

		job.executed_at = timespan;

		this.homescope.main.process_command(
			this.homescope.message
		);
	}

	verify(jobs: Cron[]): void {
		jobs.forEach((job: Cron) => this.compare(job));
	}
}

export default (home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	if (args.length === 0 || args[0] === 'help') {
		return message.channel.send(
			help_info('cron', CONFIG.commands.prefix)
		);
	}

	const cleanup = (jobs: Cron[]): Cron[] => jobs
		.filter(x => x != null)
		.map((x, i) => {
			x.id = i;
			return x;
		});

	let crons: Cron[] = cleanup(CONFIG.cron_jobs);
	const timer = new Timer(home_scope);

	setInterval(() => {
		timer.verify(crons);
	}, DEFAULT_GUILD_CONFIG.cron_interval);

	const submit = () =>
		CONFIG.cron_jobs = crons;

	const matches = (value: string, regex: RegExp): string | undefined =>
		(value.match(regex) || {})?.input;

	const rm = (job: number) => {
		delete crons[crons.map(x => x.id).indexOf(job)];
		crons = cleanup(crons);
		submit();
		message.answer(RESPONSES.removed(job));
	};

	const list = () => {
		if (crons.length === 0)
			return message.answer(RESPONSES.empty);

		console.log('list command:', crons
					.filter(x => x !== null)
					.map(x => RESPONSES.list(x))
					.join("\n"));

		message.channel.send(
			crons
				.filter(x => x !== null)
				.map(x => RESPONSES.list(x))
				.join("\n")
		);
	};

	const parse = (argm: string[]): Cron => {
		const cron: Cron = {
			id: crons.slice(-1)[0]?.id + 1 || 0
		};

		argm.some((argument, i) => {
			argument = argument.trim();

			switch (argument) {
				case (
					matches(argument, MATCHERS.prefix(CONFIG.commands.prefix))
				): cron.command = {
						name: argument.split(CONFIG.commands.prefix)[1],
						args: argm.slice(i + 1)
					};
					break;
				case (matches(argument, MATCHERS.hour_mins)):
					const [hour, mins] = argument.split(':');
					const [min, greenwich] = mins.split(MATCHERS.greenwich);

					cron.schedule = {
						hours: hour,
						minutes: min,
						greenwich: greenwich as Greenwich
					};
					break;
				case (matches(argument, MATCHERS.day_of_month)):
					const [dayOfMonth, ordinal] =
						argument.split(MATCHERS.ordinals);

					const date =
						matches(argument, MATCHERS.ordinals) === undefined
						? { month: argument }
						: { dayOfMonth, ordinal: ordinal as Ordinal };

					cron.schedule = {
						...cron.schedule,
						...date
					};
					break;
			}

			argument = argument.toLowerCase();

			if (MATCHERS.weekdays.includes(argument)) {
				cron.schedule = {
					...cron.schedule,
					dayOfWeek: (
						MATCHERS.weekdays.indexOf(argument) + 1
					).toString()
				};
			}
		});

		return cron;
	};

	if (args[0] === 'ls')
		list();
	else if (args[0] === 'rm') {
		const job: number = Number(args[1]);

		(isNaN(job))
			? message.answer(RESPONSES.help.rm)
			: rm(job);
	}
	else {
		const cron: Cron = parse(args);

		if (!cron?.command)
			message.answer(RESPONSES.help.command);
		else if (!cron?.schedule)
			message.answer(RESPONSES.help.schedule);
		else {
			crons.push(cron);
			submit();
			message.answer(RESPONSES.added(cron));
		}
	}
};
