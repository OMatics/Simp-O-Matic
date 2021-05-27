import { FORMATS } from '../extensions';
import { help_info } from '../utils';
import DEFAULT_GUILD_CONFIG from '../default';

type Greenwich = 'pm' | 'am';
type Ordinal   = 'st' | 'nd' | 'rd' | 'th';
type AnyValue  = '*';

interface ListValue {
	values: string[];
}

interface RangeValue {
	range: string[];
	step?: string;
}

interface PlaceValue {
	[place: number]: object;
}

type Expr = string
	| RangeValue
	| ListValue
	| AnyValue;

enum Place {
	MINUTE,
	HOUR,
	MONTHDAY,
	MONTH,
	WEEKDAY
}

interface Schedule {
	hours: Expr;
	minutes: Expr;
	dayOfMonth: Expr;
	month: Expr;
	dayOfWeek: Expr;
	greenwich: Greenwich;
	ordinal: Ordinal;
}

type Defaults = keyof Omit<Schedule, 'greenwich' | 'ordinal'>;

interface Command {
	name: string;
	args?: string[];
}

interface Cron {
	id: number;
	schedule?: Partial<Schedule>;
	command?: Command;
	executed_at?: number;
}

const MATCHERS = {
	hour_mins: '^(((0|1)[0-9])|2[0-3]):[0-5][0-9]\\s?(pm|am)?$',
	day_of_month: '^(?:\\b)(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])(st|nd|rd|th)?)(?:\\b|\\/)$',
	any_value: '^\\*$',
	numerics: '(^(\\d\\.?)+$)',
	range: '(^\\d+\\-\\d+|\\*\\/\\d+)(\\/\\d+)?$',
	list: '^(\\d+\\,\\d+)$',
	weekdays: 'sun mon tue wed thu fri sat'.split(' '),
	months: 'jan feb mar apr may jun jul aug sep oct nov dec'
		.split(' ').map(month => month.capitalize()),
	prefix: (x: string) => "^\\" + x,
	ordinals: '(st|nd|rd|th)',
	greenwich: '(pm|am)'
};

const RESPONSES = {
	help: {
		rm: 'The syntax for removing a cron job is: '
			+ '.cron rm #[job-index]'.format(FORMATS.block),
		command: ':warning: There is no command to execute the cron job on.',
		schedule: ':warning: There is no schedule to execute the command on.'
	},
	empty: ":warning: There are no cron jobs being executed.",
	clear: "Cleared all executed cron jobs.",
	removed: (id: number) => `Removed cron job #${id.toString().format(FORMATS.bold)}.`,
	added: (cron: Cron) => `New cron (#${cron.id.toString().format(FORMATS.bold)}) has been added.`,
	list: (cron: Cron) => {
		const { schedule } = cron;
		let result: string = "";

		result += `#${cron.id} `.format(FORMATS.bold);
		result += `${cron.command.name} ${cron.command.args.join(' ')}`
			.shorten(20).format(FORMATS.block);

		if (schedule?.hours && schedule?.minutes) {
			result += `: ${schedule.hours}:${schedule.minutes}`;
			if (schedule?.greenwich)
				result += schedule.greenwich.toUpperCase();
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

		if (cron?.executed_at)
			return result.format(FORMATS.strikethrough);

		return result;
	}
};

export class Timer {
	private homescope: HomeScope;

	constructor(homescope: HomeScope) {
		this.homescope = homescope;
	}

	get now(): number {
		const now = new Date();
		now.toLocaleString('en-US', { timeZone: 'America/New_York' });
		now.setDate(now.getDate());
		now.setUTCHours(now.getHours() % 12);
		now.setSeconds(0);
		now.setMilliseconds(0);

		console.log('Now:', now);

		return now.getTime();
	}

	timestamp(job: Cron): number {
		const date = new Date();
		const { hours, minutes, month, dayOfMonth } = job.schedule;

		date.toLocaleString('en-US', { timeZone: 'America/New_York' });
		date.setUTCHours(Number(hours), Number(minutes), 0);
		date.setMonth(Number(month));
		date.setMilliseconds(0);
		date.setSeconds(0);
		date.setDate(Number(dayOfMonth) - 1);

		console.log('Job #', job.id, 'time:', date);

		return date.getTime();
	}

	compare(job: Cron): void {
		if (this.now === this.timestamp(job))
			this.dispatch(job, this.now);
	}

	dispatch(job: Cron, timespan: number): void {
		if (job.executed_at === timespan)
			return;

		console.log('Executed cron job #', job.id);

		this.homescope.message.content =
			`${job.command.name} ${job.command.args.join(' ')}`;

		job.executed_at = timespan;

		this.homescope.message.reply("Ran cron #" + job.id);

		// `on_message` does important expansions.
		this.homescope.main.on_message(
			this.homescope.message,
			this.homescope.CLIENT,
			true
		);
	}

	verify(jobs: Cron[]): void {
		jobs.forEach(job => this.compare(job));
	}
}

export default (homescope: HomeScope) => {
	const { message, args, CONFIG } = homescope;

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
	const timer = new Timer(homescope);

	setInterval(() => {
		timer.verify(crons);
	}, DEFAULT_GUILD_CONFIG.cron_interval);

	const submit = () =>
		CONFIG.cron_jobs = crons;

	const matches = (value: string, regex: string): string | undefined =>
		(value.match(new RegExp(regex)) || {})?.input;

	const rm = (job: number) => {
		delete crons[crons.map(x => x.id).indexOf(job)];
		crons = cleanup(crons);
		submit();
		message.reply(RESPONSES.removed(job));
	};

	const clear = () => {
		crons = crons.filter(f => !f?.executed_at);
		submit();
		message.reply(RESPONSES.clear);
	};

	const list = () => {
		if (crons.length === 0)
			return message.reply(RESPONSES.empty);

		message.channel.send(
			crons
				.filter(x => x !== null)
				.map(x => RESPONSES.list(x))
				.join("\n")
		);
	};

	const tokenize = (args: string[]): Cron => {
		const { prefix } = CONFIG.commands;

		let cron: Cron = {
			id: crons.slice(-1)[0]?.id + 1 || 0
		};

		const add = (schedule: Partial<Schedule>): void => {
			cron.schedule = {
				...cron.schedule,
				...schedule
			};
		};

		const populate = (value: Expr, position: number): void => {
			add(({
				[Place.HOUR]:     { hours:      value },
				[Place.MINUTE]:   { minutes:    value },
				[Place.MONTHDAY]: { dayOfMonth: value },
				[Place.WEEKDAY]:  { dayOfWeek:  value },
				[Place.MONTH]:    { month:      value }
			} as PlaceValue)[position]);
		};

		const set_command = (expr: string, index: number): void => {
			cron.command = {
				name: expr,
				args: args.slice(index + 1)
			};
		};

		const set_hour_mins = (expr: string): void => {
			const [hour, mins] = expr.split(':');
			const [min, greenwich] = mins.split(new RegExp(MATCHERS.greenwich));

			add({
				hours: hour,
				minutes: min,
				greenwich: greenwich as Greenwich
			});
		};

		const set_day_of_month = (expr: string): void => {
			const [dayOfMonth, ordinal] =
				expr.split(new RegExp(MATCHERS.ordinals));

			const date =
				matches(expr, MATCHERS.ordinals) === undefined
				? { month: expr }
				: { dayOfMonth, ordinal: ordinal as Ordinal };

			add(date);
		};

		const set_day_of_week = (expr: string): void => {
			add({
				dayOfWeek: (
					MATCHERS.weekdays.indexOf(expr) + 1
				).toString()
			});
		};

		const set_numerics = (expr: Expr, position: number): void => {
			populate(expr, position);
		};

		const set_any_value = (position: number): void => {
			if (cron.schedule?.hours &&
				cron.schedule?.minutes &&
				cron.schedule?.hours !== '*' &&
				cron.schedule?.minutes !== '*' &&
				cron.schedule?.greenwich) position += 1;

			args[position] = '';
			populate('*', position);
		};

		const set_range = (expr: string, position: number): void => {
			let [from, to, step] = expr.split(/[\-\/]/);
			const values: RangeValue = { range: [from, to] };

			const has_step = (range: string[]) =>
				range[0] == '*' && Number(range[1]) != NaN;

			if (has_step(values.range))
				step = values.range[1];

			if (step) values.step = step;

			populate(values, position);
		};

		const set_list = (expr: string, position: number): void => {
			const values = expr.split(',');
			const list: ListValue = { values };

			populate(list, position);
		};

		const get_defaults = (key: Defaults): string => {
			const now = new Date();

			return {
				hours:      now.getHours(),
				minutes:    now.getMinutes(),
				month:      now.getMonth(),
				dayOfMonth: now.getDate(),
				dayOfWeek:  now.getDay()
			}[key].toString();
		};

		args.some((argument, i) => {
			let position = args.indexOf(argument);

			const MAPPINGS: Record<string, Function> = {
				[MATCHERS.prefix(prefix)]: () => set_command(argument, i),
				[MATCHERS.hour_mins]:      () => set_hour_mins(argument),
				[MATCHERS.range]:          () => set_range(argument, position),
				[MATCHERS.list]:           () => set_list(argument, position),
				[MATCHERS.numerics]:       () => set_numerics(argument, position),
				[MATCHERS.day_of_month]:   () => set_day_of_month(argument),
				[MATCHERS.any_value]:      () => set_any_value(position)
			};

			for (let matcher in MAPPINGS)
				if (matches(argument, matcher))
					MAPPINGS[matcher]();

			argument = argument.toLowerCase();

			if (MATCHERS.weekdays.includes(argument))
				set_day_of_week(argument);
		});

		Object
			.keys(cron.schedule as object)
			.forEach((value: string) => {
				let key = <Defaults>value;

				if (cron.schedule && cron.schedule[key] == '*')
					cron!.schedule[key] = get_defaults(key);
			});

		return cron;
	};

	if (args[0] === 'ls')
		list();
	else if (args[0] === 'rm') {
		const job: number = Number(args[1]);

		isNaN(job)
			? message.reply(RESPONSES.help.rm)
			: rm(job);
	}
	else if (args[0] === 'clear') {
		clear();
	}
	else {
		const cron: Cron = tokenize(args);

		if (!cron?.command)
			message.reply(RESPONSES.help.command);
		else if (!cron?.schedule)
			message.reply(RESPONSES.help.schedule);
		else {
			crons.push(cron);
			submit();
			message.reply(RESPONSES.added(cron));
		}
	}
};
