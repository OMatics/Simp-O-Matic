interface Schedule {
	hours?: string;
	minutes?: string;
	dayOfMonth?: string;
	month?: string;
	dayOfWeek?: string;
}

interface Command {
	name: string,
	args?: string[]
};

interface Cron {
	job: number,
	schedule?: Schedule,
	command?: Command
};

const RESPONSES = {
	help: {
		rm: '.cron rm #[job-index]',
		command: ':warning: There is no command to execute the cron job on.',
		schedule: ':warning: There is no schedule to execute the command on.'
	},
	added: 'New cron job has been added', // TODO
	empty: ":warning: There are no cron jobs being executed."
};

const MATCHERS = {
	hour_mins:
		/^(((0|1)[0-9])|2[0-3]):[0-5][0-9]\s?(pm|am)?$/i,
	day_of_month:
		/(?:\b)(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])(st|nd|rd|th)?)(?:\b|\/)/i,
	weekdays: 'mon tue wed thu fri sat sun'.split(' '),
	prefix: (prefix: string) => new RegExp(`^${prefix}`),
	ordinals: /st|nd|rd|th/,
	greenwich: /pm|am/
};

export default (home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	// let command  = `20:32pm 26th 7 fri ${prefix}echo poopoo`;
	let crons: Cron[] = CONFIG.cron_jobs;

	const matches = (value: string, regex: RegExp): string | undefined =>
		(value.match(regex) || {})?.input;

	const rm = (job: number) =>
		delete crons[crons.map(cron => cron.job).indexOf(job)];

	// TODO
	const list = () => {
		if (crons.length == 0)
			return message.answer(RESPONSES.empty);

		crons.each(cron => message.answer("Can't list jobs yet..."));
	}

	const parse = (args: string[]): Cron => {
		let cron: Cron = {
			job: crons.slice(-1)[0]?.job + 1 || 0
		};

		args.some((argument, i) => {
			switch (argument) {
				case (matches(argument, MATCHERS.prefix(CONFIG.commands.prefix))):
					cron.command = {
						name: argument,
						args: args.slice(i + 1)
					};
					break;
				case (matches(argument, MATCHERS.hour_mins)):
					const [hour, min] = argument.split(':');

					cron.schedule = {
						hours: hour,
						minutes: min.split(MATCHERS.greenwich)[0]
					};
					break;
				case (matches(argument, MATCHERS.day_of_month)):
					const date =
						matches(argument, MATCHERS.ordinals) == undefined
						? { month: argument }
						: { dayOfMonth: argument.split(MATCHERS.ordinals)[0] };

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

	let options = args.join(' ').split(' ');

	if (options[0] === 'ls')
		list();
	else if (options[0] === 'rm') {
		let job: number = Number(options[1]);

		(isNaN(job))
			? message.answer(RESPONSES.help.rm)
			: rm(job);
	}
	else {
		const cron: Cron = parse(options);

		if (!cron?.command)
			message.answer(RESPONSES.help.command);
		else if (!cron?.schedule)
			message.answer(RESPONSES.help.schedule)
		else {
			crons.push(parse(options));
			message.answer(RESPONSES.added);
		}
	}
};
